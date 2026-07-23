<?php

declare(strict_types=1);

require_once __DIR__ . "/session-bootstrap.php";

header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store");
header("X-Content-Type-Options: nosniff");

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    header("Allow: GET");
    echo json_encode([
        "status" => "error",
        "message" => "Метод не поддерживается",
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

startSiteSession();

if (empty($_SESSION["feedback_csrf"])) {
    $_SESSION["feedback_csrf"] = bin2hex(random_bytes(32));
}

echo json_encode([
    "status" => "success",
    "csrfToken" => $_SESSION["feedback_csrf"],
], JSON_UNESCAPED_UNICODE);
