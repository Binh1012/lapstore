import json
import re
import sys
from pathlib import Path
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding="utf-8")

HTML_FILE   = "a.html"
OUTPUT_FILE = "products.json"
LIMIT       = 80   # None = lấy tất cả, đặt số nguyên để giới hạn

# ──────────────────────────────────────────────
# HELPERS
# ──────────────────────────────────────────────

def clean_price(text: str) -> int:
    if not text:
        return 0
    return int(re.sub(r"[^\d]", "", text) or 0)


def extract_sold(text: str) -> int:
    m = re.search(r"Đã bán\s*(\d+)", text or "", re.IGNORECASE)
    return int(m.group(1)) if m else 0


def extract_rating(text: str) -> float:
    m = re.search(r"(\d+(\.\d+)?)\s*\*", text or "")
    return float(m.group(1)) if m else 0.0


def extract_image(card) -> str:
    """Lấy URL ảnh từ data-bg, style background-image, hoặc <img>."""
    img_inner = card.select_one(".product-image-inner")
    if img_inner:
        # Thử data-bg trước
        src = img_inner.get("data-bg", "").strip()
        if src:
            return src if src.startswith("http") else f"https://laptopre.vn{src}"

        # Thử style="background-image: url(...)"
        style = img_inner.get("style", "")
        m = re.search(r"url\(['\"]?([^'\")\s]+)['\"]?\)", style)
        if m:
            src = m.group(1)
            return src if src.startswith("http") else f"https://laptopre.vn{src}"

    # Fallback: thẻ <img> bất kỳ bên trong card
    img_tag = card.select_one("img")
    if img_tag:
        src = img_tag.get("src") or img_tag.get("data-src") or ""
        if src:
            return src if src.startswith("http") else f"https://laptopre.vn{src}"

    return ""


def detect_brand(name: str) -> str:
    BRANDS = [
        "Asus", "Lenovo", "HP", "Dell", "MSI", "Acer",
        "Samsung", "LG", "Apple", "MacBook", "Surface",
        "Gigabyte", "Intel", "AMD"
    ]
    name_lower = name.lower()
    for brand in BRANDS:
        if brand.lower() in name_lower:
            return brand
    return ""


def detect_category(name: str) -> str:
    name_lower = name.lower()
    if any(k in name_lower for k in ["all in one", "all-in-one", "aio"]):
        return "All in One"
    if any(k in name_lower for k in ["mini pc", "nuc"]):
        return "Mini PC"
    if any(k in name_lower for k in ["lắp ráp", "lap rap", "gaming", "thpc", "workstation"]):
        return "PC Lắp ráp"
    if any(k in name_lower for k in ["đồng bộ", "dong bo", "prodesk", "elitedesk", "optiplex", "thinkcentre"]):
        return "Desktop"
    return "Desktop"


# Keyword sets để phân loại spec-badge
CPU_KW  = ["core i", "ryzen", "celeron", "pentium", "xeon", "ultra", "athlon", "i3", "i5", "i7", "i9"]
GPU_KW  = ["rtx", "gtx", "rx ", "radeon", "nvidia", "geforce", "quadro", "arc ", "gt 7", "gt 10"]
RAM_KW  = ["gb ram", "ddr4", "ddr5", "ddr3"]
SSD_KW  = ["ssd", "nvme", "hdd"]
OS_KW   = ["win ", "windows", "ubuntu", "linux"]
DISP_KW = ["inch", "fhd", "qhd", "oled", "4k", '"']
ACC_KW  = ["kb", "keyboard", "mouse", "chuột", "bàn phím"]


def classify_spec(s: str) -> str:
    sl = s.lower()
    if any(k in sl for k in CPU_KW):
        return "cpu"
    if any(k in sl for k in GPU_KW):
        return "gpu"
    if "uhd" in sl or "iris" in sl or "integrated" in sl or "onboard" in sl:
        return "gpu"
    if "intel" in sl and not any(k in sl for k in CPU_KW):
        return "gpu"   # vd "Intel® UHD Graphics 770"
    if any(k in sl for k in RAM_KW) or ("ram" in sl and re.search(r"\d+gb", sl)):
        return "ram"
    if any(k in sl for k in SSD_KW) or re.search(r"\d+(gb|tb)", sl):
        return "storage"
    if any(k in sl for k in OS_KW):
        return "os"
    if any(k in sl for k in DISP_KW):
        return "display"
    if any(k in sl for k in ACC_KW):
        return "accessories"
    return "other"


def parse_specs(spec_tags):
    result = dict(cpu="", gpu="", ram="", storage="", display="", os="", accessories="")
    for tag in spec_tags:
        text = tag.get_text(" ", strip=True)
        kind = classify_spec(text)
        if kind in result and not result[kind]:
            result[kind] = text
    return result


# ──────────────────────────────────────────────
# PARSE
# ──────────────────────────────────────────────

html_path = Path(HTML_FILE)
if not html_path.exists():
    raise FileNotFoundError(f"Không tìm thấy file: {HTML_FILE}")

with open(html_path, "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f, "lxml")

cards = soup.select("div.product-card")
if LIMIT:
    cards = cards[:LIMIT]

products = []
seen = set()

for card in cards:

    # ---- Tên ----
    name_tag = card.select_one(".product-name a")
    name = name_tag.get_text(strip=True) if name_tag else ""
    if not name:
        continue

    # ---- URL ----
    url = name_tag.get("href", "") if name_tag else ""
    if url and not url.startswith("http"):
        url = f"https://laptopre.vn{url}"

    # Bỏ trùng
    if url and url in seen:
        continue
    seen.add(url or name)

    # ---- Ảnh ----
    image = extract_image(card)

    # ---- Badges ----
    badges = [b.get_text(strip=True) for b in card.select(".product-badge")]

    # ---- Specs ----
    specs = parse_specs(card.select(".spec-badge"))

    # ---- Giá ----
    price_el    = card.select_one(".price-current")
    orig_el     = card.select_one(".price-original")
    price          = clean_price(price_el.text if price_el else "")
    original_price = clean_price(orig_el.text  if orig_el  else "")
    discount       = original_price - price if original_price > price else 0

    # ---- Trạng thái ----
    status_tag = card.select_one(".status-pill")
    status = status_tag.get_text(" ", strip=True) if status_tag else "Còn hàng"

    # ---- Rating & Đã bán ----
    rating_tag  = card.select_one(".product-rating")
    rating_text = rating_tag.get_text(" ", strip=True) if rating_tag else ""

    # ---- Brand & Category ----
    brand    = detect_brand(name)
    category = detect_category(name)

    products.append({
        "name":           name,
        "brand":          brand,
        "category":       category,
        "cpu":            specs["cpu"],
        "gpu":            specs["gpu"],
        "ram":            specs["ram"],
        "storage":        specs["storage"],
        "display":        specs["display"],
        "os":             specs["os"],
        "accessories":    specs["accessories"],
        "price":          price,
        "original_price": original_price,
        "discount":       discount,
        "status":         status,
        "rating":         extract_rating(rating_text),
        "sold":           extract_sold(rating_text),
        "url":            url,
        "image":          image,
        "badges":         badges
    })

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(products, f, ensure_ascii=False, indent=4)

print(f"✅ Đã tạo {OUTPUT_FILE} với {len(products)} sản phẩm.")