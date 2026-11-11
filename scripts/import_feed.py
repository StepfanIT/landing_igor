"""
Імпорт техніки з фіду Prom (YML) у каталоги лендінгів.

Що робить:
  1. Завантажує фіди (URL у FEEDS нижче), бере назву, ціну, рік, характеристики та фото.
  2. Прибирає фон з головного фото (rembg), ставить машину на прозоре тло з м'якою тінню —
     у картках вона виглядає як у макеті (техніка на світлому фоні).
  3. Записує фото в <site>/public/images/products/ і дані в <site>/src/data/products.ts.

Запуск (один раз потрібні залежності):
  python -m venv .venv-feed && .venv-feed/Scripts/pip install "rembg[cpu]" pillow
  .venv-feed/Scripts/python scripts/import_feed.py
"""

from __future__ import annotations

import io
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
FEED_BASE = "https://050-999-59-39.online/products_feed.xml?hash_tag=771810327706c7192103bc9c78628783&sales_notes=&label_ids=&exclude_fields=&html_description=1&yandex_cpa=&process_presence_sure=&languages=uk%2Cru&extra_fields=&group_ids=&product_ids="
FEEDS = {
    # телескопічні навантажувачі → сайт JCB
    "jcb": "3095744909,3095744911,3095744914,3095744921,3095744910,3095744912,3109355659,3109598553,3113462930,3113462928,3109598535,3109598537,3095744922,3109598534,3109598548,3095744923,3095744924,3109598536,3109598538,3109598549,3113462940,3109598547,3109598554,3109598539,3095744926,3095744927,3109598543,3109598550,3109598544,3113462939",
    # міні-навантажувачі Bobcat → сайт Bobcat
    "bobcat": "3113462929,3095744929,3113462937,3095744928,3109598533,3109598532,3095744930,3109598540,3113462938,3113462936,3113462934,3113462933,3113462931,3109598551,3109598542,3109598545,3095744925,3095744918,3095744919,3095744917",
}
# на сайті JCB показуємо лише JCB (Manitou — інший бренд)
BRAND_FILTER = {"jcb": "JCB", "bobcat": "Bobcat"}
# оголошення з брудними/погано вирізаними фото (вода, водяні знаки, артефакти фону) — не показуємо
EXCLUDE = {
    "bobcat": {
        "3113462929",
        # відео Ігоря 2026-11-11: T650 2018, S650 2017 — погано вирізані;
        # бетономішалка, щітка, 2 снігоочисники SB240 і мульчер Prinoth — навісного не видно / брудно
        "3095744930", "3113462937", "3095744918", "3095744919", "3113462931", "3113462934", "3113462936",
    },
    "jcb": {"3109598549", "3109598535", "3109598547", "3095744914", "3109598539", "3095744911"},
}
MAX_SANE_PRICE = 500_000  # ціни вище — явна помилка у фіді → "Ціна за запитом"
CANVAS = (1200, 800)
CACHE = ROOT / ".feed-cache"

MACHINE_CATEGORIES = {"155305209", "155305250"}  # телескопічні + міні-навантажувачі; решта — навісне
ATTACH_KINDS = [  # (ключове слово в назві, вид, короткий опис)
    ("щітк", "broom", "Прибирання територій, снігу та будівельного сміття."),
    ("мульчер", "mower", "Подрібнення чагарників, порослі та пнів на ділянках."),
    ("вила", "forks", "Переміщення піддонів і будматеріалів."),
    ("молот", "breaker", "Демонтаж бетону, асфальту та фундаментів."),
    ("снігороз", "snowblower", "Прибирання глибокого снігу з викидом убік."),
    ("снігоочис", "snowblower", "Прибирання глибокого снігу з викидом убік."),
    ("розкидач", "bucket", "Посипання доріг і майданчиків піщано-сольовою сумішшю."),
    ("бетоном", "bucket", "Приготування та подача бетону прямо на об'єкті."),
    ("бетонозміш", "bucket", "Приготування та подача бетону прямо на об'єкті."),
    ("каток", "bucket", "Ущільнення ґрунту, щебеню та асфальту."),
    ("бур", "auger", "Буріння під стовпи, палі та посадку дерев."),
    ("ківш", "bucket", "Земляні роботи та навантаження сипучих матеріалів."),
]
MAX_ATTACHMENT_PRICE = {"forks": 5000}  # вища ціна — помилка у фіді


def attachment_info(name: str) -> tuple[str, str]:
    low = name.lower()
    for key, kind, text in ATTACH_KINDS:
        if key in low:
            return kind, text
    return "bucket", "Навісне обладнання для міні-навантажувачів."


def attachment_title(name: str) -> str:
    n = re.sub(r"\s+для\s+міні[\s-]*навантажувач\w*", "", name.strip(), flags=re.I)
    n = re.sub(r"\s+Bobcat\s+CAT\s+Mustang\s+Gehl\s+New\s+Holland", "", n, flags=re.I)
    return re.sub(r"\s+", " ", n).strip()


PREFIXES = r"^(Телескопічний навантажувач|Колісний міні навантажувач|Гусеничний міні навантажувач|Міні навантажувач|Мінінавантажувач|Фронтальний навантажувач)\s+"


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (landing feed import)"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def short_name(name: str) -> str:
    n = re.sub(PREFIXES, "", name.strip(), flags=re.I)
    n = re.sub(r"\s+(19|20)\d{2}$", "", n)
    m = re.match(r"^(Agri Plus|Agri)\s+(JCB.*)$", n, re.I)
    if m:
        n = f"{m.group(2)} {m.group(1)}"
    n = re.sub(r"\bAGRI\b", "Agri", n)
    n = re.sub(r"\bSUPER\b", "Super", n)
    n = re.sub(r"\bPLUS\b", "Plus", n)
    return re.sub(r"\s+", " ", n).strip()


def year_of(name: str, params: dict[str, str]) -> str | None:
    m = re.search(r"\b(19|20)\d{2}\b", name)
    if m:
        return m.group(0)
    for k, v in params.items():
        if re.search(r"год выпуска|рік випуску", k, re.I) and v and re.fullmatch(r"(19|20)\d{2}", v.strip()):
            return v.strip()
    return None


def num(v: str | None) -> float | None:
    if not v:
        return None
    m = re.search(r"\d+(?:[.,]\d+)?", v.replace(" ", ""))
    return float(m.group(0).replace(",", ".")) if m else None


def fmt_t(kg: float) -> str:
    return f"{kg / 1000:.1f}".rstrip("0").rstrip(".").replace(".", ",") + " т"


def specs_of(params: dict[str, str]) -> list[dict[str, str]]:
    out: list[dict[str, str]] = []
    def find(pattern: str) -> str | None:
        return next((v for k, v in params.items() if re.search(pattern, k, re.I) and v), None)
    cap = num(find(r"грузоподъем|вантажопід"))
    if cap:
        out.append({"label": "Вантажопідйомність", "value": fmt_t(cap)})
    height = num(find(r"висота|высота"))
    if height:
        out.append({"label": "Висота підйому", "value": f"{height:g} м".replace(".", ",")})
    hours = num(find(r"наработ|напрацюв|мотогод|моточас"))
    if hours:
        out.append({"label": "Напрацювання", "value": f"{int(hours):,} мотогод".replace(",", " ")})
    weight = num(find(r"^вес$|^вага$"))
    if weight:
        out.append({"label": "Вага", "value": fmt_t(weight)})
    power = num(find(r"мощн|потужн"))
    if power:
        out.append({"label": "Потужність", "value": f"{int(power)} к.с."})
    return out


def slugify(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def cutout(img_bytes: bytes, session) -> Image.Image:
    """Прибирає фон, обрізає по контуру, ставить на прозоре полотно 1200×800 з тінню."""
    from rembg import remove

    src = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    rgba = remove(src, session=session, post_process_mask=True)
    alpha = rgba.getchannel("A").point(lambda a: 0 if a < 24 else a)
    rgba.putalpha(alpha)
    bbox = alpha.getbbox()
    if bbox:
        rgba = rgba.crop(bbox)
    W, H = CANVAS
    max_w, max_h = int(W * 0.9), int(H * 0.8)
    scale = min(max_w / rgba.width, max_h / rgba.height)
    rgba = rgba.resize((max(1, int(rgba.width * scale)), max(1, int(rgba.height * scale))), Image.LANCZOS)

    canvas = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    x = (W - rgba.width) // 2
    y = H - rgba.height - int(H * 0.07)
    # м'яка тінь під машиною
    shadow = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    sh = Image.new("L", (int(rgba.width * 0.9), max(8, int(H * 0.06))), 0)
    from PIL import ImageDraw
    ImageDraw.Draw(sh).ellipse((0, 0, sh.width - 1, sh.height - 1), fill=110)
    sh = sh.filter(ImageFilter.GaussianBlur(radius=max(4, sh.height // 3)))
    shadow.paste((0, 0, 0, 255), (x + (rgba.width - sh.width) // 2, y + rgba.height - sh.height // 2), sh)
    canvas = Image.alpha_composite(canvas, shadow)
    canvas.alpha_composite(rgba, (x, y))
    return canvas


def pick_picture(urls: list[str]) -> bytes:
    """Перше горизонтальне фото серед перших трьох (вертикальні гірше виглядають у картці)."""
    first = None
    for i, u in enumerate(urls[:3]):
        key = CACHE / (slugify(u)[-80:] + ".jpg")
        if key.exists():
            data = key.read_bytes()
        else:
            data = fetch(u)
            key.write_bytes(data)
        first = first or data
        with Image.open(io.BytesIO(data)) as im:
            if im.width >= im.height:
                return data
    return first  # type: ignore[return-value]


def main() -> None:
    from rembg import new_session

    CACHE.mkdir(exist_ok=True)
    session = new_session("isnet-general-use")
    for site, ids in FEEDS.items():
        xml = fetch(FEED_BASE + ids.replace(",", "%2C"))
        root = ET.fromstring(xml)
        out_dir = ROOT / site / "public" / "images" / "products"
        out_dir.mkdir(parents=True, exist_ok=True)
        items = []
        attachments = []
        att_dir = ROOT / site / "public" / "images" / "attachments"
        for o in root.iter("offer"):
            name = o.findtext("name_ua") or o.findtext("name") or ""
            vendor = o.findtext("vendor") or ""
            if o.get("id") in EXCLUDE.get(site, set()):
                print(f"[{site}] пропускаю (погане фото): {name}")
                continue
            if o.findtext("categoryId") not in MACHINE_CATEGORIES:
                # навісне обладнання
                att_dir.mkdir(parents=True, exist_ok=True)
                pid = o.get("id")
                title = attachment_title(name)
                kind, text = attachment_info(name)
                if re.search(r"bobcat.*cat.*mustang", name, re.I):
                    text += " Підходить до Bobcat, CAT, Mustang, Gehl, New Holland."
                price = int(float(o.findtext("price") or 0)) or None
                if price and price > MAX_ATTACHMENT_PRICE.get(kind, 100_000):
                    print(f"[{site}] підозріла ціна {price} у «{name}» → ціна за запитом")
                    price = None
                pics = [p.text for p in o.findall("picture") if p.text]
                file = f"{slugify(title)}-{pid}.webp"
                if pics and not (att_dir / file).exists():
                    print(f"[{site}] фото навісного: {title}")
                    cutout(pick_picture(pics), session).save(att_dir / file, "WEBP", quality=86, method=6)
                attachments.append({
                    "id": pid,
                    "name": title,
                    "kind": kind,
                    "image": f"/images/attachments/{file}" if pics else None,
                    "text": text,
                    "price": (f"{price:,}".replace(",", " ") + " €") if price else None,
                })
                continue
            if BRAND_FILTER[site].lower() not in (name + " " + vendor).lower():
                print(f"[{site}] пропускаю (інший бренд): {name}")
                continue
            if o.get("id") in EXCLUDE.get(site, set()):
                print(f"[{site}] пропускаю (погане фото): {name}")
                continue
            params = {p.get("name") or "": (p.text or "").strip() for p in o.findall("param")}
            pics = [p.text for p in o.findall("picture") if p.text]
            title = short_name(name)
            year = year_of(name, params)
            price = int(float(o.findtext("price") or 0)) or None
            if price and price > MAX_SANE_PRICE:
                print(f"[{site}] підозріла ціна {price} у «{name}» → ціна за запитом")
                price = None
            kind = "telehandler" if site == "jcb" else ("track-loader" if "гусенич" in name.lower() else "skid-steer")
            pid = o.get("id")
            file = f"{slugify(title)}-{pid}.webp"
            if pics and not (out_dir / file).exists():
                print(f"[{site}] фото: {title} {year or ''}")
                cutout(pick_picture(pics), session).save(out_dir / file, "WEBP", quality=86, method=6)
            items.append({
                "id": pid,
                "name": title,
                "kind": kind,
                "image": f"/images/products/{file}" if pics else None,
                "deals": ["sale"],
                "badge": year,
                "price": price,
                "currency": "EUR" if price else None,
                "priceSale": (f"{price:,}".replace(",", " ") + " €") if price else None,
                "specs": specs_of(params),
                "sourceUrl": o.findtext("url"),
            })
        items.sort(key=lambda p: (-(int(p["badge"]) if p["badge"] else 0), -(p["price"] or 0)))
        data_dir = ROOT / site / "src" / "data"
        data_dir.mkdir(parents=True, exist_ok=True)
        clean = [{k: v for k, v in it.items() if v not in (None, [], "")} for it in items]
        ts = (
            "// Згенеровано scripts/import_feed.py з фіду Prom (TEHNOCAT). Не редагуйте вручну —\n"
            "// перезапустіть скрипт, щоб оновити каталог.\n"
            'import type { Product } from "@landing/ui";\n\n'
            f"export const products: Product[] = {json.dumps(clean, ensure_ascii=False, indent=2)};\n"
        )
        (data_dir / "products.ts").write_text(ts, encoding="utf-8")
        print(f"[{site}] {len(items)} товарів → {data_dir / 'products.ts'}")
        if attachments:
            clean_a = [{k: v for k, v in it.items() if v not in (None, [], "")} for it in attachments]
            ts_a = (
                "// Згенеровано scripts/import_feed.py з фіду Prom (TEHNOCAT). Не редагуйте вручну.\n"
                'import type { Attachment } from "@landing/ui";\n\n'
                f"export const attachments: Attachment[] = {json.dumps(clean_a, ensure_ascii=False, indent=2)};\n"
            )
            (data_dir / "attachments.ts").write_text(ts_a, encoding="utf-8")
            print(f"[{site}] {len(attachments)} позицій навісного → {data_dir / 'attachments.ts'}")


if __name__ == "__main__":
    sys.exit(main())
