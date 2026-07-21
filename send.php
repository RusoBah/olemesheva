<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . "/PHPMailer/src/Exception.php";
require __DIR__ . "/PHPMailer/src/PHPMailer.php";
require __DIR__ . "/PHPMailer/src/SMTP.php";

header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store");

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Метод не поддерживается"], JSON_UNESCAPED_UNICODE);
    exit;
}

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";
$requestHost = strtolower(preg_replace('/:\d+$/', '', $_SERVER["HTTP_HOST"] ?? ""));
$originHost = strtolower((string) parse_url($origin, PHP_URL_HOST));
if ($origin !== "" && ($requestHost === "" || !hash_equals($requestHost, $originHost))) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Источник запроса не разрешён"], JSON_UNESCAPED_UNICODE);
    exit;
}

$csrfToken = (string) ($_POST["csrf_token"] ?? "");
$sessionToken = (string) ($_SESSION["feedback_csrf"] ?? "");
if ($sessionToken === "" || $csrfToken === "" || !hash_equals($sessionToken, $csrfToken)) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Сессия формы устарела. Обновите страницу"], JSON_UNESCAPED_UNICODE);
    exit;
}

if (trim((string) ($_POST["company"] ?? "")) !== "") {
    echo json_encode([
        "status" => "success",
        "message" => "Сообщение отправлено",
        "csrfToken" => $_SESSION["feedback_csrf"],
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$lastSubmitAt = (int) ($_SESSION["feedback_last_submit_at"] ?? 0);
if ($lastSubmitAt > 0 && time() - $lastSubmitAt < 15) {
    http_response_code(429);
    echo json_encode(["status" => "error", "message" => "Повторите отправку через несколько секунд"], JSON_UNESCAPED_UNICODE);
    exit;
}

$name = trim((string) ($_POST["name"] ?? ""));
$telRaw = trim((string) ($_POST["tel"] ?? ""));
$email = trim((string) ($_POST["email"] ?? ""));
$heading = trim((string) ($_POST["heading"] ?? ""));
$message = trim((string) ($_POST["message"] ?? ""));
$privacyConsent = (string) ($_POST["privacy_consent"] ?? "");
$textLength = static function (string $value): int {
    return function_exists("mb_strlen") ? mb_strlen($value, "UTF-8") : strlen($value);
};

if ($privacyConsent !== "1") {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Подтвердите согласие на обработку персональных данных"], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($name === "" || $textLength($name) > 100 || preg_match('/[\x00-\x1F\x7F]/u', $name)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Укажите корректное имя"], JSON_UNESCAPED_UNICODE);
    exit;
}

$telDigits = preg_replace('/\D+/', '', $telRaw);
if (strlen($telDigits) === 10) {
    $telDigits = "7" . $telDigits;
} elseif (strlen($telDigits) === 11 && $telDigits[0] === "8") {
    $telDigits[0] = "7";
}

if (!preg_match('/^7\d{10}$/', $telDigits)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Укажите телефон в российском формате"], JSON_UNESCAPED_UNICODE);
    exit;
}
$tel = "+" . $telDigits;

if ($email !== "" && ($textLength($email) > 254 || filter_var($email, FILTER_VALIDATE_EMAIL) === false)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Укажите корректный email"], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($textLength($heading) > 200 || $textLength($message) > 2000) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Сообщение превышает допустимую длину"], JSON_UNESCAPED_UNICODE);
    exit;
}

$rateLimitFile = sys_get_temp_dir() . DIRECTORY_SEPARATOR . "olemesheva-feedback-" . hash("sha256", $_SERVER["REMOTE_ADDR"] ?? "unknown") . ".limit";
$rateLimitHandle = @fopen($rateLimitFile, "c+");
if ($rateLimitHandle !== false && flock($rateLimitHandle, LOCK_EX)) {
    $storedTimestamp = (int) stream_get_contents($rateLimitHandle);
    if ($storedTimestamp > 0 && time() - $storedTimestamp < 15) {
        flock($rateLimitHandle, LOCK_UN);
        fclose($rateLimitHandle);
        http_response_code(429);
        echo json_encode(["status" => "error", "message" => "Повторите отправку через несколько секунд"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    rewind($rateLimitHandle);
    ftruncate($rateLimitHandle, 0);
    fwrite($rateLimitHandle, (string) time());
    fflush($rateLimitHandle);
    flock($rateLimitHandle, LOCK_UN);
    fclose($rateLimitHandle);
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

    $_SESSION["feedback_last_submit_at"] = time();
    $_SESSION["feedback_csrf"] = bin2hex(random_bytes(32));

    echo json_encode([
        "status" => "success",
        "message" => "Сообщение отправлено",
        "csrfToken" => $_SESSION["feedback_csrf"],
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    file_put_contents(__DIR__ . "/mail-error.log", "[" . date("Y-m-d H:i:s") . "] " . $mail->ErrorInfo . PHP_EOL, FILE_APPEND | LOCK_EX);
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Ошибка при отправке"], JSON_UNESCAPED_UNICODE);
}
