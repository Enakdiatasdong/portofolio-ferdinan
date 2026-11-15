(() => {
  'use strict';

  const stages = {
    loading: {
      title: 'Loading',
      description: 'Menyiapkan pengiriman outbound melalui penjadwalan loading, alokasi manpower, dan pengecekan kesiapan sebelum dispatch.',
      activities: [
        'Menyusun jadwal loading dan alokasi manpower.',
        'Mengoordinasikan kesiapan pengiriman dengan tim warehouse dan vendor transportasi.',
        'Memverifikasi Delivery Order (DO) sebelum dispatch.'
      ],
      people: ['Tim shipping', 'Tim warehouse', 'Vendor transportasi'],
      checks: ['Kesesuaian Delivery Order (DO)', 'Kesiapan barang dan kendaraan', 'Jadwal loading dan status shipment']
    },
    transport: {
      title: 'Transport',
      description: 'Mengoordinasikan perjalanan pengiriman dari warehouse menuju toko sesuai rute dan model drop yang digunakan.',
      activities: [
        'Mengoordinasikan pengiriman dengan vendor transportasi.',
        'Memantau status shipment selama perjalanan.',
        'Mengomunikasikan kendala pengiriman kepada pihak terkait.'
      ],
      people: ['Vendor transportasi dan pengemudi', 'Tim shipping', 'Tim penerima toko'],
      checks: ['Tujuan dan urutan pengiriman', 'Status shipment', 'Kesesuaian perjalanan dengan jadwal pengiriman']
    },
    unloading: {
      title: 'Unloading',
      description: 'Menggambarkan tahap penerimaan barang di toko, pemeriksaan pengiriman, dan pembaruan status penyelesaian.',
      activities: [
        'Mengoordinasikan kedatangan dengan tim penerima toko.',
        'Menurunkan dan memeriksa barang yang diterima.',
        'Memperbarui status pengiriman dan mencatat kendala penerimaan.'
      ],
      people: ['Tim penerima toko', 'Pengemudi', 'Tim shipping untuk koordinasi'],
      checks: ['Kesesuaian barang dengan Delivery Order (DO)', 'Kondisi barang saat diterima', 'Status penyelesaian pengiriman']
    }
  };

  const dropModels = {
    single: {
      title: 'Single Drop',
      description: 'Pengiriman dari warehouse langsung menuju satu toko tujuan.',
      example: 'Contoh rute: 1 truk 1 toko.',
      route: ['Warehouse', 'Toko tujuan']
    },
    multi: {
      title: 'Multi Drop',
      description: 'Pengiriman menuju beberapa toko dalam satu rute, dengan urutan tujuan yang disesuaikan dengan rencana pengiriman.',
      example: 'Contoh rute: 1 truk beberapa toko satu rute.',
      route: ['Warehouse', 'Toko A', 'Toko B', 'Toko berikutnya']
    },
    triple: {
      title: 'Triple Drop',
      description: 'Pengiriman menuju tiga titik pengiriman dalam satu perjalanan.',
      example: 'Contoh rute: 1 truk tiga titik pengiriman.',
      route: ['Warehouse', 'Toko A', 'Toko B', 'Toko C']
    }
  };

  const setText = (id, value) => {
    document.getElementById(id).textContent = value;
  };

  const setList = (id, items) => {
    document.getElementById(id).replaceChildren(...items.map((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      return li;
    }));
  };

  // Manual tab activation supports pointer, Enter/Space, and arrow keys.
  const setupTabs = (attribute, panelId, render) => {
    const buttons = [...document.querySelectorAll(`[${attribute}]`)];
    const panel = document.getElementById(panelId);
    if (!buttons.length || !panel) return;

    const activate = (button) => {
      buttons.forEach((item) => {
        const selected = item === button;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
        item.classList.toggle('is-active', selected);
      });
      panel.setAttribute('aria-labelledby', button.id);
      render(button.getAttribute(attribute));
    };

    buttons.forEach((button, index) => {
      button.addEventListener('click', () => activate(button));
      button.addEventListener('keydown', (event) => {
        let nextIndex;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % buttons.length;
        if (event.key === 'ArrowLeft') nextIndex = (index - 1 + buttons.length) % buttons.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = buttons.length - 1;
        if (nextIndex === undefined) return;
        event.preventDefault();
        buttons[nextIndex].focus();
        activate(buttons[nextIndex]);
      });
    });
    activate(buttons.find((button) => button.getAttribute('aria-selected') === 'true') || buttons[0]);
  };

  setupTabs('data-stage', 'stage-panel', (key) => {
    const stage = stages[key];
    setText('stage-title', stage.title);
    setText('stage-description', stage.description);
    setList('stage-activities', stage.activities);
    setList('stage-people', stage.people);
    setList('stage-checks', stage.checks);
  });

  setupTabs('data-drop', 'drop-panel', (key) => {
    const model = dropModels[key];
    setText('drop-title', model.title);
    setText('drop-description', model.description);
    setText('drop-example', model.example);
    const route = document.getElementById('drop-route');
    const points = [];
    model.route.forEach((label, index) => {
      if (index) {
        const arrow = document.createElement('span');
        arrow.className = 'route-link';
        arrow.textContent = '→';
        arrow.setAttribute('aria-hidden', 'true');
        points.push(arrow);
      }
      const point = document.createElement('span');
      point.className = 'route-point';
      point.textContent = label;
      points.push(point);
    });
    route.replaceChildren(...points);
    route.setAttribute('aria-label', `Rute: ${model.route.join(' menuju ')}`);
  });

  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  if (navToggle && nav) {
    const setNavOpen = (open) => {
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Tutup navigasi' : 'Buka navigasi');
      nav.classList.toggle('is-open', open);
    };
    navToggle.addEventListener('click', () => {
      setNavOpen(navToggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setNavOpen(false));
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        setNavOpen(false);
        navToggle.focus();
      }
    });
    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !navToggle.contains(event.target)) setNavOpen(false);
    });

    if ('IntersectionObserver' in window) {
      const links = [...nav.querySelectorAll('a[href^="#"]')];
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => {
            const active = link.hash === `#${entry.target.id}`;
            link.classList.toggle('is-current', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          });
        });
      }, { rootMargin: '-15% 0px -65% 0px' });
      links.forEach((link) => {
        const section = document.querySelector(link.hash);
        if (section) observer.observe(section);
      });
    }
  }

  const form = document.getElementById('contact-form');
  if (form) {
    const status = document.getElementById('form-status');
    const submit = document.getElementById('submit-button');
    const fields = ['name', 'email', 'message'];
    fields.forEach((field) => {
      form.elements.namedItem(field).addEventListener('input', (event) => {
        event.target.setCustomValidity('');
      });
    });

    const showStatus = (message, state) => {
      status.textContent = message;
      status.dataset.state = state;
      status.hidden = false;
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (submit.disabled) return;
      const payload = {};
      fields.forEach((field) => {
        const input = form.elements.namedItem(field);
        payload[field] = input.value.trim();
        input.setCustomValidity(payload[field] ? '' : 'Mohon isi kolom ini.');
      });
      if (!form.reportValidity()) return;

      const originalLabel = submit.textContent;
      submit.disabled = true;
      submit.textContent = 'Mengirim pesan…';
      form.setAttribute('aria-busy', 'true');
      showStatus('Pesan sedang dikirim. Mohon tunggu.', 'pending');
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 10000);

      try {
        if (!['http:', 'https:'].includes(window.location.protocol)) {
          throw new Error('contact-unavailable');
        }
        const response = await fetch('api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) throw new Error('contact-unavailable');
        const result = await response.json();
        if (!response.ok || result.success !== true) {
          if (response.status === 400 && typeof result.message === 'string') {
            showStatus(`Pesan belum terkirim. ${result.message}`, 'error');
            return;
          }
          throw new Error('contact-unavailable');
        }
        showStatus('Pesan berhasil disimpan. Terima kasih telah menghubungi saya.', 'success');
        form.reset();
      } catch {
        showStatus('Pesan belum terkirim. Layanan kontak tidak dapat dihubungi. Silakan hubungi saya melalui email atau telepon.', 'error');
      } finally {
        window.clearTimeout(timeout);
        submit.disabled = false;
        submit.textContent = originalLabel;
        form.removeAttribute('aria-busy');
      }
    });
  }
})();
