const productData = [
  {
    id: 1,
    name: 'PC Văn phòng / RAM / SSD',
    price: 5000000,
    oldPrice: 6500000,
    description: 'Cấu hình PC văn phòng cơ bản, phù hợp cho học tập, soạn thảo văn bản, lướt web.',
    section: 'segment-office',
    sectionTitle: 'PHÂN KHÚC KHỞI ĐẦU: HOÀN THIỆN GÓC MÁY CƠ BẢN',
    image: 'assets/img/banner-khoidau.png',
    os: 'Windows 11',
    badges: [
      { type: 'red', text: 'Văn phòng' },
      { type: 'blue', text: 'Trả góp 0%' },
      { type: 'yellow', text: 'Giảm 1.500.000đ' }
    ],
    status: 'Còn hàng',
    specs: ['Core i5', 'RAM 8GB', 'SSD 256GB'],
    rating: 4.5,
    sold: 0
  },
  {
    id: 2,
    name: 'PC Văn phòng AMD Ryzen 5 / RAM 16GB / SSD 512GB',
    price: 9500000,
    oldPrice: null,
    description: 'Cấu hình bền bỉ cho công việc văn phòng, đa nhiệm tốt với nhiều ứng dụng cùng lúc.',
    section: 'segment-office',
    sectionTitle: 'PHÂN KHÚC KHỞI ĐẦU: HOÀN THIỆN GÓC MÁY CƠ BẢN',
    image: 'assets/img/banner-khoidau.png',
    os: 'Windows 11',
    badges: [
      { type: 'red', text: 'AMD Ryzen' },
      { type: 'blue', text: 'Trả góp 0%' },
      { type: 'yellow', text: 'Giảm 800.000đ' }
    ],
    status: 'Còn hàng',
    specs: ['Ryzen 5', 'RAM 16GB', 'SSD 512GB'],
    rating: 4.5,
    sold: 0
  },
  {
    id: 3,
    name: 'PC Đồ họa Core i7 / RAM 32GB / RTX 4060 / SSD 1TB',
    price: 10300000,
    oldPrice: null,
    description: 'Cấu hình mạnh cho dựng phim, thiết kế đồ họa, render 3D, đáp ứng tốt các phần mềm chuyên dụng.',
    section: 'segment-design',
    sectionTitle: 'PHÂN KHÚC CHUYÊN NGHIỆP: NÂNG TẦM TRẢI NGHIỆM',
    image: 'assets/img/banner-chuyennghiep.png',
    os: 'Windows 11',
    badges: [
      { type: 'red', text: 'Đồ họa' },
      { type: 'blue', text: 'Trả góp 0%' },
      { type: 'yellow', text: 'Giảm 1.200.000đ' }
    ],
    status: 'Còn hàng',
    specs: ['Core i7', 'RAM 32GB', 'RTX 4060', 'SSD 1TB'],
    rating: 4.5,
    sold: 0
  },
  {
    id: 4,
    name: 'PC Gaming Entry Core i5 / RAM 16GB / SSD 512GB',
    price: 7200000,
    oldPrice: null,
    description: 'Cấu hình phù hợp cho thiết kế đồ họa nhẹ và chỉnh sửa ảnh, đồng thời vẫn dùng tốt cho giải trí.',
    section: 'segment-design',
    sectionTitle: 'PHÂN KHÚC CHUYÊN NGHIỆP: NÂNG TẦM TRẢI NGHIỆM',
    image: 'assets/img/banner-chuyennghiep.png',
    os: 'Windows 11',
    badges: [
      { type: 'red', text: 'Gaming' },
      { type: 'blue', text: 'Trả góp 0%' },
      { type: 'yellow', text: 'Giảm 500.000đ' }
    ],
    status: 'Còn hàng',
    specs: ['Core i5', 'RAM 16GB', 'SSD 512GB'],
    rating: 4.5,
    sold: 0
  },
  {
    id: 5,
    name: 'PC Hi-end Core i9 / RAM 64GB / RTX 4090 / SSD 2TB',
    price: 85000000,
    oldPrice: 92000000,
    description: 'Cấu hình đỉnh cao cho dựng phim 4K, AI training, render nặng và gaming 4K 144Hz.',
    section: 'segment-hiend',
    sectionTitle: 'PHÂN KHÚC HI-END & ĐẲNG CẤP DOANH NGHIỆP',
    image: 'assets/img/banner-hiend.png',
    os: 'Windows 11',
    badges: [
      { type: 'red', text: 'Hi-end' },
      { type: 'blue', text: 'Trả góp 0%' },
      { type: 'yellow', text: 'Giảm 7.000.000đ' }
    ],
    status: 'Còn hàng',
    specs: ['Core i9', 'RAM 64GB', 'RTX 4090', 'SSD 2TB'],
    rating: 4.9,
    sold: 0
  },
  {
    id: 6,
    name: 'PC Chuyên nghiệp Core i7 / RAM 32GB / RTX 4070',
    price: 32000000,
    oldPrice: null,
    description: 'Cấu hình cho streamer, editor video, chơi game AAA mượt ở thiết lập cao.',
    section: 'segment-hiend',
    sectionTitle: 'PHÂN KHÚC HI-END & ĐẲNG CẤP DOANH NGHIỆP',
    image: 'assets/img/banner-hiend.png',
    os: 'Windows 11',
    badges: [
      { type: 'red', text: 'Chuyên nghiệp' },
      { type: 'blue', text: 'Trả góp 0%' },
      { type: 'yellow', text: 'Giảm 2.000.000đ' }
    ],
    status: 'Còn hàng',
    specs: ['Core i7', 'RAM 32GB', 'RTX 4070'],
    rating: 4.8,
    sold: 0
  }
];

function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value).replace('₫', 'đ');
}

function loadHeader() {
  const headerContainer = document.getElementById('site-header');
  if (!headerContainer) return;

  fetch('header.html')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Không thể tải header');
      }
      return response.text();
    })
    .then((html) => {
      headerContainer.innerHTML = html;
    })
    .catch((error) => {
      console.error('Lỗi tải header:', error);
    });
}

function renderProductCard(product) {
  const os = product.os || '';
  const status = product.status || 'Còn hàng';
  const specs = product.specs || [];
  const badges = product.badges || [];
  const rating = product.rating != null ? product.rating : 4.5;
  const sold = product.sold != null ? product.sold : 0;

  return `
    <article class="product-card">
      <a class="product-card-link" href="product.html?id=${product.id}">
        <div class="product-img">
          <img src="${product.image}" alt="${product.name}" />
          <span class="cert-icon" aria-hidden="true">✅</span>
          ${os ? `<span class="os-badge">🪟 ${os}</span>` : ''}
          ${badges.length ? `
            <div class="promo-badges">
              ${badges.map((b) => `<span class="promo-badge promo-badge-${b.type}">${b.text}</span>`).join('')}
            </div>
          ` : ''}
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="stock-status"><span class="stock-dot">✓</span> ${status}</p>
          ${specs.length ? `
            <div class="spec-chips">
              ${specs.map((s) => `<span class="spec-chip">${s}</span>`).join('')}
            </div>
          ` : ''}
          <p class="product-price">
            ${formatPrice(product.price)}
            ${product.oldPrice ? `<span class="product-price-old">${formatPrice(product.oldPrice)}</span>` : ''}
          </p>
          <p class="rating-row">⭐ ${rating} • Đã bán ${sold}</p>
        </div>
      </a>
      <button class="buy-btn">Mua ngay</button>
    </article>
  `;
}

function renderHome() {
  const container = document.getElementById('product-sections');
  if (!container) return;

  const sections = [...new Set(productData.map((item) => item.section))];

  const brandTabs = ['Tất cả', 'Lenovo', 'Asus', 'HP', 'MSI', 'Surface'];

  container.innerHTML = sections.map((section) => {
    const sectionTitle = productData.find((item) => item.section === section)?.sectionTitle || 'Sản phẩm';
    const items = productData.filter((item) => item.section === section);

    return `
      <section class="segment-frame" id="${section}">
        <div class="segment-banner-frame">
          <!-- Banner sẽ thêm sau -->
        </div>
        <div class="segment-divider"></div>

        <div class="segment-body">
          <div class="segment-header">
            <h2>${sectionTitle}</h2>
            <a href="#top">Quay lên</a>
          </div>

          <div class="brand-tabs">
            ${brandTabs.map((tab, index) => `
              <button type="button" class="brand-tab${index === 0 ? ' active' : ''}">${tab}</button>
            `).join('')}
          </div>

          <div class="sort-row">
            <span class="sort-label">Sắp xếp:</span>
            <button type="button" class="sort-btn">🔥 Khuyến mãi HOT</button>
            <button type="button" class="sort-btn">↑ Giá Thấp - Cao</button>
            <button type="button" class="sort-btn">↓ Giá Cao - Thấp</button>
          </div>

          <div class="product-grid">
            ${items.map((product) => renderProductCard(product)).join('')}
          </div>

          <div class="segment-view-all">
            <a href="#" class="view-all-btn">Xem tất cả sản phẩm</a>
          </div>
        </div>
      </section>
    `;
  }).join('');
}

function renderProductDetail() {
  const container = document.getElementById('product-detail');
  const breadcrumb = document.getElementById('breadcrumb-name');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id')) || 1;
  const product = productData.find((item) => item.id === id);

  if (!product) {
    container.innerHTML = `
      <div class="product-detail-info">
        <h1>Không tìm thấy sản phẩm</h1>
        <p>Sản phẩm bạn đang tìm không tồn tại. Vui lòng quay lại trang chủ.</p>
        <a class="buy-btn" href="index.html">Quay lại trang chủ</a>
      </div>
    `;
    return;
  }

  breadcrumb.textContent = product.name;
  document.title = `${product.name} - Lapstore`;

  container.innerHTML = `
    <div class="product-detail-image">
      <img src="${product.image}" alt="${product.name}" />
    </div>
    <div class="product-detail-info">
      <h1>${product.name}</h1>
      <div class="price">${formatPrice(product.price)}${product.oldPrice ? `<span class="product-price-old">${formatPrice(product.oldPrice)}</span>` : ''}</div>
      <p>${product.description}</p>
      <button class="buy-btn">Mua ngay</button>
    </div>
  `;
}

window.addEventListener('DOMContentLoaded', () => {
  loadHeader();

  if (document.getElementById('product-sections')) {
    renderHome();
  }

  if (document.getElementById('product-detail')) {
    renderProductDetail();
  }
});