<?php

require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../core/View.php';

class ProductController
{
    public function show(int $id): void
    {
        $product = Product::find($id);

        if ($product === null) {
            View::render('product_detail', [
                'pageTitle' => 'Không tìm thấy sản phẩm - LaptopStore',
                'product' => null,
            ]);
            return;
        }

        View::render('product_detail', [
            'pageTitle' => $product['name'] . ' - LaptopStore',
            'product' => $product,
        ]);
    }
}
