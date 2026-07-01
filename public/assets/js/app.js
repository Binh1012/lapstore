let productData = [];

const brandLogos = [
  { name: 'Lenovo', file: 'lenovo.png' },
  { name: 'Asus', file: 'asus.png' },
  { name: 'HP', file: 'hp.png' },
  { name: 'MSI', file: 'msi.png' },
  { name: 'Dell', file: 'dell.png' }
];

/* ===== DỮ LIỆU CHO FILTER BAR (chỉ demo UI, số liệu minh hoạ) ===== */
const priceRanges = [
  { label: 'Dưới 10 triệu' },
  { label: 'Từ 10 - 15 triệu' },
  { label: 'Từ 15 - 20 triệu' },
  { label: 'Từ 20 - 25 triệu' },
  { label: 'Từ 25 - 30 triệu' },
  { label: 'Trên 30 triệu' }
];

const needsTags = [
  { icon: '🎮', label: 'Chơi Game' },
  { icon: '💼', label: 'Văn Phòng - Học Tập' },
  { icon: '🎨', label: 'Thiết Kế - Đồ Họa' },
  { icon: '💻', label: 'Lập Trình' },
  { icon: '🖥️', label: 'Workstation' },
  { icon: '🗄️', label: 'Máy chủ server' }
];

const filterCriteria = [
  {
    key: 'ram',
    label: 'RAM',
    icon: '🧠',
    options: [
      { label: '4GB', count: 34 }, { label: '8GB', count: 300 },
      { label: '16GB', count: 189 }, { label: '32GB', count: 59 },
      { label: '64GB', count: 35 }, { label: '96GB', count: 1 },
      { label: '128GB', count: 22 }, { label: '256GB', count: 157 }
    ]
  },
  {
    key: 'storage',
    label: 'Ổ Cứng',
    icon: '⚡',
    options: [
      { label: 'SSD 120GB', count: 6 }, { label: 'SSD 128GB', count: 13 },
      { label: 'SSD 240GB', count: 13 }, { label: 'SSD 256GB', count: 148 },
      { label: 'SSD 480GB', count: 2 }, { label: 'SSD 512GB', count: 323 },
      { label: 'SSD 1TB', count: 85 }, { label: 'SSD 2TB', count: 3 },
      { label: 'SSD 4TB', count: 9 }, { label: 'HDD 1TB', count: 38 }
    ]
  },
  {
    key: 'cpu',
    label: 'CPU',
    icon: '💻',
    options: [
      { label: 'Intel® Core Ultra' }, { label: 'AMD Ryzen™ AI' },
      { label: 'Intel® Core™' }, { label: 'Intel Xeon', count: 17 },
      { label: 'Intel Celeron' }, { label: 'Intel Pentium' },
      { label: 'Intel Core i3' }, { label: 'Intel Core i5' },
      { label: 'Intel Core i7'}, { label: 'Intel Core i9' },
      { label: 'AMD Ryzen 3' }, { label: 'AMD Ryzen 5' },
      { label: 'AMD Ryzen 7' }, { label: 'AMD Ryzen 9' }
    ]
  },
  {
    key: 'gpu',
    label: 'GPU',
    icon: '🎛️',
    options: [
      { label: 'NVIDIA T Series' }, { label: 'NVIDIA GeForce GTX Series' },
      { label: 'NVIDIA GeForce RTX Series' }, { label: 'AMD Radeon RX Series' },
      { label: 'AMD Radeon Pro Series' }, { label: 'Card đồ họa tích hợp (Onboard/iGPU)' },
      { label: 'Intel Arc A-Series'}, { label: 'Nvidia RTX A-Series' },
      { label: 'NVIDIA GT Series' }, { label: 'NVIDIA RTX Pro' }
    ]
  }
];

/* ===== RENDER FILTER BAR ===== */
function renderPriceRanges(segmentKey) {
  return `
    <div class="price-range-row">
      ${priceRanges.map((r) => `
        <button type="button" class="price-range-btn">
          ${r.label} 
        </button>
      `).join('')}
    </div>
  `;
}

function renderCriteriaPanel(segmentKey, criteria) {
  const panelId = `panel-${segmentKey}-${criteria.key}`;
  return `
    <div class="criteria-panel" id="${panelId}">
      <div class="criteria-options">
        ${criteria.options.map((opt) => `
          <button type="button" class="criteria-option" ${opt.count === 0 ? 'disabled' : ''}>
            ${opt.label} 
          </button>
        `).join('')}
      </div>
      <button type="button" class="apply-filter-btn">Xem kết quả</button>
    </div>
  `;
}

function renderCriteriaRow(segmentKey) {
  return `
    <div class="criteria-row">
      ${filterCriteria.map((c) => `
        <div class="criteria-dropdown">
          <button type="button" class="criteria-toggle" onclick="toggleCriteriaPanel('panel-${segmentKey}-${c.key}')">
            <span class="criteria-icon">${c.icon}</span> ${c.label} <span class="chevron">▾</span>
          </button>
          ${renderCriteriaPanel(segmentKey, c)}
        </div>
      `).join('')}
    </div>
  `;
}

function renderNeedsTags() {
  return `
    <div class="needs-row">
      <span class="needs-label">Nhu cầu:</span>
      ${needsTags.map((tag) => `
        <button type="button" class="needs-tag" ${tag.count === 0 ? 'disabled' : ''}>
          ${tag.icon} ${tag.label} <span class="option-count">(${tag.count})</span>
        </button>
      `).join('')}
    </div>
  `;
}

function renderFilterBar(segmentKey) {
  return `
    <div class="filter-bar">
      <div class="filter-section-label">Chọn theo tiêu chí:</div>
      ${renderCriteriaRow(segmentKey)}
      ${renderBrandTabs()}
      ${renderNeedsTags()}
    </div>
  `;
}

/* Mở / đóng panel tiêu chí, chỉ 1 panel mở tại 1 thời điểm */
function toggleCriteriaPanel(panelId) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  const isOpen = panel.classList.contains('open');
  document.querySelectorAll('.criteria-panel.open').forEach((p) => p.classList.remove('open'));
  if (!isOpen) panel.classList.add('open');
}

/* Toggle active state (chỉ UI, chưa lọc thật) + đóng panel khi click ra ngoài */
document.addEventListener('click', (e) => {
  if (!e.target.closest('.criteria-dropdown')) {
    document.querySelectorAll('.criteria-panel.open').forEach((p) => p.classList.remove('open'));
  }

  const priceBtn = e.target.closest('.price-range-btn');
  if (priceBtn) {
    priceBtn.parentElement.querySelectorAll('.price-range-btn').forEach((b) => b.classList.remove('active'));
    priceBtn.classList.add('active');
  }

  const brandBtn = e.target.closest('.brand-logo-tab');
  if (brandBtn) brandBtn.classList.toggle('active');

  const needsBtn = e.target.closest('.needs-tag');
  if (needsBtn && !needsBtn.disabled) needsBtn.classList.toggle('active');

  const optionBtn = e.target.closest('.criteria-option');
  if (optionBtn && !optionBtn.disabled) optionBtn.classList.toggle('active');
});

/* Định nghĩa phân khúc dựa theo khoảng giá */
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
      if (!response.ok) throw new Error('Không thể tải header');
      return response.text();
    })
    .then((html) => {
      headerContainer.innerHTML = html;
    })
    .catch((error) => {
      console.error('Lỗi tải header:', error);
    });
}

/* Chuyển badges dạng mảng chuỗi thành mảng {type, text} */
function normalizeBadges(rawBadges) {
  const colorCycle = ['red', 'blue', 'yellow'];
  return (rawBadges || []).map((text, index) => ({
    type: colorCycle[index % colorCycle.length],
    text
  }));
}

/* Gom các thông số thành mảng spec-chip, bỏ giá trị rỗng */
function buildSpecs(raw) {
  return [raw.cpu, raw.gpu, raw.ram, raw.storage, raw.display, raw.accessories]
    .filter((value) => value && value.trim() !== '');
}

/* Chuẩn hoá 1 sản phẩm từ dữ liệu thật */
function normalizeProduct(raw, index) {
  return {
    id: index,
    name: raw.name,
    brand: raw.brand,
    category: raw.category,
    price: raw.price,
    oldPrice: raw.original_price && raw.original_price !== raw.price ? raw.original_price : null,
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
      if (!response.ok) throw new Error('Không thể tải dữ liệu sản phẩm');
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
  const specs = product.specs || [];
  const badges = product.badges || [];
  const rating = product.rating != null ? product.rating : 4.5;
  const sold = product.sold != null ? product.sold : 0;
  const giftCount = product.giftCount || 0;
  const promoCount = product.promoCount || 0;
  const configCount = product.configCount || 0;
  const warrantyBadge = product.warrantyBadge || null;
  const aiBadge = Boolean(product.aiBadge);
  const status = product.status || 'Còn hàng';

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
      <button class="buy-btn" onclick="window.open('${product.url || '#'}', '_blank')">Mua ngay</button>
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
  
            <a href="#top">Quay lên</a>
          </div>

          ${renderFilterBar(segment.key)}

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

window.addEventListener('DOMContentLoaded', () => {
  loadHeader();

  loadProductData().then(() => {
    if (document.getElementById('product-sections')) {
      renderHome();
    }
  });
});