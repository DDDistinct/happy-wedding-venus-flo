/* =========================================================
   Gentle wedding confetti. Vanilla JS, canvas based.
   - One soft burst on load, then it settles and clears.
   - Respects prefers-reduced-motion (does nothing).
   ========================================================= */

(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var canvas = document.getElementById("confetti-canvas");
  if (!canvas || reduceMotion) {
    return;
  }

  var ctx = canvas.getContext("2d");
  var pieces = [];
  var running = false;

  var colors = ["#9b4d3b", "#c78b6d", "#b8894f", "#f3d8c6", "#e6a488", "#ffffff"];

  function resize() {
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function makePiece(originX, originY, spread) {
    var angle = rand(0, Math.PI * 2);
    var speed = rand(3, 8) * spread;
    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - rand(2, 5),
      size: rand(5, 10),
      color: colors[Math.floor(rand(0, colors.length))],
      rot: rand(0, Math.PI * 2),
      vrot: rand(-0.18, 0.18),
      shape: Math.random() < 0.5 ? "rect" : "circle",
      gravity: rand(0.12, 0.2),
      drag: 0.985,
      life: rand(80, 150),
      age: 0
    };
  }

  function burst(count) {
    var w = window.innerWidth;
    var originY = Math.min(window.innerHeight * 0.26, 200);
    for (var i = 0; i < count; i++) {
      var fromLeft = i % 2 === 0;
      var ox = fromLeft ? w * 0.3 : w * 0.7;
      pieces.push(makePiece(ox, originY, rand(0.7, 1.25)));
    }
    if (!running) {
      running = true;
      window.requestAnimationFrame(tick);
    }
  }

  function tick() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (var i = pieces.length - 1; i >= 0; i--) {
      var p = pieces[i];
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;
      p.age++;

      var fade = Math.max(0, 1 - p.age / p.life);
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      if (p.age >= p.life || p.y - p.size > window.innerHeight) {
        pieces.splice(i, 1);
      }
    }

    if (pieces.length > 0) {
      window.requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      running = false;
    }
  }

  function celebrate() {
    burst(70);
    window.setTimeout(function () {
      burst(45);
    }, 240);
  }

  resize();
  window.addEventListener("resize", resize);
  window.setTimeout(celebrate, 300);

  window.WeddingConfetti = { celebrate: celebrate, burst: burst };
})();
