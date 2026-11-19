// Vercel serverless function: GET /api/posts?limit=3
// Reads the Caught Between RSS feed and returns the latest posts as JSON.
// Vercel's CDN caches the response for an hour, so Substack is only asked occasionally.

const FEED_URL = "https://mriba.substack.com/feed";

function pick(block, tag) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  if (!match) return "";
  return match[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
}

function decode(text) {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();
}

module.exports = async (req, res) => {
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 3, 1), 12);
  try {
    const response = await fetch(FEED_URL, { headers: { "User-Agent": "mvriba.com feed reader" } });
    if (!response.ok) throw new Error(`Feed returned ${response.status}`);
    const xml = await response.text();
    const items = xml.split(/<item>/i).slice(1).map((chunk) => chunk.split(/<\/item>/i)[0]);
    const posts = items.slice(0, limit).map((item) => ({
      title: decode(pick(item, "title")),
      link: decode(pick(item, "link")),
      date: new Date(pick(item, "pubDate")).toISOString(),
      summary: decode(pick(item, "description")),
    }));
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).json({ posts });
  } catch (error) {
    res.setHeader("Cache-Control", "s-maxage=300");
    res.status(502).json({ posts: [], error: "Could not load the feed" });
  }
};
