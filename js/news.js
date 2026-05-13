/* ════════════════════════════════════════
   AZENERGY — NEWS MODULE
════════════════════════════════════════ */

(function () {
  'use strict';

  let activeCategory = 'all';

  function init() {
    renderNews(AZ.news);
    setupFilters();
  }

  /* ─── Render news grid ─── */
  function renderNews(articles) {
    const grid = document.getElementById('newsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    articles.forEach((article, idx) => {
      const card = document.createElement('div');
      const isFeatured = article.featured && idx === 0;
      card.className = 'news-card' + (isFeatured ? ' featured' : '');
      card.style.animationDelay = `${idx * 0.08}s`;

      const catColors = {
        company: 'cat-company',
        project: 'cat-project',
        esg: 'cat-esg',
        market: 'cat-market',
      };

      card.innerHTML = `
        <div class="news-img">
          <div class="news-img-inner">${article.emoji}</div>
          <span class="news-cat-badge ${catColors[article.category] || ''}">${article.catLabel}</span>
        </div>
        <div class="news-body">
          <div class="news-date">${article.date}</div>
          <h3 class="news-title">${article.title}</h3>
          <p class="news-excerpt">${article.excerpt}</p>
        </div>
      `;

      card.addEventListener('click', () => openNewsModal(article));
      grid.appendChild(card);
    });
  }

  /* ─── Filters ─── */
  function setupFilters() {
    document.querySelectorAll('[data-cat]').forEach(chip => {
      chip.addEventListener('click', function () {
        document.querySelectorAll('[data-cat]').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        activeCategory = this.dataset.cat;

        const filtered = activeCategory === 'all'
          ? AZ.news
          : AZ.news.filter(a => a.category === activeCategory);

        renderNews(filtered);
      });
    });
  }

  /* ─── Modal ─── */
  function openNewsModal(article) {
    // Create modal if not exists
    let modal = document.getElementById('newsModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'newsModal';
      modal.style.cssText = `
        position:fixed;inset:0;z-index:3000;
        display:flex;align-items:center;justify-content:center;
        background:rgba(3,8,16,0.92);backdrop-filter:blur(20px);
        padding:24px;
        animation:pageFadeIn 0.3s ease;
      `;
      modal.addEventListener('click', e => {
        if (e.target === modal) closeModal(modal);
      });
      document.body.appendChild(modal);
    }

    const catColors = {
      company: '#1a5fbd', project: '#f0a500', esg: '#1a8f5c', market: '#c0392b'
    };

    modal.innerHTML = `
      <div style="
        background:var(--col-surface);
        border:1px solid var(--col-border);
        border-radius:20px;
        max-width:680px;
        width:100%;
        max-height:80vh;
        overflow-y:auto;
        position:relative;
      ">
        <div style="
          background:var(--col-bg3);
          height:200px;
          display:flex;align-items:center;justify-content:center;
          font-size:80px;border-radius:20px 20px 0 0;
        ">${article.emoji}</div>
        <div style="padding:36px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
            <span style="
              font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;
              background:${catColors[article.category] || '#1a5fbd'}22;
              color:${catColors[article.category] || '#2e7de8'};
              padding:4px 12px;border-radius:20px;
            ">${article.catLabel}</span>
            <span style="font-size:13px;color:var(--col-text-mute);">${article.date}</span>
          </div>
          <h2 style="font-size:26px;font-weight:700;line-height:1.3;margin-bottom:20px;">${article.title}</h2>
          <p style="font-size:16px;color:var(--col-text-dim);line-height:1.75;margin-bottom:28px;">${article.excerpt}</p>
          <p style="font-size:15px;color:var(--col-text-dim);line-height:1.75;">
            Компания продолжает реализацию стратегии устойчивого развития и укрепления позиций
            на международных рынках. Данное событие является важным шагом в долгосрочном развитии
            и подтверждает курс на инновации и ответственный бизнес.
          </p>
        </div>
        <button onclick="document.getElementById('newsModal').remove()" style="
          position:absolute;top:16px;right:16px;
          width:36px;height:36px;border-radius:8px;
          background:rgba(255,255,255,0.08);
          color:white;font-size:16px;cursor:pointer;border:none;
          display:flex;align-items:center;justify-content:center;
          transition:background 0.2s ease;
        ">✕</button>
      </div>
    `;

    modal.style.display = 'flex';
  }

  function closeModal(modal) {
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.25s ease';
    setTimeout(() => modal.remove(), 250);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
