<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title><?= htmlspecialchars($pageTitle) ?></title>
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

  <?php View::partial('header'); ?>
  <?php View::partial('navbar'); ?>

  <!-- BANNERS -->
  <section class="banner-section">
    <div class="banner banner-1">
      <div class="banner-text">Đại tiệc BUILD PC<br>RINH TRỌN Góc máy</div>
    </div>
    <div class="banner banner-2">
      <div class="banner-text">PC LẮP RÁP<br>VĂN PHÒNG, HỌC TẬP</div>
    </div>
  </section>

  <!-- SEGMENT BANNERS: anh banner cho moi phan khuc, bam vao se cuon xuong vung PC tuong ung -->
  <section class="segment-banners">

    <div class="segment-banner-block">
      <a class="segment-banner-link" href="#product-grid" title="Xem PC lắp ráp Văn phòng, Học tập">
        <img src="assets/img/banner-khoidau.png" alt="PC lắp ráp Văn phòng, Học tập">
      </a>
    </div>

    <div class="segment-banner-block">
      <a class="segment-banner-link" href="#product-grid" title="Xem PC lắp ráp Thiết kế Đồ họa">
        <img src="assets/img/banner-chuyennghiep.png" alt="PC lắp ráp Thiết kế Đồ họa">
      </a>
    </div>

    <div class="segment-banner-block">
      <a class="segment-banner-link" href="#product-grid" title="Xem PC lắp ráp Hi-end AI">
        <img src="assets/img/banner-hiend.png" alt="PC lắp ráp Hi-end AI">
      </a>
    </div>

  </section>

  <!-- PRODUCT GRID -->
  <section class="product-section">
    <div class="product-grid" id="product-grid">
      <?php foreach ($products as $product): ?>
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

  <?php View::partial('footer'); ?>

</body>
</html>
