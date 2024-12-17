<?php
// upload.php

// 업로드된 파일이 있는지 확인
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file']) && isset($_POST['message'])) {
        $file = $_FILES['file'];
        $message = $_POST['message'];

        // 파일 오류 체크
        if ($file['error'] !== UPLOAD_ERR_OK) {
            die("File upload error.");
        }

        // 파일 확장자 및 크기 체크
        $allowedExtensions = ['pdf', 'docx'];
        $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
        if (!in_array($fileExtension, $allowedExtensions)) {
            die("Invalid file type. Only PDF and DOCX allowed.");
        }

        // 파일을 저장할 경로
        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // 파일 이동
        $filePath = $uploadDir . basename($file['name']);
        if (move_uploaded_file($file['tmp_name'], $filePath)) {
            echo "File uploaded successfully: " . $filePath;

            // 사용자의 입력을 텍스트 파일로 저장
            $textFilePath = $uploadDir . 'message_' . time() . '.txt'; // 시간 기반의 고유 파일 이름
            file_put_contents($textFilePath, $message); // 메시지를 텍스트 파일로 저장

            echo "<br>Message saved successfully: " . $textFilePath;
        } else {
            die("Failed to move uploaded file.");
        }
    } else {
        die("No file or message provided.");
    }
} else {
    die("Invalid request method.");
}
?>
