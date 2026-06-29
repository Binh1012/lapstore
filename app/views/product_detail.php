<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<?php /** @var string $pageTitle */ ?>
<?php /** @var array|null $product */ ?>
<title><?= htmlspecialchars($pageTitle) ?></title>
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

  <?php View::partial('header'); ?>
  <?php View::partial('navbar'); ?>

  <?php if ($product === null): ?>

    <div class="not-found">
      Không tìm thấy sản phẩm bạn yêu cầu.<br>
      <a href="index.php">Quay về trang chủ</a>
    </div>

  <?php else: ?>

    <div class="breadcrumb">
      <a href="index.php">Trang chủ</a> / <?= htmlspecialchars($product['name']) ?>
    </div>

    <section class="product-detail-section">
      <div class="product-detail-img"></div>

      <div class="product-detail-info">
        <h1><?= htmlspecialchars($product['name']) ?></h1>

        <div class="product-detail-price">
          <?= number_format($product['price'], 0, ',', '.') ?>đ
          <?php if (!empty($product['old_price'])): ?>
            <span class="product-price-old"><?= number_format($product['old_price'], 0, ',', '.') ?>đ</span>
          <?php endif; ?>
        </div>

        <p class="product-detail-desc"><?= htmlspecialchars($product['description']) ?></p>

        <button class="buy-btn">Mua ngay</button>
      </div>
    </section>

  <?php endif; ?>

  <?php View::partial('footer'); ?>

</body>
</html>
