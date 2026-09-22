from pathlib import Path
import re
import html
from datetime import datetime

BASE_URL = "https://zabiullahkarimi05-coder.github.io/andisha"

ROOT = Path(__file__).resolve().parent.parent
ARTICLES_DIR = ROOT / "content" / "articles"
OUTPUT_DIR = ROOT / "articles"

ARTICLES_PAGE = ROOT / "articles.html"
SITEMAP = ROOT / "sitemap.xml"


# ---------------------------------------------------------
# PARSE ARTICLE
# ---------------------------------------------------------

def parse_article(path):
    text = path.read_text(encoding="utf-8")

    if not text.startswith("---"):
        raise ValueError(f"Front matter missing: {path.name}")

    parts = text.split("---", 2)

    if len(parts) != 3:
        raise ValueError(f"Invalid article format: {path.name}")

    meta_text = parts[1].strip()
    body = parts[2].strip()

    meta = {}

    for line in meta_text.splitlines():
        match = re.match(
            r'^([A-Za-z_][A-Za-z0-9_-]*):\s*"(.*)"$',
            line
        )

        if match:
            meta[match.group(1)] = match.group(2)

    return meta, body


# ---------------------------------------------------------
# MARKDOWN TO HTML
# ---------------------------------------------------------

def markdown_to_html(text):
    lines = text.splitlines()
    result = []
    paragraph = []

    def flush_paragraph():
        if paragraph:
            content = " ".join(x.strip() for x in paragraph)
            content = html.escape(content)
            result.append(f"<p>{content}</p>")
            paragraph.clear()

    for line in lines:
        line = line.strip()

        if not line:
            flush_paragraph()
            continue

        # حذف H1 اول مقاله
        # چون H1 اصلی در قالب HTML ساخته می‌شود.
        if line.startswith("# "):
            flush_paragraph()
            continue

        if line.startswith("### "):
            flush_paragraph()
            title = html.escape(line[4:])
            result.append(f"<h3>{title}</h3>")

        elif line.startswith("## "):
            flush_paragraph()
            title = html.escape(line[3:])
            result.append(f"<h2>{title}</h2>")

        else:
            paragraph.append(line)

    flush_paragraph()

    return "\n".join(result)


# ---------------------------------------------------------
# SLUG
# ---------------------------------------------------------

def slug_from_filename(path):
    return path.stem


# ---------------------------------------------------------
# BUILD ARTICLE
# ---------------------------------------------------------

def build_article(path):
    meta, body = parse_article(path)

    title = meta.get("title", path.stem)
    description = meta.get("description", "")
    category = meta.get("category", "")
    author = meta.get("author", "مجله اندیشه")
    image = meta.get("image", "")
    date = meta.get("date", "")
    read_time = meta.get("read_time", "")

    slug = slug_from_filename(path)

    url = f"{BASE_URL}/articles/{slug}.html"

    article_html = markdown_to_html(body)

    title_e = html.escape(title, quote=True)
    description_e = html.escape(description, quote=True)
    category_e = html.escape(category)
    author_e = html.escape(author)

    image_tag = ""

    if image:
        image_tag = f'''
        <img
            src="{html.escape(image, quote=True)}"
            alt="{title_e}"
            class="article-cover"
            loading="lazy">
        '''

    date_meta = ""

    if date:
        date_meta += f'<span>{html.escape(date)}</span>'

    if read_time:
        date_meta += f'<span>{html.escape(read_time)}</span>'

    output = f'''<!DOCTYPE html>
<html lang="fa" dir="rtl">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>{title_e} | اندیشه</title>

    <meta name="description" content="{description_e}">
    <meta name="author" content="{author_e}">
    <meta name="robots" content="index, follow">

    <link
        rel="canonical"
        href="{url}">

    <meta
        property="og:type"
        content="article">

    <meta
        property="og:title"
        content="{title_e} | اندیشه">

    <meta
        property="og:description"
        content="{description_e}">

    <meta
        property="og:url"
        content="{url}">

    <meta
        property="og:locale"
        content="fa_IR">

    <meta
        name="twitter:card"
        content="summary">

    <meta
        name="twitter:title"
        content="{title_e} | اندیشه">

    <meta
        name="twitter:description"
        content="{description_e}">

    <link rel="stylesheet" href="../style.css">
    <link rel="stylesheet" href="../article-style.css">

</head>


<body>


<header class="site-header">

    <div class="header-container">

        <a href="../index.html" class="logo">

            <span class="logo-fa">
                اندیشه
            </span>

            <span class="logo-en">
                ANDISHA
            </span>

        </a>

        <nav class="main-nav">

            <a href="../index.html">
                خانه
            </a>

            <a href="../categories.html">
                دسته‌بندی‌ها
            </a>

            <a href="../articles.html">
                مقالات
            </a>

            <a href="../about.html">
                درباره ما
            </a>

            <a href="../contact.html">
                تماس با ما
            </a>

        </nav>

    </div>

</header>


<main class="article-page">

    <article>

        <h1>{title_e}</h1>

        <div class="article-meta">

            {date_meta}

            <span>
                {category_e}
            </span>

            <span>
                {author_e}
            </span>

        </div>

        {image_tag}

        <div class="article-content">

            {article_html}

        </div>

    </article>

</main>


<footer class="site-footer">

    <div class="footer-container">

        <div class="footer-brand">

            <div class="footer-logo">
                اندیشه
            </div>

            <p>
                مجله‌ای اسلامی، علمی و فکری برای انسان‌هایی
                که می‌خواهند بیشتر بدانند و عمیق‌تر بیندیشند.
            </p>

        </div>

    </div>

    <div class="footer-bottom">

        <p>
            © <span id="currentYear"></span>
            ANDISHA Magazine — تمامی حقوق محفوظ است.
        </p>

    </div>

</footer>


<script src="../script.js"></script>

<script>

const yearElement =
    document.getElementById("currentYear");

if (yearElement) {{
    yearElement.textContent =
        new Date().getFullYear();
}}

</script>


</body>
</html>
'''

    OUTPUT_DIR.mkdir(exist_ok=True)

    output_file = OUTPUT_DIR / f"{slug}.html"

    output_file.write_text(
        output,
        encoding="utf-8"
    )

    return output_file


# ---------------------------------------------------------
# ARTICLE CARD
# ---------------------------------------------------------

def build_article_card(path):
    meta, _ = parse_article(path)

    title = meta.get("title", path.stem)
    description = meta.get("description", "")
    category = meta.get("category", "")
    image = meta.get("image", "")
    date = meta.get("date", "")
    read_time = meta.get("read_time", "")

    slug = slug_from_filename(path)

    url = f"articles/{slug}.html"

    title_e = html.escape(title, quote=True)
    description_e = html.escape(description, quote=True)
    category_e = html.escape(category)

    category_map = {
        "فلسفه و اندیشه": "philosophy",
        "اسلام و ادیان": "islam",
        "علوم اجتماعی": "social-science",
        "روان‌شناسی": "psychology",
        "جامعه و فرهنگ": "culture",
        "تاریخ و تمدن": "history",
        "سیاست و حکومت": "politics",
        "اقتصاد و کسب‌وکار": "economy",
        "حقوق و عدالت": "law",
        "علم و دانش": "science",
        "پزشکی و سلامت": "health",
        "تکنولوژی و آینده": "technology",
        "آموزش و دانشگاه": "education",
        "ادبیات و شعر": "literature",
        "هنر و سینما": "art",
        "زبان و زبان‌شناسی": "language",
        "رسانه و ارتباطات": "media",
        "محیط‌زیست و طبیعت": "environment",
        "جغرافیا و جهان": "geography",
        "افغانستان": "afghanistan",
        "زنان و خانواده": "family",
        "اخلاق و ارزش‌ها": "ethics",
        "نقد و بررسی": "review",
        "کتاب و معرفی آثار": "books",
        "یادداشت و دیدگاه": "opinions",
    }

    category_slug = category_map.get(
        category,
        "all"
    )

    if not date:
        date = "جدید"

    if not read_time:
        read_time = "مطالعه"

    if image:
        image_html = f'''
        <img
            src="{html.escape(image, quote=True)}"
            alt="{title_e}">
        '''
    else:
        image_html = '''
        <div class="article-placeholder">
            اندیشه
        </div>
        '''

    return f'''
<article
    class="article-card"
    data-category="{category_slug}"
    data-title="{title_e}">

    <a
        href="{url}"
        class="article-image">

        {image_html}

        <span class="article-category">
            {category_e}
        </span>

    </a>

    <div class="article-content">

        <div class="article-meta">

            <span>
                {html.escape(date)}
            </span>

            <span>
                {html.escape(read_time)}
            </span>

        </div>

        <h2>
            {title_e}
        </h2>

        <p>
            {description_e}
        </p>

        <a
            href="{url}"
            class="card-link">
            ادامه مطلب →
        </a>

    </div>

</article>
'''


# ---------------------------------------------------------
# UPDATE ARTICLES PAGE
# ---------------------------------------------------------

def update_articles_page(article_files):

    if not ARTICLES_PAGE.exists():
        print("WARNING: articles.html not found.")
        return

    text = ARTICLES_PAGE.read_text(
        encoding="utf-8"
    )

    marker_start = "<!-- AUTO-ARTICLES-START -->"
    marker_end = "<!-- AUTO-ARTICLES-END -->"

    generated = "\n".join(
        build_article_card(path)
        for path in article_files
    )

    block = f'''
{marker_start}

{generated}

{marker_end}
'''

    pattern = re.escape(marker_start) + r".*?" + re.escape(marker_end)

    if re.search(
        pattern,
        text,
        flags=re.DOTALL
    ):

        text = re.sub(
            pattern,
            block.strip(),
            text,
            flags=re.DOTALL
        )

    else:

        target = '<div class="articles-grid articles-page-grid">'

        if target not in text:
            print(
                "WARNING: article grid not found in articles.html."
            )
            return

        text = text.replace(
            target,
            target + block,
            1
        )

    ARTICLES_PAGE.write_text(
        text,
        encoding="utf-8"
    )

    print("UPDATED: articles.html")


# ---------------------------------------------------------
# SITEMAP
# ---------------------------------------------------------

def build_sitemap(article_files):

    urls = [
        f"{BASE_URL}/",
        f"{BASE_URL}/articles.html",
        f"{BASE_URL}/categories.html",
        f"{BASE_URL}/about.html",
        f"{BASE_URL}/contact.html",
        f"{BASE_URL}/privacy.html",
    ]

    for path in article_files:
        slug = slug_from_filename(path)
        urls.append(
            f"{BASE_URL}/articles/{slug}.html"
        )

    today = datetime.now().strftime("%Y-%m-%d")

    entries = []

    for url in urls:

        entries.append(
            f'''    <url>
        <loc>{html.escape(url)}</loc>
        <lastmod>{today}</lastmod>
    </url>'''
        )

    sitemap = f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

{chr(10).join(entries)}

</urlset>
'''

    SITEMAP.write_text(
        sitemap,
        encoding="utf-8"
    )

    print("UPDATED: sitemap.xml")


# ---------------------------------------------------------
# MAIN
# ---------------------------------------------------------

def main():

    ARTICLES_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    OUTPUT_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    article_files = sorted(
        ARTICLES_DIR.glob("*.md")
    )

    if not article_files:
        print("No articles found.")
        return

    print()
    print("=== ANDISHA BUILD ===")
    print()

    for path in article_files:

        try:

            output = build_article(path)

            print(
                f"BUILT: {output.name}"
            )

        except Exception as e:

            print(
                f"ERROR: {path.name} -> {e}"
            )

    update_articles_page(
        article_files
    )

    build_sitemap(
        article_files
    )

    print()
    print("BUILD COMPLETE.")
    print()


if __name__ == "__main__":
    main()