let productData = [];

const brandLogos = [
  { name: 'Lenovo', file: 'lenovo.png' },
  { name: 'Asus', file: 'asus.png' },
  { name: 'HP', file: 'hp.png' },
  { name: 'MSI', file: 'msi.png' },
  { name: 'Dell', file: 'dell.png' },
  { name: 'Acer', file: 'acer.png' },
  { name: 'MacBook', file: 'macbook.png' },
  { name: 'Surface', file: 'surface.png' },
  { name: 'LG', file: 'lg.png' },
  { name: 'Samsung', file: 'samsung.png' }
];

/* Định nghĩa phân khúc dựa theo khoảng giá (không cần gắn tay field "section" nữa) */
const priceSegments = [
  {
    key: 'segment-office',
    title: 'PHÂN KHÚC KHỞI ĐẦU: HOÀN THIỆN GÓC MÁY CƠ BẢN',
    minPrice: 0,
    maxPrice: 30000000,
    banner: 'assets/img/banner-a.png'
  },
  {
    key: 'segment-design',
    title: 'PHÂN KHÚC CHUYÊN NGHIỆP: NÂNG TẦM TRẢI NGHIỆM',
    minPrice: 30000001,
    maxPrice: 60000000,
    banner: 'assets/img/banner-b.png'
  },
  {
    key: 'segment-hiend',
    title: 'PHÂN KHÚC HI-END & ĐẲNG CẤP DOANH NGHIỆP',
    minPrice: 60000001,
    maxPrice: Infinity,
    banner: 'assets/img/banner-c.png'
  }
];

function getSegmentByPrice(price) {
  return priceSegments.find((seg) => price >= seg.minPrice && price < seg.maxPrice) || priceSegments[priceSegments.length - 1];
}

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

/* Lấy dữ liệu sản phẩm từ "database ảo" (file JSON) */
/* Chuyển badges dạng mảng chuỗi thành mảng {type, text} để tái dùng giao diện cũ */
function normalizeBadges(rawBadges) {
  const colorCycle = ['red', 'blue', 'yellow'];
  return (rawBadges || []).map((text, index) => ({
    type: colorCycle[index % colorCycle.length],
    text
  }));
}

/* Gom các thông số cpu/gpu/ram/storage/display/os/accessories thành mảng spec-chip, bỏ giá trị rỗng */
function buildSpecs(raw) {
  return [raw.cpu, raw.gpu, raw.ram, raw.storage, raw.display, raw.accessories].filter((value) => value && value.trim() !== '');
}

/* Chuẩn hoá 1 sản phẩm từ dữ liệu thật về đúng field mà giao diện đang dùng */
function normalizeProduct(raw, index) {
  return {
    id: index,
    name: raw.name,
    brand: raw.brand,
    category: raw.category,
    cpu: raw.cpu || '',
    gpu: raw.gpu || '',
    ram: raw.ram || '',
    storage: raw.storage || '',
    display: raw.display || '',
    accessories: raw.accessories || '',
    price: raw.price,
    oldPrice: raw.original_price && raw.original_price !== raw.price ? raw.original_price : null,
    description: [raw.category, raw.cpu, raw.ram, raw.storage].filter(Boolean).join(' • '),
    image: raw.image,
    os: raw.os || '',
    aiBadge: false,
    warrantyBadge: null,
    badges: normalizeBadges(raw.badges),
    status: raw.status || 'Còn hàng',
    specs: buildSpecs(raw),
    giftCount: 0,
    promoCount: 0,
    configCount: 0,
    rating: raw.rating != null ? raw.rating : 4.5,
    sold: raw.sold != null ? raw.sold : 0,
    url: raw.url || ''
  };
}

function loadProductData() {
  return fetch('assets/data/products.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Không thể tải dữ liệu sản phẩm');
      }
      return response.json();
    })
    .then((data) => {
      productData = data.map((raw, index) => normalizeProduct(raw, index));
    })
    .catch((error) => {
      console.error('Lỗi tải dữ liệu sản phẩm:', error);
      productData = [];
    });
}

function renderBrandTabs() {
  return `
    <div class="brand-logo-tabs">
      ${brandLogos.map((brand) => `
        <button type="button" class="brand-logo-tab">
          <img src="assets/img/logo/${brand.file}" alt="${brand.name}" />
        </button>
      `).join('')}
    </div>
  `;
}

function renderProductCard(product) {
  const os = product.os || '';
  const status = product.status || 'Còn hàng';
  const specs = product.specs || [];
  const badges = product.badges || [];
  const rating = product.rating != null ? product.rating : 4.5;
  const sold = product.sold != null ? product.sold : 0;
  const giftCount = product.giftCount || 0;
  const promoCount = product.promoCount || 0;
  const configCount = product.configCount || 0;
  const warrantyBadge = product.warrantyBadge || null;
  const aiBadge = Boolean(product.aiBadge);

  return `
    <article class="product-card">
      <a class="product-card-link" href="${product.url || '#'}" target="_blank" rel="noopener">
        <div class="product-img">
          <img src="${product.image}" alt="${product.name}" />
          ${aiBadge ? `<span class="ai-badge" title="Tích hợp AI">AI</span>` : `<span class="cert-icon" aria-hidden="true">✅</span>`}
          ${warrantyBadge ? `<span class="warranty-badge">🏆 ${warrantyBadge}<br />WARRANTY</span>` : (os ? `<span class="os-badge">🪟 ${os}</span>` : '')}
          ${badges.length ? `
            <div class="promo-badges">
              ${badges.map((b) => `<span class="promo-badge promo-badge-${b.type}">${b.text}</span>`).join('')}
            </div>
          ` : ''}
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>

          ${specs.length ? `
            <div class="spec-chips">
              ${specs.map((s) => `<span class="spec-chip">${s}</span>`).join('')}
            </div>
          ` : ''}

          <div class="benefit-chips">
            ${giftCount ? `<span class="benefit-chip">🎁 ${giftCount} QUÀ TẶNG</span>` : ''}
            ${promoCount ? `<span class="benefit-chip">🏷️ ${promoCount} KHUYẾN MÃI</span>` : ''}
          </div>
          ${configCount ? `
            <div class="benefit-chips">
              <span class="benefit-chip">⚙️ ${configCount} CẤU HÌNH</span>
            </div>
          ` : ''}

          <p class="product-price">
            ${formatPrice(product.price)}
            ${product.oldPrice ? `<span class="product-price-old">${formatPrice(product.oldPrice)}</span>` : ''}
          </p>
          <p class="rating-row">⭐ ${rating} • Đã bán ${sold}</p>
          <p class="stock-status"><span class="stock-dot">✓</span> ${status}</p>
        </div>
      </a>
      <button class="buy-btn">Mua ngay</button>
    </article>
  `;
}

function renderHome() {
  const container = document.getElementById('product-sections');
  if (!container) return;

  container.innerHTML = priceSegments.map((segment) => {
    const items = productData.filter((item) => getSegmentByPrice(item.price).key === segment.key);

    if (!items.length) return '';

    return `
      <section class="segment-frame" id="${segment.key}">
        <div class="segment-banner-frame">
          ${segment.banner ? `<img src="${segment.banner}" alt="${segment.title}" />` : ''}
        </div>
        <div class="segment-divider"></div>

        <div class="segment-body">
          <div class="segment-header">
            <h2>${segment.title}</h2>
            <a href="#top">Quay lên</a>
          </div>

          ${renderBrandTabs()}

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

  const os = product.os || '';
  const status = product.status || 'Còn hàng';
  const specs = product.specs || [];
  const badges = product.badges || [];
  const rating = product.rating != null ? product.rating : 4.5;
  const sold = product.sold != null ? product.sold : 0;
  const giftCount = product.giftCount || 0;
  const promoCount = product.promoCount || 0;
  const configCount = product.configCount || 0;
  const warrantyBadge = product.warrantyBadge || null;
  const aiBadge = Boolean(product.aiBadge);

  const specRows = [
    { label: 'Danh mục', value: product.category },
    { label: 'Hãng', value: product.brand },
    { label: 'CPU', value: product.cpu },
    { label: 'GPU', value: product.gpu },
    { label: 'RAM', value: product.ram },
    { label: 'Ổ cứng', value: product.storage },
    { label: 'Màn hình', value: product.display },
    { label: 'Hệ điều hành', value: product.os },
    { label: 'Phụ kiện', value: product.accessories }
  ].filter((row) => row.value && row.value.trim() !== '');

  container.innerHTML = `
    <div class="product-detail-image">
      <img src="${product.image}" alt="${product.name}" />
      ${aiBadge ? `<span class="ai-badge" title="Tích hợp AI">AI</span>` : `<span class="cert-icon" aria-hidden="true">✅</span>`}
      ${warrantyBadge ? `<span class="warranty-badge">🏆 ${warrantyBadge}<br />WARRANTY</span>` : (os ? `<span class="os-badge">🪟 ${os}</span>` : '')}
      ${badges.length ? `
        <div class="promo-badges">
          ${badges.map((b) => `<span class="promo-badge promo-badge-${b.type}">${b.text}</span>`).join('')}
        </div>
      ` : ''}
    </div>
    <div class="product-detail-info">
      <h1>${product.name}</h1>

      ${specs.length ? `
        <div class="spec-chips">
          ${specs.map((s) => `<span class="spec-chip">${s}</span>`).join('')}
        </div>
      ` : ''}

      <div class="benefit-chips">
        ${giftCount ? `<span class="benefit-chip">🎁 ${giftCount} QUÀ TẶNG</span>` : ''}
        ${promoCount ? `<span class="benefit-chip">🏷️ ${promoCount} KHUYẾN MÃI</span>` : ''}
      </div>
      ${configCount ? `
        <div class="benefit-chips">
          <span class="benefit-chip">⚙️ ${configCount} CẤU HÌNH</span>
        </div>
      ` : ''}

      <div class="price">${formatPrice(product.price)}${product.oldPrice ? `<span class="product-price-old">${formatPrice(product.oldPrice)}</span>` : ''}</div>
      <p class="rating-row">⭐ ${rating} • Đã bán ${sold}</p>
      <p class="stock-status"><span class="stock-dot">✓</span> ${status}</p>

      ${specRows.length ? `
        <table class="spec-table">
          ${specRows.map((row) => `
            <tr>
              <th>${row.label}</th>
              <td>${row.value}</td>
            </tr>
          `).join('')}
        </table>
      ` : ''}

      <p>${product.description}</p>

      <div class="detail-actions">
        <button class="buy-btn">Mua ngay</button>
        ${product.url ? `<a class="source-link" href="${product.url}" target="_blank" rel="noopener">Xem trang gốc ↗</a>` : ''}
      </div>
    </div>
  `;
}

window.addEventListener('DOMContentLoaded', () => {
  loadHeader();

  loadProductData().then(() => {
    if (document.getElementById('product-sections')) {
      renderHome();
    }

    if (document.getElementById('product-detail')) {
      renderProductDetail();
    }
  });
});