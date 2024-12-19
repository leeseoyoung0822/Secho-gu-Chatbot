from flask import Flask, request, jsonify
import openai
import os
import pdfplumber
import pytesseract
from PIL import Image
from langchain.docstore.document import Document
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import OpenAIEmbeddings
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
upload_dir = os.path.join(BASE_DIR, 'uploads')  # 절대 경로 사용

# Chroma용 persist 디렉토리 생성
persist_dir = os.path.join(BASE_DIR, 'chroma_db')
os.makedirs(persist_dir, exist_ok=True)

def extract_text_with_ocr(page):
    text = page.extract_text()
    if not text:
        image = page.to_image(resolution=200)
        img = image.convert("RGB")
        pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'  # Tesseract 경로 확인
        text = pytesseract.image_to_string(img)
    return text

def paragraph_splitter(text):
    paragraphs = text.split("\n\n")
    cleaned_paragraphs = [p.strip() for p in paragraphs if p.strip()]
    return cleaned_paragraphs

def load_and_retrieve_docs(file_path):
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = extract_text_with_ocr(page)
                if page_text:
                    text += page_text
    except Exception as e:
        return f"Error reading PDF file: {e}"

    if not text:
        return "No text found in the PDF file."

    paragraphs = paragraph_splitter(text)
    docs = [Document(page_content=p) for p in paragraphs]

    embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")
    # persist_directory를 지정하여 chroma_db 폴더에 인덱스 저장
    vectorstore = Chroma.from_documents(
        documents=docs,
        embedding=embeddings,
        persist_directory=persist_dir
    )

    return vectorstore.as_retriever()

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

def rag_chain(file_path, question):
    retriever = load_and_retrieve_docs(file_path)
    if isinstance(retriever, str):
        return retriever

    retrieved_docs = retriever.get_relevant_documents(question)
    formatted_context = format_docs(retrieved_docs)
    formatted_prompt = f"Question: {question}\n\nContext: {formatted_context}"

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant. Check the pdf content and answer the question."},
            {"role": "user", "content": formatted_prompt}
        ]
    )

    return response['choices'][0]['message']['content']

@app.route('/upload_file', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify(message="파일이 없습니다."), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify(message="파일 이름이 비어 있습니다."), 400

    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)
    file.save(file_path)
    return jsonify(message="파일 업로드 완료", filename=file.filename)

@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    question = data.get('question', '')
    filename = data.get('filename', '')

    if not filename:
        return jsonify(answer="파일이 지정되지 않았습니다."), 400

    file_path = os.path.join(upload_dir, filename)
    print("Checking file path:", file_path, os.path.exists(file_path))  # 디버깅용 출력

    if not os.path.exists(file_path):
        return jsonify(answer=f"지정한 파일이 존재하지 않습니다. ({file_path})"), 400

    if not question.strip():
        return jsonify(answer="질문을 입력해주세요."), 400

    answer = rag_chain(file_path, question)
    return jsonify(answer=answer)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
