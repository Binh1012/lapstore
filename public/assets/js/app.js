let productData = [];

// Quản lý độc lập trạng thái bộ lọc của từng phân khúc giá
const segmentFilters = {
  'segment-office': { ram: [], storage: [], cpu: [], gpu: [], needs: [] },
  'segment-design': { ram: [], storage: [], cpu: [], gpu: [], needs: [] },
  'segment-hiend': { ram: [], storage: [], cpu: [], gpu: [], needs: [] }
};

const segmentSorts = {
  'segment-office': 'hot',
  'segment-design': 'hot',
  'segment-hiend': 'hot'
};

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
    options: [{ label: '4GB' }, { label: '8GB' }, { label: '16GB' }, { label: '32GB' }, { label: '64GB' }]
  },
  {
    key: 'storage',
    label: 'Ổ Cứng',
    icon: '⚡',
    options: [{ label: 'SSD 120GB' }, { label: 'SSD 240GB' }, { label: 'SSD 256GB' }, { label: 'SSD 512GB' }, { label: 'SSD 1TB' }]
  },
  {
    key: 'cpu',
    label: 'CPU',
    icon: '💻',
    options: [{ label: 'Intel Core i3' }, { label: 'Intel Core i5' }, { label: 'Intel Core i7' }, { label: 'Intel Core i9' }, { label: 'AMD Ryzen 5' }, { label: 'AMD Ryzen 7' }]
  },
  {
    key: 'gpu',
    label: 'GPU',
    icon: '🎛️',
    options: [{ label: 'NVIDIA GeForce GTX' }, { label: 'NVIDIA GeForce RTX' }, { label: 'AMD Radeon' }, { label: 'Tích hợp (iGPU)' }]
  }
];

const priceSegments = [
  { key: 'segment-office', title: 'PHÂN KHÚC KHỞI ĐẦU: HOÀN THIỆN GÓC MÁY CƠ BẢN', minPrice: 0, maxPrice: 30000000, banner: 'assets/img/banner-a.png' },
  { key: 'segment-design', title: 'PHÂN KHÚC CHUYÊN NGHIỆP: NÂNG TẦM TRẢI NGHIỆM', minPrice: 30000001, maxPrice: 60000000, banner: 'assets/img/banner-b.png' },
  { key: 'segment-hiend', title: 'PHÂN KHÚC HI-END & ĐẲNG CẤP DOANH NGHIỆP', minPrice: 60000001, maxPrice: Infinity, banner: 'assets/img/banner-c.png' }
];

function getSegmentByPrice(price) {
  return priceSegments.find((seg) => price >= seg.minPrice && price < seg.maxPrice) || priceSegments[priceSegments.length - 1];
}

/* ===== RENDER FILTER BAR THÔNG MINH ===== */
function renderCriteriaPanel(segmentKey, criteria) {
  const panelId = `panel-${segmentKey}-${criteria.key}`;
  return `
    <div class="criteria-panel" id="${panelId}">
      <div class="criteria-options">
        ${criteria.options.map((opt) => `
          <button type="button" class="criteria-option" data-criteria="${criteria.key}" data-value="${opt.label}">
            ${opt.label}
          </button>
        `).join('')}
      </div>
      <button type="button" class="apply-filter-btn" onclick="applyCriteriaFilter('${segmentKey}')">Xem kết quả</button>
    </div>
  `;
}

function renderFilterBar(segmentKey) {
  return `
    <div class="filter-bar">
      <div class="filter-criteria-row">
        <div class="filter-section-label">Chọn tiêu chí:</div>
        <div class="criteria-row">
          ${filterCriteria.map((c) => `
            <div class="criteria-dropdown">
              <button type="button" class="criteria-toggle" onclick="toggleCriteriaPanel('panel-${segmentKey}-${c.key}', event)">
                <span>${c.icon}</span> ${c.label} <span class="chevron">▾</span>
              </button>
              ${renderCriteriaPanel(segmentKey, c)}
            </div>
          `).join('')}
        </div>
      </div>
      <div class="needs-row">
        <span class="needs-label">Nhu cầu sử dụng:</span>
        ${needsTags.map((tag) => `
          <button type="button" class="needs-tag" data-need="${tag.label}" onclick="toggleNeedsTag('${segmentKey}', '${tag.label}', this)">
            ${tag.icon} ${tag.label}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function toggleCriteriaPanel(panelId, event) {
  event.stopPropagation();
  const panel = document.getElementById(panelId);
  if (!panel) return;
  const isOpen = panel.classList.contains('open');
  document.querySelectorAll('.criteria-panel.open').forEach((p) => p.classList.remove('open'));
  if (!isOpen) panel.classList.add('open');
}

function toggleNeedsTag(segmentKey, needLabel, element) {
  element.classList.toggle('active');
  const activeFilters = segmentFilters[segmentKey].needs;
  const index = activeFilters.indexOf(needLabel);
  if (index > -1) activeFilters.splice(index, 1);
  else activeFilters.push(needLabel);
  updateSegmentProducts(segmentKey);
}

function applyCriteriaFilter(segmentKey) {
  document.querySelectorAll('.criteria-panel.open').forEach((p) => p.classList.remove('open'));
  const segmentFrame = document.getElementById(segmentKey);
  if (!segmentFrame) return;

  segmentFilters[segmentKey].ram = [];
  segmentFilters[segmentKey].storage = [];
  segmentFilters[segmentKey].cpu = [];
  segmentFilters[segmentKey].gpu = [];

  segmentFrame.querySelectorAll('.criteria-option.active').forEach(btn => {
    const type = btn.getAttribute('data-criteria');
    const val = btn.getAttribute('data-value');
    segmentFilters[segmentKey][type].push(val);
  });

  updateSegmentProducts(segmentKey);
}

/* ===== LOGIC LỌC VÀ SẮP XẾP SẢN PHẨM PHÂN KHÚC ===== */
function updateSegmentProducts(segmentKey) {
  const grid = document.querySelector(`#${segmentKey} .product-grid`);
  if (!grid) return;

  let filtered = productData.filter((item) => getSegmentByPrice(item.price).key === segmentKey);
  const filters = segmentFilters[segmentKey];
  
  if (filters.ram.length > 0) filtered = filtered.filter(p => filters.ram.some(r => p.specs.some(s => s.toUpperCase().includes(r.toUpperCase()))));
  if (filters.storage.length > 0) filtered = filtered.filter(p => filters.storage.some(st => p.specs.some(s => s.toUpperCase().includes(st.toUpperCase()))));
  if (filters.cpu.length > 0) filtered = filtered.filter(p => filters.cpu.some(c => p.specs.some(s => s.toUpperCase().includes(c.toUpperCase()))));
  if (filters.gpu.length > 0) filtered = filtered.filter(p => filters.gpu.some(g => p.specs.some(s => s.toUpperCase().includes(g.toUpperCase()))));

  if (filters.needs.length > 0) {
    filtered = filtered.filter(p => filters.needs.some(need => `${p.name} ${p.category || ''}`.toUpperCase().includes(need.toUpperCase())));
  }

  const sortType = segmentSorts[segmentKey];
  if (sortType === 'asc') filtered.sort((a, b) => a.price - b.price);
  else if (sortType === 'desc') filtered.sort((a, b) => b.price - a.price);
  else filtered.sort((a, b) => (b.oldPrice ? b.oldPrice - b.price : 0) - (a.oldPrice ? a.oldPrice - a.price : 0));

  grid.innerHTML = filtered.length === 0 
    ? `<p style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 30px; font-size:13px;">Không có sản phẩm nào phù hợp với bộ lọc.</p>` 
    : filtered.map((product) => renderProductCard(product)).join('');
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.criteria-dropdown')) document.querySelectorAll('.criteria-panel.open').forEach((p) => p.classList.remove('open'));
  const optionBtn = e.target.closest('.criteria-option');
  if (optionBtn) optionBtn.classList.toggle('active');
});

function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ');
}

function loadHeader() {
  const headerContainer = document.getElementById('site-header');
  if (!headerContainer) return;

  fetch('header.html')
    .then(res => res.ok ? res.text() : '')
    .then(html => { headerContainer.innerHTML = html; })
    .catch(err => console.error('Lỗi tải header:', err));
}

function normalizeProduct(raw, index) {
  const colorCycle = ['red', 'blue'];
  return {
    id: index,
    name: raw.name,
    brand: raw.brand,
    category: raw.category,
    price: raw.price,
    oldPrice: raw.original_price && raw.original_price !== raw.price ? raw.original_price : null,
    image: raw.image,
    badges: (raw.badges || []).map((text, i) => ({ type: colorCycle[i % colorCycle.length], text })),
    status: raw.status || 'Còn hàng',
    // Gom tất cả thông số kỹ thuật thành mảng hoàn chỉnh
    specs: [raw.cpu, raw.gpu, raw.ram, raw.storage].filter(v => v && v.trim() !== ''),
    rating: raw.rating != null ? raw.rating : 4.5,
    sold: raw.sold != null ? raw.sold : 0,
    url: raw.url || '#'
  };
}

function loadProductData() {
  return fetch('assets/data/products.json')
    .then(res => res.ok ? res.json() : [])
    .then(data => { productData = data.map((raw, index) => normalizeProduct(raw, index)); })
    .catch(() => { productData = []; });
}

/* ===== CAROUSEL FLASH SALE RESPONSIVE ĐA THIẾT BỊ ===== */
let flashSaleCarouselIndex = 0;
let flashSaleCarouselTimer = null;

function initFlashSaleCarousel() {
  const grid = document.getElementById('flashsale-grid');
  const track = grid?.querySelector('.flashsale-track');
  const prevBtn = grid?.querySelector('.flashsale-control-prev');
  const nextBtn = grid?.querySelector('.flashsale-control-next');
  if (!track) return;

  const totalItems = track.children.length;
  
  // Tự động nhận dạng số thẻ được hiển thị trên các màn hình khác nhau
  const getVisibleItemsCount = () => {
    if (window.innerWidth <= 580) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 4;
  };

  const updateCarousel = () => {
    const visibleCount = getVisibleItemsCount();
    const maxSteps = totalItems - (visibleCount - 1);
    if (flashSaleCarouselIndex >= maxSteps) flashSaleCarouselIndex = 0;
    
    const itemWidth = track.children[0].getBoundingClientRect().width + 12; 
    track.style.transform = `translateX(-${flashSaleCarouselIndex * itemWidth}px)`;
  };

  const goToNext = () => {
    const visibleCount = getVisibleItemsCount();
    flashSaleCarouselIndex = (flashSaleCarouselIndex >= totalItems - visibleCount) ? 0 : flashSaleCarouselIndex + 1;
    updateCarousel();
  };

  const goToPrev = () => {
    const visibleCount = getVisibleItemsCount();
    flashSaleCarouselIndex = (flashSaleCarouselIndex <= 0) ? totalItems - visibleCount : flashSaleCarouselIndex - 1;
    updateCarousel();
  };

  nextBtn?.addEventListener('click', () => { goToNext(); restartTimer(); });
  prevBtn?.addEventListener('click', () => { goToPrev(); restartTimer(); });

  function restartTimer() {
    clearInterval(flashSaleCarouselTimer);
    flashSaleCarouselTimer = setInterval(goToNext, 4000);
  }

  restartTimer();
  window.addEventListener('resize', updateCarousel);
}

function renderFlashSaleSection() {
  const grid = document.getElementById('flashsale-grid');
  if (!grid) return;

  const items = productData.filter((p) => p.oldPrice).slice(0, 8);
  if (!items.length) return;

  grid.innerHTML = `
    <div class="flashsale-grid-wrapper-relative">
      <button type="button" class="flashsale-control flashsale-control-prev" aria-label="Trước">‹</button>
      <button type="button" class="flashsale-control flashsale-control-next" aria-label="Sau">›</button>
      <div class="flashsale-grid-window">
        <div class="flashsale-track">
          ${items.map((p) => `
            <div class="flashsale-slide-item">
              ${renderProductCard(p, { hideSpecs: true })}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  initFlashSaleCarousel();
}

function renderProductCard(product, options = {}) {
  const hideSpecs = Boolean(options.hideSpecs);
  const hasDiscount = Boolean(product.oldPrice && product.oldPrice > product.price);
  const discountPercent = hasDiscount ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  const finalBadges = product.badges.length ? product.badges : (hasDiscount ? [{type:'red', text:'Trả góp 0%'}, {type:'blue', text:'Giảm sâu'}] : []);

  return `
    <article class="product-card">
      <a class="product-card-link" href="${product.url}" target="_blank" rel="noopener">
        <div class="product-img">
          <span class="sale-ribbon">SALE</span>
          <img src="${product.image}" alt="${product.name}" />
          ${hasDiscount ? `<span class="discount-badge">-${discountPercent}%</span>` : ''}
          <div class="promo-badges">
            ${finalBadges.map(b => `<span class="promo-badge promo-badge-${b.type}">${b.text}</span>`).join('')}
          </div>
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          ${hideSpecs
            ? `<div class="flash-ticket-wrap"><img src="assets/img/fl.png" alt="Flash Sale" class="flash-ticket-img" /></div>`
            : `<div class="spec-chips">${product.specs.map(s => `<span class="spec-chip">${s}</span>`).join('')}</div>`
          }
          <div class="product-bottom">
            <div class="price-row">
              <span class="product-price">${formatPrice(product.price)}</span>
              ${product.oldPrice ? `<span class="product-price-old">${formatPrice(product.oldPrice)}</span>` : ''}
            </div>
            <div class="rating-row">
              <span>⭐ ${product.rating} • Đã bán ${product.sold}</span>
              <span class="stock-status">✓ ${product.status}</span>
            </div>
          </div>
        </div>
      </a>
      <button class="buy-btn" onclick="window.open('${product.url}', '_blank')">Mua ngay ⚡</button>
    </article>
  `;
}

function handleSortClick(segmentKey, type, element) {
  element.closest('.sort-row').querySelectorAll('.sort-btn').forEach(btn => btn.style.borderColor = '#cbd5e1');
  element.style.borderColor = 'var(--primary)';
  segmentSorts[segmentKey] = type;
  updateSegmentProducts(segmentKey);
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
          <img src="${segment.banner}" alt="${segment.title}" />
        </div>
        <div class="segment-divider"></div>
        <div class="segment-body">
          ${renderFilterBar(segment.key)}
          <div class="sort-row">
            <span class="sort-label">Sắp xếp theo:</span>
            <button type="button" class="sort-btn" style="border-color: var(--primary);" onclick="handleSortClick('${segment.key}', 'hot', this)">🔥 Khuyến mãi HOT</button>
            <button type="button" class="sort-btn" onclick="handleSortClick('${segment.key}', 'asc', this)">↑ Giá Thấp - Cao</button>
            <button type="button" class="sort-btn" onclick="handleSortClick('${segment.key}', 'desc', this)">↓ Giá Cao - Thấp</button>
          </div>
          <div class="product-grid">
            ${items.map((product) => renderProductCard(product)).join('')}
          </div>
        </div>
      </section>
    `;
  }).join('');
}

const COUNTDOWN_END = new Date(2026, 8, 30, 23, 59, 0);
function pad2(num) { return String(num).padStart(2, '0'); }

function initCountdown() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');
  const endLabelEl = document.getElementById('cd-end-label');
  if (!daysEl) return;

  if (endLabelEl) {
    endLabelEl.textContent = `${pad2(COUNTDOWN_END.getHours())}:${pad2(COUNTDOWN_END.getMinutes())} ngày ${pad2(COUNTDOWN_END.getDate())}/${pad2(COUNTDOWN_END.getMonth() + 1)}/${COUNTDOWN_END.getFullYear()}`;
  }

  setInterval(() => {
    const diff = COUNTDOWN_END.getTime() - Date.now();
    if (diff <= 0) return;
    const totalSeconds = Math.floor(diff / 1000);
    daysEl.textContent = pad2(Math.floor(totalSeconds / 86400));
    hoursEl.textContent = pad2(Math.floor((totalSeconds % 86400) / 3600));
    minutesEl.textContent = pad2(Math.floor((totalSeconds % 3600) / 60));
    secondsEl.textContent = pad2(totalSeconds % 60);
  }, 1000);
}

window.addEventListener('DOMContentLoaded', () => {
  loadHeader();
  initCountdown();
  loadProductData().then(() => {
    if (document.getElementById('product-sections')) renderHome();
    renderFlashSaleSection();
  });
});