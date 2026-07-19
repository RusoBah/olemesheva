<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . "/PHPMailer/src/Exception.php";
require __DIR__ . "/PHPMailer/src/PHPMailer.php";
require __DIR__ . "/PHPMailer/src/SMTP.php";

header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Метод не поддерживается"], JSON_UNESCAPED_UNICODE);
    exit;
}

$name = trim($_POST["name"] ?? "");
$tel = trim($_POST["tel"] ?? "");
$email = trim($_POST["email"] ?? "");
$heading = trim($_POST["heading"] ?? "");
$message = trim($_POST["message"] ?? "");

if (empty($name) && empty($tel) && empty($email)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Заполните имя, телефон или email"], JSON_UNESCAPED_UNICODE);
    exit;
}

$mail = new PHPMailer(true);

try {
    $mail->CharSet = "UTF-8";
    $mail->isSMTP();
    $mail->Host = "smtp.mail.ru";
    $mail->Port = 465;
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    
    // Настройки SMTP - замените на свои данные
    $mail->Username = "79265799840@mail.ru";        // Ваш email на Mail.ru
    $mail->Password = getenv('SMTP_PASSWORD') ?: '';         // Пароль для приложений

    // Настройки отправителя и получателя - замените на свои данные
    $mail->setFrom("79265799840@mail.ru", "Форма с сайта");  // Email отправителя
    $mail->addAddress("lemeshevaoksik@gmail.com");                 // Email получателя
    
    if (!empty($email)) {
        $mail->addReplyTo($email, $name ?: "Клиент");
    }

    $mail->isHTML(true);
    $mail->Subject = "Новая заявка с сайта";

    $body = "<h3>Новая заявка с формы</h3>";
    
    if (!empty($name)) {
        $body .= "<p><strong>Имя:</strong> " . htmlspecialchars($name, ENT_QUOTES, "UTF-8") . "</p>";
    }
    
    if (!empty($tel)) {
        $body .= "<p><strong>Телефон:</strong> " . htmlspecialchars($tel, ENT_QUOTES, "UTF-8") . "</p>";
    }
    
    if (!empty($email)) {
        $body .= "<p><strong>Почта:</strong> " . htmlspecialchars($email, ENT_QUOTES, "UTF-8") . "</p>";
    }
    
    if (!empty($heading)) {
        $body .= "<p><strong>Название статьи:</strong><br>" . nl2br(htmlspecialchars($heading, ENT_QUOTES, "UTF-8")) . "</p>";
    }
	
	if (!empty($message)) {
        $body .= "<p><strong>Сообщение:</strong><br>" . nl2br(htmlspecialchars($message, ENT_QUOTES, "UTF-8")) . "</p>";
    }

    $mail->Body = $body;

    $textBody = "Новая заявка с формы\n\n";
    if (!empty($name)) $textBody .= "Имя: {$name}\n";
    if (!empty($tel)) $textBody .= "Телефон: {$tel}\n";
    if (!empty($email)) $textBody .= "Почта: {$email}\n";
    if (!empty($heading)) $textBody .= "Название статьи: {$heading}\n";
	if (!empty($message)) $textBody .= "Сообщение: {$message}\n";
    
    $mail->AltBody = $textBody;
    
    $mail->send();

    echo json_encode(["status" => "success", "message" => "Сообщение отправлено"], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    file_put_contents(__DIR__ . "/mail-error.log", "[" . date("Y-m-d H:i:s") . "] " . $mail->ErrorInfo . PHP_EOL, FILE_APPEND | LOCK_EX);
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Ошибка при отправке"], JSON_UNESCAPED_UNICODE);
}