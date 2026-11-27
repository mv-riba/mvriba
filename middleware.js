// Vercel Routing Middleware: serves the app showcases at the root of their own hosts
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
  const dir = SHOWCASES[host];
  if (!dir) return; // carry on as normal

  const path = url.pathname;

  // The showcase itself: serve it at the root, without changing the address bar.
  if (path === '/') {
    return new Response(null, {
      headers: { 'x-middleware-rewrite': new URL(dir + url.search, url).toString() },
    });
  }

  // Files that belong to the showcase (e.g. /momig/icon.svg) are served as they are.
  if (path.startsWith(dir + '/') && path !== dir + '/') return;

  // The old /<app> address and any other path go to the clean root.
  return Response.redirect(new URL('/' + url.search, url), 307);
}
