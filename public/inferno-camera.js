// ====== INFERNO CAMERA: COLOR SHIFT + SYNCED SPARKS ======

(function() {
  var hue = 0;
  var img = null;
  var canvas = null;
  var ctx = null;
  var particles = [];
  var animFrame = null;

  function currentSparkColor() {
    // Same hue rotation value drives both the camera filter AND the spark color
    return 'hsl(' + hue + ', 100%, 60%)';
  }

  function spawnParticle() {
    if (!canvas) return;
    var cx = canvas.width / 2;
    var cy = canvas.height / 2;
    var angle = Math.random() * Math.PI * 2;
    var radius = canvas.width * 0.22; // around the lens area
    particles.push({
      x: cx + Math.cos(angle) * radius * (0.7 + Math.random() * 0.3),
      y: cy + Math.sin(angle) * radius * (0.7 + Math.random() * 0.3),
      vx: (Math.random() - 0.5) * 1.6,
      vy: (Math.random() - 0.5) * 1.6 - 0.4,
      life: 1,
      size: 1 + Math.random() * 2.2
    });
  }

  function animate() {
    if (!ctx || !canvas) return;

    // 1. Shift camera hue (slow, continuous loop)
    hue = (hue + 0.35) % 360;
    if (img) img.style.filter = 'hue-rotate(' + hue + 'deg) saturate(1.3)';

    // 2. Spawn a few new sparks
    if (Math.random() < 0.85) spawnParticle();
    if (Math.random() < 0.85) spawnParticle();

    // 3. Clear & draw particles in the SAME color as the camera right now
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var color = currentSparkColor();

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy -= 0.015; // drift upward like fire sparks
      p.life -= 0.018;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = color;
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    animFrame = requestAnimationFrame(animate);
  }

  function resizeCanvas() {
    if (!canvas) return;
    var rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  function init() {
    img = document.getElementById('infernoCameraImg');
    canvas = document.getElementById('sparkCanvas');
    if (!img || !canvas) return;
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    if (animFrame) cancelAnimationFrame(animFrame);
    animate();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 300);
  } else {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(init, 300); });
  }
  window.addEventListener('load', function() { setTimeout(init, 300); });
})();
