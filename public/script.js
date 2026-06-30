document.addEventListener('DOMContentLoaded', function () {
  // Toggle danh mục sản phẩm (placeholder - chưa có menu con)
  var categoryToggle = document.querySelector('.category-toggle');
  if (categoryToggle) {
    categoryToggle.addEventListener('click', function () {
      console.log('Mở danh mục sản phẩm (chưa cấu hình submenu)');
    });
  }

  // Nút chuyển banner trái/phải (placeholder)
  document.querySelectorAll('.banner-arrow').forEach(function (btn) {
    btn.addEventListener('click', function () {
      console.log('Chuyển banner:', btn.classList.contains('prev') ? 'trước' : 'sau');
    });
  });
});
