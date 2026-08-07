/* =========================================================
   For Venus and Flo - dynamic layout engine
   One file renders: slim nav, hero, footer, videos, gift options.
   Includes a playful blinking prank option "D" for fun.
   ========================================================= */

(function () {
  "use strict";

  /* ---------- 0. Site-wide config ---------- */
  var site = {
    monogram: { left: "V", right: "F" },
    heroDate: "Herzlichen Gl\u00FCckwunsch"
  };

  /* ---------- 1. Per-page hero text ---------- */
  var pageContent = {
    "index.html": {
      eyebrow: "A Wedding Gift",
      title: "For Venus & Flo",
      subtitle: "A small digital gift made with love, memories, and warm wishes.",
      showDate: true
    },
    "videos.html": {
      eyebrow: "Special Memories",
      title: "Your Videos",
      subtitle: "A small collection of video memories prepared for you both.",
      showDate: false
    },
    "voucher.html": {
      eyebrow: "Your Wedding Gift",
      title: "Choose Your Gift",
      subtitle: "Pick the gift you would enjoy most, then leave a short message if you like.",
      showDate: false
    },
    "thank-you.html": {
      eyebrow: "Gift Choice Sent",
      title: "Thank You",
      subtitle: "Your choice was received. We will prepare your gift soon.",
      showDate: false
    }
  };

  /* ---------- 2. Navigation ---------- */
  var navItems = [
    { file: "index.html", label: "Home" },
    { file: "videos.html", label: "Videos" },
    { file: "voucher.html", label: "Gift" }
  ];

  /* ---------- 3. Videos (edit these to swap videos) ---------- */
  var videos = [
    { title: "Video 1", youtubeId: "aqz-KE-bpKQ" },
    { title: "Video 2", youtubeId: "jNQXAC9IVRw" },
    { title: "Video 3", youtubeId: "aqz-KE-bpKQ" }
  ];

  /* ---------- 4. Gift options (A, B, C are real) ---------- */
  var giftOptions = [
    { id: "gift-cash", letter: "A", value: "A. Cash", title: "Cash",
      desc: "A simple cash gift you can use however you like." },
    { id: "gift-spa", letter: "B", value: "B. Bad Aibling Spa", title: "Bad Aibling Spa",
      desc: "A relaxing spa experience in Bad Aibling." },
    { id: "gift-flexible", letter: "C", value: "C. Flexible Voucher", title: "Flexible Voucher",
      desc: "A flexible gift option you can decide on later." }
  ];

  /* ---------- 4b. The fun prank option "D" ---------- */
  var prank = {
    letter: "D",
    amount: "50,000 EURO",
    hint: "Tap fast to claim!",
    reveal: "Sorry, you are too slow. You missed your chance. \uD83D\uDE22",
    resetMs: 2000 // after this many ms, it goes back to blinking to trick the next person
  };

  /* ---------- helpers ---------- */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getPageName() {
    var name = window.location.pathname.split("/").pop();
    return name ? name : "index.html";
  }

  var pageName = getPageName();
  var currentPage = pageContent[pageName] || pageContent["index.html"];

  function monogramHtml() {
    return (
      escapeHtml(site.monogram.left) +
      ' <span class="amp">&amp;</span> ' +
      escapeHtml(site.monogram.right)
    );
  }

  /* ---------- render: slim nav ---------- */
  function renderNav() {
    var nav = document.querySelector(".site-nav");
    if (!nav) {
      return;
    }

    var links = navItems
      .map(function (item) {
        var isActive = pageName === item.file;
        var cls = isActive ? "active" : "";
        var current = isActive ? ' aria-current="page"' : "";
        return (
          '<a href="' + item.file + '" class="' + cls + '"' + current + ">" +
          escapeHtml(item.label) + "</a>"
        );
      })
      .join("");

    nav.innerHTML =
      '<div class="nav-inner">' +
      '<a class="monogram" href="index.html" aria-label="Venus and Flo home">' +
      monogramHtml() + "</a>" +
      '<nav class="nav-links" aria-label="Main navigation">' + links + "</nav>" +
      "</div>";
  }

  /* ---------- render: hero ---------- */
  function renderHero() {
    var hero = document.querySelector(".site-hero");
    if (!hero) {
      return;
    }

    var dateHtml = currentPage.showDate
      ? '<p class="hero-date">' + escapeHtml(site.heroDate) + "</p>"
      : "";

    hero.innerHTML =
      '<div class="hero-inner">' +
      '<p class="eyebrow">' + escapeHtml(currentPage.eyebrow) + "</p>" +
      "<h1>" + escapeHtml(currentPage.title) + "</h1>" +
      '<p class="subtitle">' + escapeHtml(currentPage.subtitle) + "</p>" +
      dateHtml +
      '<div class="hero-rule" aria-hidden="true"><span>\u2661</span></div>' +
      "</div>";
  }

  /* ---------- render: footer ---------- */
  function renderFooter() {
    var footer = document.querySelector(".site-footer");
    if (!footer) {
      return;
    }

    footer.innerHTML =
      '<div class="footer-inner">' +
      '<div class="footer-monogram" aria-hidden="true">' + monogramHtml() + "</div>" +
      '<p class="footer-title">With love, LAKBAY DIWA-TA</p>' +
      '<p class="footer-text">Wishing you joy, love, and many beautiful days together.</p>' +
      '<nav class="footer-links" aria-label="Footer navigation">' +
      '<a href="index.html">Home</a>' +
      '<a href="videos.html">Videos</a>' +
      '<a href="voucher.html">Gift</a>' +
      "</nav>" +
      '<p class="footer-note">Made with care for Venus &amp; Flo</p>' +
      "</div>";
  }

  /* ---------- render: dividers ---------- */
  function renderDividers() {
    var nodes = document.querySelectorAll(".divider");
    Array.prototype.forEach.call(nodes, function (node) {
      if (!node.innerHTML.trim()) {
        node.innerHTML = "<span>\u2661</span>";
      }
    });
  }

  /* ---------- render: videos ---------- */
  function renderVideos() {
    var list = document.querySelector("#video-list");
    if (!list) {
      return;
    }

    list.innerHTML = videos
      .map(function (video) {
        var safeTitle = escapeHtml(video.title);
        var safeId = encodeURIComponent(video.youtubeId);
        var src = "https://www.youtube-nocookie.com/embed/" + safeId;
        var watchUrl = "https://www.youtube.com/watch?v=" + safeId;
        return (
          '<section class="card">' +
          "<h2>" + safeTitle + "</h2>" +
          '<div class="video-wrapper">' +
          '<iframe src="' + src + '" title="' + safeTitle + '" loading="lazy" ' +
          'referrerpolicy="strict-origin-when-cross-origin" ' +
          'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
          "allowfullscreen></iframe>" +
          "</div>" +
          '<p class="video-fallback">Cannot see the video? ' +
          '<a href="' + watchUrl + '" target="_blank" rel="noopener noreferrer">Watch it on YouTube</a>.</p>' +
          "</section>"
        );
      })
      .join("");
  }

  /* ---------- render: gift options + prank + validation ---------- */
  function renderVoucher() {
    var grid = document.querySelector("#voucher-options");
    if (!grid) {
      return;
    }

    var realCards = giftOptions
      .map(function (opt) {
        return (
          '<input class="voucher-radio" type="radio" id="' + opt.id +
          '" name="Gift Choice" value="' + escapeHtml(opt.value) + '" required />' +
          '<label class="voucher-card" for="' + opt.id + '">' +
          '<span class="choice-letter">' + escapeHtml(opt.letter) + "</span>" +
          "<h3>" + escapeHtml(opt.title) + "</h3>" +
          "<p>" + escapeHtml(opt.desc) + "</p>" +
          "</label>"
        );
      })
      .join("");

    // The prank card is a button, NOT a form field, so it never submits.
    var prankCard =
      '<div class="prank-card" id="prank-card" role="button" tabindex="0" ' +
      'aria-label="Bonus gift option D">' +
      '<div class="prank-live">' +
      '<span class="choice-letter" aria-hidden="true">' + escapeHtml(prank.letter) + "</span>" +
      '<span class="prank-amount">' + escapeHtml(prank.letter + ". " + prank.amount) + "</span>" +
      "</div>" +
      '<p class="prank-hint">' + escapeHtml(prank.hint) + "</p>" +
      '<p class="prank-reveal" aria-hidden="true">' +
      escapeHtml(prank.reveal) +
      "</p>" +
      "</div>";

    grid.innerHTML = realCards + prankCard;

    // Wire up the prank reveal, then bounce back to blinking after a delay
    // so it is ready to trick the next person. Edit prank.resetMs to tune it.
    var prankEl = document.querySelector("#prank-card");
    if (prankEl) {
      var resetTimer = null;

      var showBait = function () {
        if (resetTimer) {
          window.clearTimeout(resetTimer);
          resetTimer = null;
        }
        prankEl.classList.remove("revealed");
        var live = prankEl.querySelector(".prank-live");
        var hint = prankEl.querySelector(".prank-hint");
        var reveal = prankEl.querySelector(".prank-reveal");
        if (live) { live.style.display = ""; }
        if (hint) { hint.style.display = ""; }
        if (reveal) { reveal.setAttribute("aria-hidden", "true"); }
        prankEl.setAttribute("role", "button");
        prankEl.setAttribute("tabindex", "0");
      };

      var trigger = function () {
        if (prankEl.classList.contains("revealed")) {
          return;
        }
        prankEl.classList.add("revealed");

        // Count every time they fall for the D trick
        var prankCount = document.querySelector("#prank-count");
        if (prankCount) {
          prankCount.value = String((parseInt(prankCount.value, 10) || 0) + 1);
        }

        prankEl.setAttribute("aria-live", "polite");
        var live = prankEl.querySelector(".prank-live");
        var hint = prankEl.querySelector(".prank-hint");
        if (live) { live.style.display = "none"; }
        if (hint) { hint.style.display = "none"; }
        var reveal = prankEl.querySelector(".prank-reveal");
        if (reveal) { reveal.setAttribute("aria-hidden", "false"); }
        prankEl.removeAttribute("role");
        prankEl.removeAttribute("tabindex");

        // Bounce back to the blinking bait after the delay.
        resetTimer = window.setTimeout(showBait, prank.resetMs);
      };

      prankEl.addEventListener("click", trigger);
      prankEl.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
          e.preventDefault();
          trigger();
        }
      });
    }

    var giftForm = document.querySelector(".gift-form");
    var formError = document.querySelector("#form-error");
    if (!giftForm || !formError) {
      return;
    }

    giftForm.addEventListener("submit", function (event) {
      var selected = giftForm.querySelector('input[name="Gift Choice"]:checked');
      if (!selected) {
        event.preventDefault();
        formError.classList.add("show");
        formError.focus();
      }
    });

    var options = giftForm.querySelectorAll('input[name="Gift Choice"]');
    Array.prototype.forEach.call(options, function (option) {
      option.addEventListener("change", function () {
        formError.classList.remove("show");
      });
    });
  }

  /* ---------- boot ---------- */
  function init() {
    renderNav();
    renderHero();
    renderFooter();
    renderDividers();
    renderVideos();
    renderVoucher();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.WeddingSite = {
    site: site,
    pageContent: pageContent,
    navItems: navItems,
    videos: videos,
    giftOptions: giftOptions,
    prank: prank
  };
})();
