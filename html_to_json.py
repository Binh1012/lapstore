import json
import re
from bs4 import BeautifulSoup
import sys
sys.stdout.reconfigure(encoding="utf-8")

HTML_FILE = "Máy tính bàn, PC Đà Nẵng - Thanh Hương Technology.html"
OUTPUT_FILE = "products.json"
LIMIT = 60


def clean_price(text):
    if not text:
        return 0
    return int(re.sub(r"[^\d]", "", text))


def extract_number(text):
    if not text:
        return 0
    m = re.search(r"Đã bán\s*(\d+)", text)
    if m:
        return int(m.group(1))
    return 0


def extract_rating(text):
    if not text:
        return 0
    m = re.search(r"(\d+(\.\d+)?)", text)
    if m:
        return float(m.group(1))
    return 0


with open(HTML_FILE, "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f, "lxml")

products = []

cards = soup.select("div.product-card")

for card in cards[:LIMIT]:

    # tên
    name = ""
    name_tag = card.select_one(".product-name a")
    if name_tag:
        name = name_tag.get_text(strip=True)

    # link
    url = name_tag["href"] if name_tag and name_tag.has_attr("href") else ""

    # ảnh
    image = ""
    img = card.select_one(".product-image-inner")
    if img:
        image = img.get("data-bg", "")
        if image.startswith("/"):
            image = "https://laptopre.vn" + image

    # badge
    badges = [
        x.get_text(strip=True)
        for x in card.select(".product-badge")
    ]

    # specs
    specs = [
        x.get_text(" ", strip=True)
        for x in card.select(".spec-badge")
    ]

    cpu = ""
    gpu = ""
    ram = ""
    storage = ""
    display = ""
    os = ""
    accessories = ""

    for s in specs:

        if "RAM" in s:
            ram = s.replace("RAM", "").strip()

        elif "SSD" in s:
            storage = s.replace("SSD", "").strip()

        elif any(x in s for x in [
            "Intel",
            "RX",
            "RTX",
            "Graphics",
            "UHD",
            "Radeon"
        ]):
            gpu = s

        elif any(x in s for x in [
            "Win",
            "Windows"
        ]):
            os = s

        elif any(x in s for x in [
            "KB",
            "Mouse",
            "M"
        ]):
            accessories = s

        elif '"' in s or "inch" in s or "FHD" in s:
            display = s

        else:
            cpu = s

    current_price = clean_price(
        card.select_one(".price-current").text
        if card.select_one(".price-current")
        else ""
    )

    original_price = clean_price(
        card.select_one(".price-original").text
        if card.select_one(".price-original")
        else ""
    )

    discount = int(card.get("data-discount", "0"))

    status = ""
    status_tag = card.select_one(".status-pill")
    if status_tag:
        status = status_tag.get_text(" ", strip=True)

    rating_text = ""
    rating_tag = card.select_one(".product-rating")
    if rating_tag:
        rating_text = rating_tag.get_text(" ", strip=True)

    product = {
        "name": name,
        "brand": name.split()[2] if name.startswith("PC") else "",
        "category": "All in One" if "All in One" in name or "All in one" in name else "Desktop",
        "cpu": cpu,
        "gpu": gpu,
        "ram": ram,
        "storage": storage,
        "display": display,
        "os": os,
        "accessories": accessories,
        "price": current_price,
        "original_price": original_price,
        "discount": discount,
        "status": status,
        "rating": extract_rating(rating_text),
        "sold": extract_number(rating_text),
        "url": url,
        "image": image,
        "badges": badges
    }

    products.append(product)

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(products, f, ensure_ascii=False, indent=4)

print(f"Đã tạo {OUTPUT_FILE} với {len(products)} sản phẩm.")