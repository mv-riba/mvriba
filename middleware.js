// Vercel Routing Middleware: serves the Bebig showcase at the root of bebig.mvriba.com.
// Only requests on that host are touched; mvriba.com is passed through unchanged.
// A vercel.json rewrite of "/" can't do this, because Vercel serves the static
// index.html before rewrites. Middleware runs before the static files.

const SHOWCASE_HOST = 'bebig.mvriba.com';

export const config = {
  // Skip Vercel's own scripts (analytics) and the shared site assets.
  matcher: ['/((?!_vercel/|assets/).*)'],
};

export default function middleware(request) {
  const url = new URL(request.url);
  const host = (request.headers.get('host') || url.host).split(':')[0].toLowerCase();
  if (host !== SHOWCASE_HOST) return; // carry on as normal

  const path = url.pathname;

  // The showcase itself: serve /bebig at the root, without changing the address bar.
  if (path === '/') {
    return new Response(null, {
      headers: { 'x-middleware-rewrite': new URL('/bebig' + url.search, url).toString() },
    });
  }

  // Files that belong to the showcase (e.g. /bebig/icon.svg) are served as they are.
  if (path.startsWith('/bebig/') && path !== '/bebig/') return;

  // The old /bebig address and any other path go to the clean root.
  return Response.redirect(new URL('/' + url.search, url), 307);
}
