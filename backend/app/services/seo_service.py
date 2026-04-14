from datetime import datetime
from html import escape

from app.core.config import settings
from app.models.article import Article
from app.models.site_setting import SiteSetting


def build_public_url(path: str) -> str:
    return f"{settings.site_url.rstrip('/')}{path}"


def build_sitemap_xml(site_setting: SiteSetting, articles: list[Article]) -> str:
    pages = [
        build_public_url("/"),
        build_public_url("/archive"),
        build_public_url("/categories"),
        build_public_url("/tags"),
        build_public_url("/about"),
    ]
    article_urls = [build_public_url(f"/articles/{article.slug}") for article in articles]
    urls = pages + article_urls

    items = "\n".join(
        f"  <url><loc>{escape(url)}</loc></url>"
        for url in urls
    )
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{items}\n"
        "</urlset>\n"
    )


def build_robots_txt() -> str:
    return "\n".join(
        [
            "User-agent: *",
            "Allow: /",
            f"Sitemap: {build_public_url('/sitemap.xml')}",
            "",
        ]
    )


def _format_rss_date(value: datetime | None) -> str:
    if value is None:
        return ""
    return value.strftime("%a, %d %b %Y %H:%M:%S GMT")


def build_rss_xml(site_setting: SiteSetting, articles: list[Article]) -> str:
    site_name = escape(site_setting.site_name)
    site_description = escape(site_setting.site_description or "个人博客更新")
    items = []

    for article in articles[:20]:
        article_url = escape(build_public_url(f"/articles/{article.slug}"))
        items.append(
            "\n".join(
                [
                    "    <item>",
                    f"      <title>{escape(article.title)}</title>",
                    f"      <link>{article_url}</link>",
                    f"      <guid>{article_url}</guid>",
                    f"      <description>{escape(article.summary or '')}</description>",
                    f"      <pubDate>{_format_rss_date(article.published_at or article.created_at)}</pubDate>",
                    "    </item>",
                ]
            )
        )

    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<rss version="2.0">\n'
        "  <channel>\n"
        f"    <title>{site_name}</title>\n"
        f"    <link>{escape(settings.site_url.rstrip('/'))}</link>\n"
        f"    <description>{site_description}</description>\n"
        f"{chr(10).join(items)}\n"
        "  </channel>\n"
        "</rss>\n"
    )
