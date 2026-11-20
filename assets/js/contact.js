// Sends the contact form to Formspree without leaving the page.
(function () {
  var form = document.querySelector("[data-contact-form]");
  if (!form) return;
  var status = form.querySelector(".form-status");
  var button = form.querySelector("button[type=submit]");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    status.textContent = "Sending…";
    status.style.color = "#A8A39A";
    button.disabled = true;

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
      .then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (data) {
          if (!response.ok) {
            var detail = data && data.errors && data.errors.length
              ? data.errors.map(function (e) { return e.message; }).join(" ")
              : (data && data.error) || ("Error " + response.status);
            throw new Error(detail);
          }
          form.reset();
          status.textContent = "Thanks! Your message is on its way, and I'll reply as soon as I can.";
          status.style.color = "#F5A524";
        });
      })
      .catch(function (error) {
        status.textContent = "Sorry, that didn't send (" + (error.message || "network error") + "). Please try again, or reach me on LinkedIn.";
        status.style.color = "#FF8A7A";
      })
      .finally(function () {
        button.disabled = false;
      });
  });
})();
