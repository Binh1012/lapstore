<?php

class View
{
    // $data se duoc "extract" thanh cac bien rieng le de su dung truc tiep trong file view.
    // Vi du: View::render('home', ['products' => $list]) => trong home.php dung duoc bien $products
    public static function render(string $viewName, array $data = []): void
    {
        extract($data);
        $viewPath = __DIR__ . '/../views/' . $viewName . '.php';

        if (!file_exists($viewPath)) {
            echo "View không tồn tại: " . htmlspecialchars($viewName);
            return;
        }

        require $viewPath;
    }

    public static function partial(string $partialName, array $data = []): void
    {
        extract($data);
        $partialPath = __DIR__ . '/../views/partials/' . $partialName . '.php';

        if (file_exists($partialPath)) {
            require $partialPath;
        }
    }
}
