<?php

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if ($path === '/index.html') {
    header('Location: /', true, 301);
    return;
}

if ($path === '/privacy-policy.php' || $path === '/personal-data-consent.php') {
    header('Location: ' . substr($path, 0, -4) . '.html', true, 301);
    return;
}

if (in_array($path, ['/', '/news/publications.html', '/privacy-policy.html', '/personal-data-consent.html', '/csrf.php', '/send.php', '/robots.txt', '/sitemap.xml'], true)) {
    return false;
}

if (str_starts_with($path, '/assets/') && !str_contains(rawurldecode($path), "\0")) {
    $assets = realpath($_SERVER['DOCUMENT_ROOT'] . '/assets');
    $file = realpath($_SERVER['DOCUMENT_ROOT'] . rawurldecode($path));
    if ($assets !== false && $file !== false && str_starts_with($file, $assets . DIRECTORY_SEPARATOR) && is_file($file)) {
        return false;
    }
}

http_response_code(404);
header('X-Robots-Tag: noindex, nofollow');
readfile($_SERVER['DOCUMENT_ROOT'] . '/404.html');
