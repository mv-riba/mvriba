// Vercel Routing Middleware: serves the app showcases at the root of their subdomains
// (bebig.mvriba.com → /bebig, momig.mvriba.com → /momig).
// Only requests on those hosts are touched; mvriba.com is passed through unchanged.
// A vercel.json rewrite of "/" can't do this, because Vercel serves the static
// index.html before rewrites. Middleware runs before the static files.

const SHOWCASES = {
  'bebig.mvriba.com': '/bebig',
  'momig.mvriba.com': '/momig',
};

export const config = {
  // Skip Vercel's own scripts (analytics) and the shared site assets.
  matcher: ['/((?!_vercel/|assets/).*)'],
};

export default function middleware(request) {
  const url = new URL(request.url);
  const host = (request.headers.get('host') || url.host).split(':')[0].toLowerCase();
  const base = SHOWCASES[host];
  if (!base) return; // carry on as normal

  const path = url.pathname;

  // The showcase itself: serve it at the root, without changing the address bar.
  if (path === '/') {
    return new Response(null, {
      headers: { 'x-middleware-rewrite': new URL(base + url.search, url).toString() },
    });
  }

  // Files that belong to a showcase (e.g. /momig/icon.svg, or the shared /bebig/marija.jpg)
  // are served as they are.
  for (const dir of Object.values(SHOWCASES)) {
    if (path.startsWith(dir + '/') && path !== dir + '/') return;
  }

  // The old /bebig or /momig address and any other path go to the clean root.
  return Response.redirect(new URL('/' + url.search, url), 307);
}
