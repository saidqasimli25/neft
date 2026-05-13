/* ════════════════════════════════════════
   AZENERGY — CHARTS MODULE
════════════════════════════════════════ */

(function () {
  'use strict';

  function init() {
    renderRevenueChart();
    renderStockChart();
  }

  /* ─── Revenue Bar Chart ─── */
  function renderRevenueChart() {
    const container = document.getElementById('revenueChart');
    if (!container || !AZ.revenue) return;

    const maxVal = Math.max(...AZ.revenue.map(d => d.val));

    AZ.revenue.forEach(d => {
      const heightPct = (d.val / maxVal) * 100;
      const wrap = document.createElement('div');
      wrap.className = 'bc-bar-wrap';

      const bar = document.createElement('div');
      bar.className = 'bc-bar';
      bar.dataset.val = `$${d.val}B`;
      bar.style.height = '0';
      bar.style.width = '100%';

      const label = document.createElement('div');
      label.className = 'bc-label';
      label.textContent = d.year;

      wrap.appendChild(bar);
      wrap.appendChild(label);
      container.appendChild(wrap);

      // Animate when visible
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              bar.style.height = `${heightPct}%`;
            }, 200 + AZ.revenue.indexOf(d) * 80);
            observer.disconnect();
          }
        });
      }, { threshold: 0.5 });

      observer.observe(container);
    });
  }

  /* ─── Stock Sparkline ─── */
  function renderStockChart() {
    const canvas = document.getElementById('stockChart');
    if (!canvas || !AZ.stockData) return;

    const ctx = canvas.getContext('2d');
    const data = AZ.stockData;
    const W = canvas.width;
    const H = canvas.height;

    const min = Math.min(...data) - 1;
    const max = Math.max(...data) + 1;

    const xStep = W / (data.length - 1);

    function getY(v) {
      return H - ((v - min) / (max - min)) * H;
    }

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, 'rgba(46,125,232,0.3)');
    gradient.addColorStop(1, 'rgba(46,125,232,0)');

    ctx.beginPath();
    ctx.moveTo(0, getY(data[0]));
    data.forEach((v, i) => {
      if (i === 0) return;
      const x = i * xStep;
      const prevX = (i - 1) * xStep;
      const cp1x = prevX + xStep / 2;
      const cp1y = getY(data[i - 1]);
      const cp2x = x - xStep / 2;
      const cp2y = getY(v);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, getY(v));
    });

    // Close path for fill
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    ctx.moveTo(0, getY(data[0]));
    data.forEach((v, i) => {
      if (i === 0) return;
      const x = i * xStep;
      const prevX = (i - 1) * xStep;
      const cp1x = prevX + xStep / 2;
      const cp1y = getY(data[i - 1]);
      const cp2x = x - xStep / 2;
      const cp2y = getY(v);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, getY(v));
    });

    ctx.strokeStyle = '#2e7de8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw last point dot
    const lastX = (data.length - 1) * xStep;
    const lastY = getY(data[data.length - 1]);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#2e7de8';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
