<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<?php /** @var string $pageTitle */ ?>
<?php /** @var array $productsBySegment */ ?>
<title><?= htmlspecialchars($pageTitle) ?></title>
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

  <?php View::partial('header'); ?>
  <?php View::partial('navbar'); ?>

  <!-- BANNERS -->
  <section class="banner-section">
    <div class="banner banner-1">
      <img src="assets/img/banner-1.png" alt="Đại tiệc BUILD PC RINH TRỌN Góc máy">
    </div>
    <div class="banner banner-2">
      <img src="assets/img/banner-2.png" alt="PC LẮP RÁP VĂN PHÒNG, HỌC TẬP">
    </div>
  </section>

  <!-- SEGMENT BANNERS: anh banner cho moi phan khuc, bam vao se cuon xuong vung PC tuong ung -->
  <section class="segment-section">
    <div class="segment-banners">

      <div class="segment-banner-block">
        <a class="segment-banner-link" href="#segment-office" title="Xem PC lắp ráp Văn phòng, Học tập">
          <img src="assets/img/banner-khoidau.png" alt="PC lắp ráp Văn phòng, Học tập">
        </a>
      </div>

      <div class="segment-banner-block">
        <a class="segment-banner-link" href="#segment-design" title="Xem PC lắp ráp Thiết kế Đồ họa">
          <img src="assets/img/banner-chuyennghiep.png" alt="PC lắp ráp Thiết kế Đồ họa">
        </a>
      </div>

      <div class="segment-banner-block">
        <a class="segment-banner-link" href="#segment-hiend" title="Xem PC lắp ráp Hi-end AI">
          <img src="assets/img/banner-hiend.png" alt="PC lắp ráp Hi-end AI">
        </a>
      </div>

    </div>
  </section>

  <?php foreach ($productsBySegment ?? [] as $segment): ?>
    <section class="product-section" id="<?= htmlspecialchars($segment['anchor']) ?>">
      <h2 class="product-section-title"><?= htmlspecialchars($segment['title']) ?></h2>
      <div class="product-grid">
        <?php foreach ($segment['items'] as $product): ?>
          <div class="product-card">
            <a class="product-card-link" href="index.php?page=product&amp;id=<?= $product['id'] ?>">
              <div class="product-img"></div>
              <div class="product-info">
                <div class="product-name"><?= htmlspecialchars($product['name']) ?></div>
                <div class="product-price">
                  <?= number_format($product['price'], 0, ',', '.') ?>đ
                  <?php if (!empty($product['old_price'])): ?>
                    <span class="product-price-old"><?= number_format($product['old_price'], 0, ',', '.') ?>đ</span>
                  <?php endif; ?>
                </div>
              </div>
            </a>
            <div class="product-info" style="padding-top:0;">
              <button class="buy-btn">Mua ngay</button>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </section>
  <?php endforeach; ?>

  <?php View::partial('footer'); ?>

</body>
</html>
