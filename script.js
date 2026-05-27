// ===================================================================
// script.js — Collaboration Graph (D3 v7 force-directed)
// ===================================================================

(function () {
  const DATA_URL = './data/publications.json';

  // ── Node colors ────────────────────────────────────────────────
  const NODE_COLORS = {
    author: '#39ff14',   // neon green  — me
    paper: '#4fc3f7',   // cyan-blue   — papers
    coauthor: '#7aff4a',   // soft green  — collaborators
  };

  const NODE_RADIUS = {
    author: 20,
    paper: 13,
    coauthor: 9,
  };

  // ── Tooltip ────────────────────────────────────────────────────
  const tooltip = document.createElement('div');
  tooltip.className = 'd3-tooltip';
  document.body.appendChild(tooltip);

  function showTooltip(event, text) {
    tooltip.textContent = text;
    tooltip.style.opacity = '1';
    moveTooltip(event);
  }
  function moveTooltip(event) {
    tooltip.style.left = (event.pageX + 14) + 'px';
    tooltip.style.top = (event.pageY - 28) + 'px';
  }
  function hideTooltip() {
    tooltip.style.opacity = '0';
  }

  // ── Paper panel ────────────────────────────────────────────────
  const panel = document.getElementById('paper-panel');

  function showPaper(pub) {
    if (!pub) return;
    panel.innerHTML = `
      <p class="panel-empty" style="display:none"></p>
      <div class="paper-title">${pub.title}</div>
      <div class="paper-venue">${pub.venue} · ${pub.year}</div>
      <div class="paper-authors">${pub.coauthors.join(', ')}</div>
      ${pub.doi ? `<a class="paper-link" href="${pub.doi}" target="_blank" rel="noopener noreferrer">↗ View paper / DOI</a>` : ''}
    `;
  }

  function resetPanel() {
    panel.innerHTML = '<p class="panel-empty">// click a paper node to view metadata</p>';
  }

  // ── Main ───────────────────────────────────────────────────────
  fetch(DATA_URL)
    .then(r => r.json())
    .then(data => {
      const { nodes, edges } = data.graph;
      const pubs = data.publications;

      const container = document.getElementById('collab-graph');
      const W = container.clientWidth || 600;
      const H = container.clientHeight || 520;

      // Deep-copy so d3 can mutate
      const simNodes = nodes.map(n => ({ ...n }));
      const simEdges = edges.map(e => ({ ...e }));

      const svg = d3.select('#collab-graph')
        .append('svg')
        .attr('width', W)
        .attr('height', H);

      // Subtle glow filter
      const defs = svg.append('defs');
      const filter = defs.append('filter').attr('id', 'glow');
      filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'blur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

      // Zoom
      const g = svg.append('g');
      svg.call(
        d3.zoom()
          .scaleExtent([0.3, 3])
          .on('zoom', e => g.attr('transform', e.transform))
      );

      // Simulation
      const simulation = d3.forceSimulation(simNodes)
        .force('link', d3.forceLink(simEdges).id(d => d.id).distance(d => {
          const s = d.source, t = d.target;
          const st = (typeof s === 'object' ? s.type : '') + (typeof t === 'object' ? t.type : '');
          return st.includes('author') ? 90 : 70;
        }).strength(0.6))
        .force('charge', d3.forceManyBody().strength(-220))
        .force('center', d3.forceCenter(W / 2, H / 2))
        .force('collision', d3.forceCollide(d => NODE_RADIUS[d.type] + 8));

      // Links
      const link = g.append('g')
        .selectAll('line')
        .data(simEdges)
        .join('line')
        .attr('stroke', 'rgba(57,255,20,0.18)')
        .attr('stroke-width', 1.2);

      // Nodes
      const node = g.append('g')
        .selectAll('circle')
        .data(simNodes)
        .join('circle')
        .attr('r', d => NODE_RADIUS[d.type])
        .attr('fill', d => NODE_COLORS[d.type])
        .attr('fill-opacity', d => d.type === 'author' ? 0.95 : d.type === 'paper' ? 0.8 : 0.65)
        .attr('stroke', d => d.type === 'author' ? '#fff' : 'rgba(57,255,20,0.4)')
        .attr('stroke-width', d => d.type === 'author' ? 2.5 : 1)
        .attr('filter', d => d.type === 'author' ? 'url(#glow)' : null)
        .style('cursor', 'pointer')
        .call(
          d3.drag()
            .on('start', (event, d) => {
              if (!event.active) simulation.alphaTarget(0.3).restart();
              d.fx = d.x; d.fy = d.y;
            })
            .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
            .on('end', (event, d) => {
              if (!event.active) simulation.alphaTarget(0);
              d.fx = null; d.fy = null;
            })
        )
        .on('mouseover', (event, d) => showTooltip(event, d.label))
        .on('mousemove', moveTooltip)
        .on('mouseout', hideTooltip)
        .on('click', (event, d) => {
          event.stopPropagation();
          if (d.type === 'paper') {
            const pub = pubs.find(p => p.id === d.id);
            showPaper(pub);
          }
        });

      // Labels for author node only
      g.append('g')
        .selectAll('text')
        .data(simNodes.filter(n => n.type === 'author'))
        .join('text')
        .attr('fill', '#39ff14')
        .attr('font-family', "'Roboto Mono', monospace")
        .attr('font-size', '10px')
        .attr('text-anchor', 'middle')
        .attr('dy', d => NODE_RADIUS[d.type] + 14)
        .text(d => d.label);

      // Tick
      simulation.on('tick', () => {
        link
          .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
        node
          .attr('cx', d => d.x)
          .attr('cy', d => d.y);
        // update labels
        g.selectAll('text')
          .attr('x', d => d.x)
          .attr('y', d => d.y);
      });

      // Click on canvas resets panel
      svg.on('click', resetPanel);
      resetPanel();
    })
    .catch(err => {
      console.error('Could not load publications.json:', err);
      document.getElementById('collab-graph').innerHTML =
        '<p style="color:#7aab7a;padding:1rem;font-size:0.75rem">// graph data unavailable</p>';
    });
})();

// ===================================================================
// whte_rbt
// ===================================================================

(function () {
  const headshot = document.querySelector('.hero-headshot');
  if (!headshot) return;

  let clickCount = 0;
  let stage = 0; // 0: nada, 1: primer popup, 2: segundo, 3: lock final

  const FINAL_GIF_URL = './assets/whte_rbt.gif';
  const LAUGH_SOUND_URL = './assets/evil_laugh.mp3';
  let laughAudio = null;

  function createOverlay(options) {
    const {
      message,
      subtext,
      glitch = false,
      escapable = true,
      withGif = false,
      withLaugh = false,
    } = options || {};

    const overlay = document.createElement('div');
    overlay.className = 'easter-egg-overlay';

    const modal = document.createElement('div');
    modal.className = 'easter-egg-modal';
    if (glitch) {
      modal.classList.add('easter-egg-modal--glitch');
    }

    const title = document.createElement('div');
    title.className = 'easter-egg-title';
    title.innerHTML = message || '';
    modal.appendChild(title);

    if (withGif) {
      const img = document.createElement('img');
      img.className = 'easter-egg-gif';
      img.src = FINAL_GIF_URL;
      img.alt = 'Glitched warning animation';
      modal.appendChild(img);
    }

    if (subtext) {
      const sub = document.createElement('div');
      sub.className = 'easter-egg-subtext';
      sub.textContent = subtext;
      modal.appendChild(sub);
    }

    if (escapable) {
      overlay.addEventListener('click', function (event) {
        if (event.target === overlay) {
          overlay.remove();
        }
      });

      modal.addEventListener('click', function (event) {
        event.stopPropagation();
      });
    }

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    if (withLaugh) {
      try {
        if (!laughAudio) {
          laughAudio = new Audio(LAUGH_SOUND_URL);
          laughAudio.preload = 'auto';
        }
        laughAudio.currentTime = 0;
        laughAudio.play().catch(function () {
        });
      } catch (e) {
        console.warn('Could not play laugh audio', e);
      }
    }
  }

  headshot.addEventListener('click', function () {
    clickCount += 1;

    if (clickCount >= 5 && stage === 0) {
      stage = 1;
      clickCount = 0;
      createOverlay({
        message: 'Mind the pointer please!',
        escapable: true,
      });
      return;
    }

    if (clickCount >= 5 && stage === 1) {
      stage = 2;
      clickCount = 0;
      createOverlay({
        message: 'Last warning mate...<br>St0p d0!ng th4t!',
        glitch: true,
        escapable: true,
      });
      return;
    }

    if (clickCount >= 5 && stage === 2) {
      stage = 3;
      clickCount = 0;
      createOverlay({
        message: 'A█ █H █H█<br>Y0U D!DN█T S4Y TH3 M4G1C W█RD',
        subtext: 'whte_rbt.obj :: ACCESS DENIED',
        glitch: true,
        escapable: false,
        withGif: true,
        withLaugh: true,
      });
    }
  });
})();
