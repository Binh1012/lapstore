<?php

require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../core/View.php';

class HomeController
{
    public function index(): void
    {
        $products = Product::all();
        $productsBySegment = Product::segments();

        View::render('home', [
            'pageTitle' => 'Trang chủ - LaptopStore',
            'products' => $products,
            'productsBySegment' => $productsBySegment,
        ]);
    }
}
