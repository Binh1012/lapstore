<?php

class Product
{
    // Du lieu gia lap (mock data). Sau nay co the thay bang truy van PDO/MySQL
    // ma khong can sua Controller/View, vi chung chi goi cac method ben duoi.
    private static array $data = [
        [
            'id' => 1,
            'name' => 'PC Văn phòng Intel Core i3 / RAM 8GB / SSD 256GB',
            'price' => 5000000,
            'old_price' => 6500000,
            'description' => 'Cấu hình PC văn phòng cơ bản, phù hợp cho học tập, soạn thảo văn bản, lướt web. Tặng kèm chuột bàn phím.',
        ],
        [
            'id' => 2,
            'name' => 'PC Gaming Entry Core i5 / RAM 16GB / SSD 512GB',
            'price' => 7200000,
            'old_price' => null,
            'description' => 'Cấu hình chơi game eSports nhẹ, mượt mà với các tựa game phổ biến như Liên Minh, Valorant, CS2.',
        ],
        [
            'id' => 3,
            'name' => 'PC Đồ họa Core i7 / RAM 32GB / RTX 4060 / SSD 1TB',
            'price' => 10300000,
            'old_price' => null,
            'description' => 'Cấu hình mạnh cho dựng phim, thiết kế đồ họa, render 3D, đáp ứng tốt các phần mềm chuyên dụng.',
        ],
        [
            'id' => 4,
            'name' => 'PC Học tập Core i3 / RAM 8GB / SSD 256GB',
            'price' => 4800000,
            'old_price' => null,
            'description' => 'Cấu hình tiết kiệm dành cho học sinh, sinh viên, đáp ứng tốt nhu cầu học online và làm bài tập.',
        ],
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
        [
            'id' => 7,
            'name' => 'PC Văn phòng AMD Ryzen 5 / RAM 16GB / SSD 512GB',
            'price' => 9500000,
            'old_price' => null,
            'description' => 'Cấu hình bền bỉ cho công việc văn phòng, đa nhiệm tốt với nhiều ứng dụng cùng lúc.',
        ],
        [
            'id' => 8,
            'name' => 'PC Gaming Core i5 / RAM 16GB / RTX 4060',
            'price' => 18500000,
            'old_price' => 20000000,
            'description' => 'Cấu hình chơi game AAA ở mức cấu hình cao, hình ảnh đẹp, khung hình ổn định.',
        ],
    ];

    public static function all(): array
    {
        return self::$data;
    }

    public static function find(int $id): ?array
    {
        foreach (self::$data as $product) {
            if ($product['id'] === $id) {
                return $product;
            }
        }
        return null;
    }
}
