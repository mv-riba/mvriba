// Replaces the static post list with the latest posts from /api/posts.
// If the request fails, the posts already in the HTML stay on the page.
(function () {
  var lists = document.querySelectorAll("[data-substack-feed]");
  if (!lists.length) return;

  function formatDate(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return "";
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  function el(tag, style, text) {
    var node = document.createElement(tag);
    if (style) node.setAttribute("style", style);
    if (text) node.textContent = text;
    return node;
  }

  function renderList(container, posts) {
    var frag = document.createDocumentFragment();
    posts.forEach(function (post) {
      var a = el("a", "display: block; padding: 16px 0; border-top: 1px solid #2A2E35; color: #F2EFE9; text-decoration: none");
      a.href = post.link;
      a.appendChild(el("span", "display: block; font-size: 13px; color: #A8A39A", formatDate(post.date)));
      a.appendChild(el("span", "font-size: 18px; font-weight: 500", post.title));
      frag.appendChild(a);
    });
    container.replaceChildren(frag);
  }

  function renderCards(container, posts) {
    var frag = document.createDocumentFragment();
    posts.forEach(function (post) {
      var a = el("a", "display: flex; flex-direction: column; gap: 10px; padding: 32px; border-radius: 24px; background: #171A1F; color: #F2EFE9; text-decoration: none");
      a.href = post.link;
      a.appendChild(el("span", "font-size: 13px; color: #A8A39A", formatDate(post.date)));
      a.appendChild(el("h3", "margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-size: 24px; line-height: 1.15; font-weight: 700", post.title));
      if (post.summary) a.appendChild(el("p", "margin: 0; color: #A8A39A; font-size: 15px", post.summary));
      a.appendChild(el("span", "margin-top: auto; color: #F5A524; font-weight: 600", "Read ↗"));
      frag.appendChild(a);
    });
    container.replaceChildren(frag);
  }

  fetch("/api/posts?limit=6")
    .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
    .then(function (data) {
      if (!data.posts || !data.posts.length) return;
      lists.forEach(function (list) {
        var limit = parseInt(list.getAttribute("data-limit"), 10) || 3;
        var posts = data.posts.slice(0, limit);
        if (list.getAttribute("data-substack-feed") === "cards") renderCards(list, posts);
        else renderList(list, posts);
      });
    })
    .catch(function () { /* keep the static fallback */ });
})();
