<?php

http_response_code(404);
header('X-Robots-Tag: noindex, nofollow', true);
?>
<!doctype html>
<html lang="ru">
<head>
   <meta charset="utf-8">
   <meta name="viewport" content="width=device-width, initial-scale=1">
   <meta name="robots" content="noindex, nofollow">
   <title>Страница не найдена — Оксана Лемешева</title>
   <link rel="shortcut icon" type="image/x-icon" href="/assets/imgs/favicon.svg">
   <link rel="stylesheet" href="/assets/css/bootstrap.min.css">
   <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
   <main class="error-area section-space d-flex align-items-center">
      <div class="container text-center">
         <p class="section-subtitle">Ошибка 404</p>
         <h1 class="slider-title-2">Страница не найдена</h1>
         <p>Возможно, адрес изменился или страница была удалена.</p>
         <a class="fill-btn" href="/">Вернуться на главную</a>
      </div>
   </main>
   <div id="cookie-notice-root"></div>
   <script src="/assets/js/cookie-consent.js"></script>
</body>
</html>
