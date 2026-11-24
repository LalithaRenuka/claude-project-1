(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} }
  };

  /* ---------- theme ---------- */
  const root = document.documentElement, tbtn = $('#themeToggle');
  const applyTheme = t => { root.dataset.theme = t; tbtn.textContent = t === 'dark' ? '🌙' : '☀️'; };
  applyTheme(store.get('theme') || 'dark');
  tbtn.onclick = () => { const t = root.dataset.theme === 'dark' ? 'light' : 'dark'; applyTheme(t); store.set('theme', t); };

  /* ---------- nav ---------- */
  const nav = $('#nav'), links = $('#navLinks'), burger = $('#burger');
  burger.onclick = () => { const o = links.classList.toggle('open'); burger.setAttribute('aria-expanded', o); };
  $$('a', links).forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  const sections = $$('section[id]'), navA = $$('a', links), progress = $('#progress'), toTop = $('#toTop');
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (y / h * 100) + '%';
    nav.classList.toggle('scrolled', y > 30);
    toTop.classList.toggle('show', y > 500);
    let cur = sections[0].id;
    sections.forEach(s => { if (y + 120 >= s.offsetTop) cur = s.id; });
    navA.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  toTop.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });

  /* ---------- cursor glow ---------- */
  const glow = $('#cursorGlow');
  addEventListener('mousemove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });

  /* ---------- typing ---------- */
  const roles = ['B.Tech CSE Student', 'Frontend Developer', 'AI & Cyber Security Enthusiast', 'Database Enthusiast'];
  const typed = $('#typed');
  if (reduce) typed.textContent = roles[0];
  else {
    let r = 0, i = 0, del = false;
    (function tick() {
      const w = roles[r];
      typed.textContent = w.slice(0, i);
      if (!del && i === w.length) { del = true; return setTimeout(tick, 1400); }
      if (del && i === 0) { del = false; r = (r + 1) % roles.length; }
      i += del ? -1 : 1;
      setTimeout(tick, del ? 35 : 80);
    })();
  }

  /* ---------- reveal, counters, rings ---------- */
  $$('.reveal').forEach((el, i) => el.style.setProperty('--d', (i % 4) * 0.1 + 's'));
  const countUp = el => {
    const end = +el.dataset.count, dec = +el.dataset.dec || 0, t0 = performance.now();
    const step = t => {
      const p = Math.min((t - t0) / 1500, 1);
      el.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    $$('[data-count]', e.target).forEach(countUp);
    io.unobserve(e.target);
  }), { threshold: .15 });
  $$('.reveal').forEach(el => io.observe(el));

  const fillRings = () => $$('.lang .fg').forEach(c => { c.style.strokeDashoffset = 264 * (1 - c.dataset.pct / 100); });
  const clearRings = () => $$('.lang .fg').forEach(c => { c.style.strokeDashoffset = 264; });

  /* ---------- skill tabs ---------- */
  $$('.tab').forEach(t => t.addEventListener('click', () => {
    $$('.tab').forEach(x => x.classList.toggle('active', x === t));
    $$('.panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + t.dataset.tab));
    if (t.dataset.tab === 'lang') { clearRings(); setTimeout(fillRings, 60); }
  }));

  /* ---------- project filter ---------- */
  $$('.filter').forEach(b => b.addEventListener('click', () => {
    $$('.filter').forEach(x => x.classList.toggle('active', x === b));
    $$('.proj').forEach(p => p.classList.toggle('hide', b.dataset.f !== 'all' && p.dataset.cat !== b.dataset.f));
  }));

  /* ---------- 3D tilt ---------- */
  if (!reduce) $$('.tilt').forEach(c => {
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
    });
    c.addEventListener('mouseleave', () => { c.style.transform = ''; });
  });

  /* ---------- project modal ---------- */
  const details = {
    resumeweb: {
      t: 'Resume Webpage', meta: ['11-2026', 'Individual Project'],
      s: 'Interactive Portfolio Website',
      tech: ['HTML', 'CSS', 'JavaScript', 'Canvas API', 'IntersectionObserver'],
      l: [
        'Designed and built a responsive, blue-themed single-page portfolio from scratch using only HTML, CSS and JavaScript, with no frameworks or libraries.',
        'Added visual effects and animations: an interactive particle-network hero background, typing effect, scroll-reveal, animated counters, 3D-tilt project cards and a dark/light theme toggle.',
        'Built interactive sections: tabbed skills, filterable project cards with detail popups, copy-to-clipboard credential IDs, and Gmail-linked contact cards.',
        'Made the layout mobile-friendly and accessible, with keyboard support and reduced-motion support.'
      ],
      link: ['https://github.com/LalithaRenuka/resumewebpage', 'View on GitHub ↗']
    },
    iot: {
      t: 'Smart Home IoT', meta: ['04-2026', 'Team Lead'],
      s: 'Intelligent Living Ecosystem',
      award: '🏆 Ranked Top 4 in the university among 350 projects',
      tech: ['ESP8266 NodeMCU', 'Python / MicroPython', 'DHT11', 'PIR', 'LDR', 'MQ-135', 'Relay Modules', 'Buzzer', 'Wi-Fi'],
      l: [
        'Developed a low-cost IoT-based smart home automation system using ESP8266 NodeMCU, integrating multiple sensors for real-time environmental monitoring, motion detection, and home security.',
        'Implemented Python/MicroPython-based automation using DHT11, PIR, LDR, and MQ-135 sensors to monitor temperature, humidity, ambient light, motion, and air quality, enabling intelligent responses to changing conditions.',
        'Integrated relay modules and buzzer alerts for automated appliance control and security notifications, leveraging Wi-Fi connectivity for remote monitoring and scalable smart home applications.'
      ],
      link: ['https://docs.google.com/presentation/d/1ES17lfMBqedLB_pAktjHk_jLwdMvbzCW/edit?usp=sharing&ouid=114251706006200604941&rtpof=true&sd=true', 'Open Project Report (PPT) ↗']
    },
    salary: {
      t: 'Employee Salary Prediction System', meta: ['06-2025', 'Developer'],
      s: 'Machine Learning · Streamlit Web App',
      tech: ['Python', 'Pandas', 'NumPy', 'Supervised Learning', 'Feature Engineering', 'Streamlit'],
      l: [
        'Developed an end-to-end machine learning solution to predict income categories using structured datasets, processing 10,000+ records and improving data quality by ~35% through preprocessing with Pandas and NumPy.',
        'Achieved ~90% accuracy using supervised learning and feature engineering.',
        'Deployed a Streamlit web app for real-time predictions with <2s response time, implementing a complete ML pipeline.'
      ],
      link: ['https://github.com/LalithaRenuka/employeesalaryprediction', 'View on GitHub ↗']
    },
    ridewise: {
      t: 'RideWise', meta: ['03-2025', 'Frontend Developer'],
      s: 'Ride and Flight Ticket Cost Prediction Website',
      tech: ['HTML', 'CSS', 'Google Flights API', 'Currency Converter API'],
      l: [
        'Designed and developed a responsive user interface using HTML and CSS for comparing ride and flight ticket costs with an intuitive and user-friendly layout.',
        'Integrated Google Flights and Currency Converter APIs to enable real-time fare comparison and multi-currency support (10+ currencies) for global usability.',
        'Optimized the application for fast load times (<1.5 seconds) and enhanced user experience across devices, including features for ride history tracking and detailed travel logs.'
      ],
      link: ['https://github.com/LalithaRenuka/wadcasestudy', 'View on GitHub ↗']
    },
    species: {
      t: 'Protection of Endangered Species', meta: ['10-2024', 'Team Lead'],
      s: 'DBMS Case Study',
      tech: ['E-R Modeling', '3NF Normalization', 'SQL', 'PL/SQL', 'Triggers', 'Views'],
      l: [
        'Led a team project to design and implement a relational database system for managing endangered species data and conservation efforts.',
        'Developed an ER model with 8+ entities and normalized the database to Third Normal Form (3NF), reducing data redundancy by ~40%.',
        'Created 20+ SQL queries along with PL/SQL procedures, triggers, and views to ensure efficient data management and accurate representation of real-world relationships.'
      ],
      link: ['https://drive.google.com/file/d/1k5TO-7kwY5WybiZwv4rFwxL0AZxmcQA7/view?usp=sharing', 'Open Report ↗']
    },
    expense: {
      t: 'Expense Tracker', meta: ['04-2024', 'Individual Project'],
      s: 'GUI with Python Tkinter',
      tech: ['Python', 'Tkinter'],
      l: [
        'Created a standalone GUI-based application to manage daily personal expenses.',
        'Users can add, edit, delete, and view transactions.',
        'Provides an instant summary of total spending.',
        'Built entirely using Python\u2019s Tkinter module.'
      ],
      link: ['https://github.com/LalithaRenuka/expensetrackerpython', 'View on GitHub ↗']
    }
  };
  const modal = $('#modal'), body = $('#modalBody');
  const openModal = id => {
    const d = details[id]; if (!d) return;
    body.innerHTML = `<h3>${d.t}</h3><h4>${d.s}</h4>
      <div class="m-meta"><span class="date">${d.meta[0]}</span><span class="role">${d.meta[1]}</span></div>
      ${d.award ? `<div class="award m-award">${d.award}</div>` : ''}
      <h5>Highlights</h5><ul>${d.l.map(i => `<li>${i}</li>`).join('')}</ul>
      <h5>Tech &amp; Concepts</h5><div class="chips sm">${d.tech.map(t => `<span>${t}</span>`).join('')}</div>
      <a class="btn small m-link" href="${d.link[0]}" target="_blank" rel="noopener">${d.link[1]}</a>`;
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
  };
  const closeModal = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); };
  $$('.proj').forEach(c => {
    c.addEventListener('click', e => { if (!e.target.closest('a')) openModal(c.dataset.id); });
    c.addEventListener('keydown', e => { if (e.key === 'Enter') openModal(c.dataset.id); });
  });
  $('#modalClose').onclick = closeModal;
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* ---------- toast + copy credential ---------- */
  const toast = $('#toast');
  const say = m => { toast.textContent = m; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2000); };
  $$('.cred').forEach(b => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.id); say('Credential ID copied ✔'); }
    catch { say('ID: ' + b.dataset.id); }
  }));

  /* ---------- ripple ---------- */
  $$('.btn').forEach(b => b.addEventListener('click', e => {
    const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height), sp = document.createElement('span');
    sp.className = 'ripple';
    sp.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
    b.appendChild(sp); setTimeout(() => sp.remove(), 600);
  }));

  $('#year').textContent = new Date().getFullYear();

  /* ---------- hero network canvas ---------- */
  const cv = $('#network'), ctx = cv.getContext('2d');
  let W, H, pts = [], mouse = { x: -999, y: -999 };
  const size = () => {
    W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight;
    pts = Array.from({ length: Math.min(90, Math.floor(W * H / 14000)) }, () => ({
      x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5
    }));
  };
  size(); addEventListener('resize', size);
  cv.parentElement.addEventListener('mousemove', e => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  cv.parentElement.addEventListener('mouseleave', () => { mouse.x = mouse.y = -999; });
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    const light = root.dataset.theme === 'light', col = light ? '37,99,235' : '96,165,250';
    pts.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
      if (d < 120) { p.x += dx / d * 1.5; p.y += dy / d * 1.5; }
      ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, 7); ctx.fillStyle = `rgba(${col},.8)`; ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], dd = Math.hypot(p.x - q.x, p.y - q.y);
        if (dd < 120) { ctx.strokeStyle = `rgba(${col},${.35 * (1 - dd / 120)})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      }
      if (d < 160) { ctx.strokeStyle = `rgba(34,211,238,${.5 * (1 - d / 160)})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
    });
    requestAnimationFrame(draw);
  };
  if (!reduce) draw();

  /* language rings animate when the Languages tab is opened (see tab handler) */
})();
