<?php

// FRONT CONTROLLER
// Moi request deu di qua file nay (single entry point).
// Dua vao query string ?page=... de quyet dinh goi Controller nao.
//
// Vi du:
//   index.php                       -> trang chu
//   index.php?page=product&id=3     -> trang chi tiet san pham id=3

require_once __DIR__ . '/../app/controllers/HomeController.php';
require_once __DIR__ . '/../app/controllers/ProductController.php';

$page = $_GET['page'] ?? 'home';

switch ($page) {

    case 'home':
        $controller = new HomeController();
        $controller->index();
        break;

    case 'product':
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
        $controller = new ProductController();
        $controller->show($id);
        break;

    default:
        http_response_code(404);
        echo 'Trang không tồn tại.';
        break;
}
