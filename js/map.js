/* ════════════════════════════════════════
   AZENERGY — MAP MODULE
════════════════════════════════════════ */

(function () {
  'use strict';

  let activeFilter = 'all';
  let activeStation = null;

  function init() {
    renderStationList(AZ.stations);
    renderMapPins(AZ.stations);
    setupSearch();
    setupFilters();
  }

  /* ─── Station List ─── */
  function renderStationList(stations) {
    const list = document.getElementById('stationList');
    if (!list) return;
    list.innerHTML = '';

    if (stations.length === 0) {
      list.innerHTML = '<p style="color:var(--col-text-mute);font-size:14px;padding:16px 0;">АЗС не найдены</p>';
      return;
    }

    stations.forEach(st => {
      const el = document.createElement('div');
      el.className = 'station-card custom-scroll' + (activeStation === st.id ? ' active' : '');
      el.dataset.id = st.id;
      el.innerHTML = `
        <div class="sc-header">
          <span class="sc-name">${st.name}</span>
          <span class="sc-badge">${st.status}</span>
        </div>
        <div class="sc-addr">📍 ${st.address}</div>
        <div class="sc-addr">🕐 ${st.hours}</div>
        <div class="sc-tags">
          ${st.fuels.slice(0, 3).map(f => `<span class="sc-tag">${f}</span>`).join('')}
          ${st.services.slice(0, 2).map(s => `<span class="sc-tag">${s}</span>`).join('')}
        </div>
      `;
      el.addEventListener('click', () => selectStation(st));
      list.appendChild(el);
    });
  }

  /* ─── Map Pins ─── */
  function renderMapPins(stations) {
    const container = document.getElementById('mapPins');
    if (!container) return;
    container.innerHTML = '';

    stations.forEach(st => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'map-pin');
      g.setAttribute('transform', `translate(${st.mapX}, ${st.mapY})`);
      g.dataset.id = st.id;

      // Ping ring
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ring.setAttribute('cx', '0');
      ring.setAttribute('cy', '0');
      ring.setAttribute('r', '14');
      ring.setAttribute('fill', 'rgba(46,125,232,0.12)');
      ring.setAttribute('class', 'map-ping');

      // Pin circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', '0');
      circle.setAttribute('cy', '0');
      circle.setAttribute('r', '7');
      circle.setAttribute('fill', activeStation === st.id ? '#e74c3c' : '#2e7de8');
      circle.setAttribute('stroke', 'rgba(255,255,255,0.4)');
      circle.setAttribute('stroke-width', '1.5');

      // EV dot
      if (st.tags.includes('ev')) {
        const evDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        evDot.setAttribute('cx', '6');
        evDot.setAttribute('cy', '-6');
        evDot.setAttribute('r', '3');
        evDot.setAttribute('fill', '#3dc98e');
        g.appendChild(evDot);
      }

      g.appendChild(ring);
      g.appendChild(circle);

      g.addEventListener('click', () => selectStation(st));
      container.appendChild(g);
    });
  }

  /* ─── Select Station ─── */
  function selectStation(st) {
    activeStation = st.id;
    renderMapPins(filterStations(activeFilter));
    renderStationList(filterStations(activeFilter));
    showMapOverlay(st);

    // Scroll station card into view
    const card = document.querySelector(`.station-card[data-id="${st.id}"]`);
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function showMapOverlay(st) {
    const overlay = document.getElementById('mapOverlayInfo');
    if (!overlay) return;
    overlay.style.display = 'block';
    overlay.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
        <div>
          <div style="font-size:15px;font-weight:700;margin-bottom:2px;">${st.name}</div>
          <div style="font-size:12px;color:var(--col-text-dim);">${st.city}</div>
        </div>
        <button onclick="document.getElementById('mapOverlayInfo').style.display='none'"
          style="color:var(--col-text-mute);font-size:16px;cursor:pointer;background:none;border:none;">✕</button>
      </div>
      <div style="font-size:13px;color:var(--col-text-dim);margin-bottom:8px;">📍 ${st.address}</div>
      <div style="font-size:13px;color:var(--col-text-dim);margin-bottom:12px;">🕐 ${st.hours}</div>
      <div style="margin-bottom:10px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--col-text-mute);text-transform:uppercase;margin-bottom:6px;">Топливо</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${st.fuels.map(f => `<span style="font-size:11px;padding:3px 8px;background:rgba(46,125,232,0.12);border:1px solid rgba(46,125,232,0.2);border-radius:6px;color:#5ca3f5;">${f}</span>`).join('')}
        </div>
      </div>
      <div>
        <div style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--col-text-mute);text-transform:uppercase;margin-bottom:6px;">Услуги</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${st.services.map(s => `<span style="font-size:11px;padding:3px 8px;background:rgba(61,201,142,0.1);border:1px solid rgba(61,201,142,0.2);border-radius:6px;color:#3dc98e;">${s}</span>`).join('')}
        </div>
      </div>
    `;
  }

  /* ─── Search ─── */
  function setupSearch() {
    const input = document.getElementById('stationSearch');
    if (!input) return;
    input.addEventListener('input', debounce(function () {
      const query = this.value.toLowerCase().trim();
      const filtered = filterStations(activeFilter).filter(st =>
        st.name.toLowerCase().includes(query) ||
        st.city.toLowerCase().includes(query) ||
        st.address.toLowerCase().includes(query)
      );
      renderStationList(filtered);
      renderMapPins(filtered);
    }, 200));
  }

  /* ─── Filters ─── */
  function setupFilters() {
    document.querySelectorAll('[data-filter]').forEach(chip => {
      chip.addEventListener('click', function () {
        document.querySelectorAll('[data-filter]').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        activeFilter = this.dataset.filter;
        const filtered = filterStations(activeFilter);
        renderStationList(filtered);
        renderMapPins(filtered);
      });
    });
  }

  function filterStations(filter) {
    if (filter === 'all') return AZ.stations;
    return AZ.stations.filter(st => st.tags.includes(filter));
  }

  /* ─── Util ─── */
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  document.addEventListener('DOMContentLoaded', init);
})();
