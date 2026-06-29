<?php

class Product
{
    private static array $segments = [
        [
            'anchor' => 'segment-office',
            'title' => 'PHÂN KHÚC KHỞI ĐẦU: HOÀN THIỆN GÓC MÁY CƠ BẢN',
            'items' => [
                [
                    'id' => 1,
                    'name' => 'PC Văn phòng Intel Core i3 / RAM 8GB / SSD 256GB',
                    'price' => 5000000,
                    'old_price' => 6500000,
                    'description' => 'Cấu hình PC văn phòng cơ bản, phù hợp cho học tập, soạn thảo văn bản, lướt web.',
                ],
                [
                    'id' => 2,
                    'name' => 'PC Văn phòng AMD Ryzen 5 / RAM 16GB / SSD 512GB',
                    'price' => 9500000,
                    'old_price' => null,
                    'description' => 'Cấu hình bền bỉ cho công việc văn phòng, đa nhiệm tốt với nhiều ứng dụng cùng lúc.',
                ],
            ],
        ],
        [
            'anchor' => 'segment-design',
            'title' => 'PHÂN KHÚC CHUYÊN NGHIỆP: NÂNG TẦM TRẢI NGHIỆM',
            'items' => [
                [
                    'id' => 3,
                    'name' => 'PC Đồ họa Core i7 / RAM 32GB / RTX 4060 / SSD 1TB',
                    'price' => 10300000,
                    'old_price' => null,
                    'description' => 'Cấu hình mạnh cho dựng phim, thiết kế đồ họa, render 3D, đáp ứng tốt các phần mềm chuyên dụng.',
                ],
                [
                    'id' => 4,
                    'name' => 'PC Gaming Entry Core i5 / RAM 16GB / SSD 512GB',
                    'price' => 7200000,
                    'old_price' => null,
                    'description' => 'Cấu hình phù hợp cho thiết kế đồ họa nhẹ và chỉnh sửa ảnh, đồng thời vẫn dùng tốt cho giải trí.',
                ],
            ],
        ],
        [
            'anchor' => 'segment-hiend',
            'title' => 'PHÂN KHÚC HI-END & ĐẲNG CẤP DOANH NGHIỆP: ĐẶC QUYỀN TỐI THƯỢNG',
            'items' => [
                [
                    'id' => 5,
                    'name' => 'PC Hi-end Core i9 / RAM 64GB / RTX 4090 / SSD 2TB',
                    'price' => 85000000,
                    'old_price' => 92000000,
                    'description' => 'Cấu hình đỉnh cao cho dựng phim 4K, AI training, render nặng và gaming 4K 144Hz.',
                ],
                [
                    'id' => 6,
                    'name' => 'PC Chuyên nghiệp Core i7 / RAM 32GB / RTX 4070',
                    'price' => 32000000,
                    'old_price' => null,
                    'description' => 'Cấu hình cho streamer, editor video, chơi game AAA mượt ở thiết lập cao.',
                ],
            ],
        ],
    ];

    public static function all(): array
    {
        return array_merge(...array_column(self::$segments, 'items'));
    }

    public static function segments(): array
    {
        return self::$segments;
    }

    public static function find(int $id): ?array
    {
        foreach (self::all() as $product) {
            if ($product['id'] === $id) {
                return $product;
            }
        }

        return null;
    }
}
