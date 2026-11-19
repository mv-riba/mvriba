# mvriba.com

Personal website of Marija Riba: seven static HTML pages, one serverless function and no build step.

```
index.html, about.html, experience.html, writing.html, podcast.html, projects.html, contact.html, 404.html
assets/css/site.css      shared styles, self-hosted fonts, mobile tweaks
assets/js/posts.js       loads the latest Substack posts on Home and Writing
assets/js/contact.js     sends the contact form to Formspree without a page reload
api/posts.js             Vercel function: reads https://mriba.substack.com/feed, returns JSON, cached 1 hour
assets/fonts/            Inter and Bricolage Grotesque (SIL Open Font License, see *-OFL.txt)
assets/img/, assets/Marija-Riba-CV.pdf
vercel.json              clean URLs (/about instead of /about.html) and caching headers
```

## Deploying on Vercel

1. vercel.com → **Add New… → Project** → import `mv-riba/mvriba`.
2. Framework preset: **Other**. Leave the build command and output directory empty. Click **Deploy**.
3. **Settings → Domains** → add `mvriba.com` (and `www.mvriba.com`, set to redirect to `mvriba.com`).
   Vercel shows the DNS records to add at your domain registrar (usually an `A` record for `mvriba.com`
   and a `CNAME` for `www`). Leave the existing `bebig` and `streaks` records as they are.
4. **Analytics** tab → **Enable** Web Analytics. The tracking script is already in every page.
   It's cookie-free, so no cookie banner is needed.

## How the dynamic parts work

- **Substack feed:** Home and Writing ship with the three latest posts written into the HTML as a fallback.
  On load, `posts.js` asks `/api/posts`, which reads the RSS feed and swaps in the newest posts.
  New posts appear within about an hour, with no redeploy needed.
- **Contact form:** posts to `https://formspree.io/f/xppdlbzr`. With JavaScript, it submits in the
  background and shows a thank-you message. Without it, Formspree's own thank-you page is shown.
  A hidden `_gotcha` field catches spam bots. Set the email that receives messages in the Formspree dashboard.
- **Newsletter sign-up:** Substack's embed (`https://mriba.substack.com/embed`) on the Writing page,
  with a plain "subscribe on Substack" link underneath.

## Editing

Each page is a plain HTML file, so you can edit text directly. Commit to `main` and Vercel redeploys automatically.
