/* =========================================================================
   Dr.Nurdin Zh — логика страницы.
   Зависит от content.js (CONFIG, CONTACTS, DOCTOR, SERVICES, CASES, WORKS, T)
   и reviews.js (ReviewStore).
   ========================================================================= */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lang = 'ru';

  function t(key) {
    var d = T[lang] || T.ru;
    return d[key] != null ? d[key] : key;
  }

  // Значение вида {ru:…, ky:…} либо простая строка
  function loc(v) {
    if (v == null) return '';
    return typeof v === 'object' ? (v[lang] != null ? v[lang] : v.ru) : v;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- иконки услуг ------------------------------------------------ */

  var ICONS = {
    filling: '<path d="M12 3.5c-4.4 0-7.9 2.4-7.9 6.8 0 3 .9 4.9 1.5 7.4.5 2.5.5 5.4 1.5 5.9s1.5-1.5 2-3.9c.5-2 1-3.9 2.9-3.9s2.4 2 2.9 3.9c.5 2.4 1 4.4 2 3.9s1-3.4 1.5-5.9c.6-2.5 1.5-4.4 1.5-7.4 0-4.4-3.5-6.8-7.9-6.8Z"/><path d="M9 10.5c.9-.8 2-1.2 3-1.2s2.1.4 3 1.2"/>',
    canal:   '<path d="M12 3.5c-4.4 0-7.9 2.4-7.9 6.8 0 3 .9 4.9 1.5 7.4.5 2.5.5 5.4 1.5 5.9s1.5-1.5 2-3.9c.5-2 1-3.9 2.9-3.9s2.4 2 2.9 3.9c.5 2.4 1 4.4 2 3.9s1-3.4 1.5-5.9c.6-2.5 1.5-4.4 1.5-7.4 0-4.4-3.5-6.8-7.9-6.8Z"/><path d="M10 9v6M14 9v6" stroke-dasharray="1.5 2"/>',
    braces:  '<rect x="3" y="9.5" width="4" height="5" rx="1.2"/><rect x="10" y="9.5" width="4" height="5" rx="1.2"/><rect x="17" y="9.5" width="4" height="5" rx="1.2"/><path d="M3 7.5h18M7 12h3M14 12h3"/>',
    crown:   '<path d="M4 16.5 5.5 7l4 4L12 5.5 14.5 11l4-4L20 16.5H4Z"/><path d="M4.5 19.5h15"/>',
    clean:   '<path d="M9 3.5h6l.8 6.5H8.2L9 3.5Z"/><path d="M8.2 10h7.6v6.5a3.8 3.8 0 0 1-7.6 0V10Z"/><path d="M12 16.5v4"/>',
    tooth:   '<path d="M12 3.5c-4.4 0-7.9 2.4-7.9 6.8 0 3 .9 4.9 1.5 7.4.5 2.5.5 5.4 1.5 5.9s1.5-1.5 2-3.9c.5-2 1-3.9 2.9-3.9s2.4 2 2.9 3.9c.5 2.4 1 4.4 2 3.9s1-3.4 1.5-5.9c.6-2.5 1.5-4.4 1.5-7.4 0-4.4-3.5-6.8-7.9-6.8Z"/>'
  };

  function icon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
           (ICONS[name] || ICONS.tooth) + '</svg>';
  }

  /* ---------- контакты ---------------------------------------------------- */

  function waLink() {
    var base = CONTACTS.whatsapp || '';
    var msg = loc(CONTACTS.waMessage);
    if (!base) return '#';
    return base + (base.indexOf('?') > -1 ? '&' : '?') + 'text=' + encodeURIComponent(msg);
  }

  function applyContacts() {
    $$('[data-c]').forEach(function (el) {
      var key = el.getAttribute('data-c');
      var val = key === 'whatsapp' ? waLink() : CONTACTS[key];
      if (val) {
        el.setAttribute('href', val);
        el.classList.remove('is-off');
      } else {
        el.setAttribute('href', '#');
        el.classList.add('is-off');       // ссылка не заполнена — прячем
      }
    });
    $$('[data-ctext]').forEach(function (el) {
      var val = CONTACTS[el.getAttribute('data-ctext')];
      if (val) el.textContent = val;
    });

    var hours = $('#cHours');
    if (hours) hours.textContent = loc(CONTACTS.hours);
    var addr = $('#cAddress');
    if (addr) addr.textContent = loc(CONTACTS.address);

    renderSocial();
  }

  var SOC_ICONS = {
    whatsapp: '<path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.23 8.23 0 0 1 .01 16.47Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.09-.16.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.49-.4-.42-.56-.43l-.47-.01c-.16 0-.43.06-.65.31-.23.24-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.74 2.65 4.2 3.72.59.25 1.05.4 1.4.52.59.18 1.13.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29Z"/>',
    telegram: '<path d="M21.9 4.3 18.7 19.4c-.24 1.06-.87 1.32-1.76.82l-4.86-3.58-2.34 2.26c-.26.26-.48.48-.98.48l.35-4.95 9.02-8.15c.39-.35-.09-.54-.61-.19L6.36 13.1l-4.8-1.5c-1.04-.33-1.06-1.04.22-1.54l18.77-7.23c.87-.32 1.63.2 1.35 1.47Z"/>'
  };

  function renderSocial() {
    var box = $('#socLinks');
    if (!box) return;
    var out = '';

    if (CONTACTS.whatsapp) {
      out += '<a class="soc__b soc__b--wa" href="' + waLink() + '" target="_blank" rel="noopener">' +
             '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + SOC_ICONS.whatsapp + '</svg>' +
             '<span>WhatsApp</span></a>';
    }
    if (CONTACTS.instagram) {
      out += '<a class="soc__b soc__b--ig" href="' + esc(CONTACTS.instagram) + '" target="_blank" rel="noopener">' +
             '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">' +
             '<rect x="3" y="3" width="18" height="18" rx="5.4"/><circle cx="12" cy="12" r="4"/>' +
             '<circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" stroke="none"/></svg>' +
             '<span>Instagram</span></a>';
    }
    if (CONTACTS.telegram) {
      out += '<a class="soc__b soc__b--tg" href="' + esc(CONTACTS.telegram) + '" target="_blank" rel="noopener">' +
             '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + SOC_ICONS.telegram + '</svg>' +
             '<span>Telegram</span></a>';
    }
    box.innerHTML = out;
  }

  /* ---------- блок «о себе» ----------------------------------------------- */

  function renderAbout() {
    var stats = $('#heroStats');
    if (stats) {
      stats.innerHTML = DOCTOR.stats.map(function (s) {
        return '<li><b>' + esc(s.value) + esc(s.suffix || '') + '</b><span>' + esc(loc(s.label)) + '</span></li>';
      }).join('');
    }

    var tl = $('#timeline');
    if (tl) {
      tl.innerHTML = DOCTOR.timeline.map(function (row) {
        return '<li class="tl__i">' +
                 '<span class="tl__y">' + esc(loc(row.years)) + '</span>' +
                 '<span class="tl__t">' + esc(loc(row.title)) + '</span>' +
                 '<span class="tl__d">' + esc(loc(row.text)) + '</span>' +
               '</li>';
      }).join('');
    }
  }

  /* ---------- услуги ------------------------------------------------------ */

  function renderServices() {
    var box = $('#srvGrid');
    if (!box) return;
    box.innerHTML = SERVICES.map(function (s) {
      return '<article class="srv__c reveal">' +
               '<span class="srv__i">' + icon(s.icon) + '</span>' +
               '<h3 class="srv__t">' + esc(loc(s.title)) + '</h3>' +
               '<p class="srv__d">' + esc(loc(s.text)) + '</p>' +
             '</article>';
    }).join('');
  }

  /* ---------- галерея: шторка «до / после» -------------------------------- */

  var caseIndex = 0;

  function renderChips() {
    var box = $('#caseChips');
    if (!box) return;
    box.innerHTML = CASES.map(function (c, i) {
      return '<button type="button" class="chip' + (i === caseIndex ? ' is-on' : '') +
             '" role="tab" aria-selected="' + (i === caseIndex) + '" data-i="' + i + '">' +
             esc(loc(c.chip)) + '</button>';
    }).join('');
  }

  function showCase(i) {
    caseIndex = i;
    var c = CASES[i];
    if (!c) return;

    var ba = $('#ba');
    if (ba && !reduceMotion) {
      ba.classList.add('is-swap');
      setTimeout(function () { ba.classList.remove('is-swap'); }, 240);
    }
    $('#baBefore').src = c.before;
    $('#baAfter').src  = c.after;
    $('#caseTitle').textContent = loc(c.title);
    $('#caseText').textContent  = loc(c.text);

    $$('#caseChips .chip').forEach(function (b, bi) {
      b.classList.toggle('is-on', bi === i);
      b.setAttribute('aria-selected', bi === i);
    });
  }

  function initCurtain() {
    var chips = $('#caseChips');
    if (chips) {
      chips.addEventListener('click', function (e) {
        var b = e.target.closest('.chip');
        if (b) showCase(Number(b.getAttribute('data-i')));
      });
    }

    var ba = $('#ba');
    var handle = $('#baHandle');
    if (!ba || !handle) return;

    var dragging = false;

    function setPos(p) {
      p = Math.max(0, Math.min(100, p));
      ba.style.setProperty('--pos', p + '%');
      handle.setAttribute('aria-valuenow', Math.round(p));
    }
    function fromEvent(e) {
      var r = ba.getBoundingClientRect();
      return ((e.clientX - r.left) / r.width) * 100;
    }

    ba.addEventListener('pointerdown', function (e) {
      dragging = true;
      ba.setPointerCapture(e.pointerId);
      ba.classList.add('is-drag');
      setPos(fromEvent(e));
    });
    ba.addEventListener('pointermove', function (e) { if (dragging) setPos(fromEvent(e)); });

    function stop(e) {
      if (!dragging) return;
      dragging = false;
      ba.classList.remove('is-drag');
      if (ba.hasPointerCapture && ba.hasPointerCapture(e.pointerId)) ba.releasePointerCapture(e.pointerId);
    }
    ba.addEventListener('pointerup', stop);
    ba.addEventListener('pointercancel', stop);

    handle.addEventListener('keydown', function (e) {
      var cur = Number(handle.getAttribute('aria-valuenow')) || 50;
      var step = e.shiftKey ? 10 : 3;
      if (e.key === 'ArrowLeft')       { setPos(cur - step); e.preventDefault(); }
      else if (e.key === 'ArrowRight') { setPos(cur + step); e.preventDefault(); }
      else if (e.key === 'Home')       { setPos(0);   e.preventDefault(); }
      else if (e.key === 'End')        { setPos(100); e.preventDefault(); }
    });
  }

  /* ---------- фото и видео с приёма + лайтбокс ----------------------------- */

  function renderWorks() {
    var box = $('#works');
    if (!box) return;
    box.innerHTML = WORKS.map(function (w, i) {
      var media = w.type === 'video'
        ? '<video src="' + esc(w.src) + '" poster="' + esc(w.poster || '') + '" muted loop playsinline preload="metadata"></video>' +
          '<span class="works__play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5-11-6.5Z"/></svg></span>'
        : '<img src="' + esc(w.src) + '" alt="' + esc(loc(w.cap)) + '" loading="lazy">';
      return '<figure class="works__i reveal" data-i="' + i + '" tabindex="0" role="button">' +
               media +
               '<figcaption>' + esc(loc(w.cap)) + '</figcaption>' +
             '</figure>';
    }).join('');
  }

  var lbIndex = 0;
  var lbOpen = false;
  var lbBack = null;

  function openLb(i) {
    lbIndex = (i + WORKS.length) % WORKS.length;
    lbOpen = true;
    var w = WORKS[lbIndex];
    var lb = $('#lb');

    $('#lbBody').innerHTML = w.type === 'video'
      ? '<video src="' + esc(w.src) + '" controls autoplay loop playsinline></video>'
      : '<img src="' + esc(w.src) + '" alt="' + esc(loc(w.cap)) + '">';
    $('#lbCap').textContent = loc(w.cap);

    lb.hidden = false;
    document.body.classList.add('is-lock');
    requestAnimationFrame(function () { if (lbOpen) lb.classList.add('is-on'); });
    $('#lbX').focus();
  }

  function closeLb() {
    lbOpen = false;
    var lb = $('#lb');
    lb.classList.remove('is-on');
    document.body.classList.remove('is-lock');
    setTimeout(function () {
      if (!lbOpen) { lb.hidden = true; $('#lbBody').innerHTML = ''; }
    }, 220);
    if (lbBack) { lbBack.focus(); lbBack = null; }
  }

  function initLightbox() {
    var grid = $('#works');
    var lb = $('#lb');
    if (!grid || !lb) return;

    function from(el) { lbBack = el; openLb(Number(el.getAttribute('data-i'))); }

    grid.addEventListener('click', function (e) {
      var f = e.target.closest('.works__i');
      if (f) from(f);
    });
    grid.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var f = e.target.closest('.works__i');
      if (f) { e.preventDefault(); from(f); }
    });

    $('#lbX').addEventListener('click', closeLb);
    $$('.lb__n').forEach(function (b) {
      b.addEventListener('click', function () { openLb(lbIndex + Number(b.getAttribute('data-dir'))); });
    });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });

    document.addEventListener('keydown', function (e) {
      if (!lbOpen) return;
      if (e.key === 'Escape')     closeLb();
      if (e.key === 'ArrowLeft')  openLb(lbIndex - 1);
      if (e.key === 'ArrowRight') openLb(lbIndex + 1);
    });
  }

  /* ---------- отзывы ------------------------------------------------------ */

  var rating = 5;
  var lastSent = 0;

  function starSvg(filled) {
    return '<svg viewBox="0 0 20 20" class="st' + (filled ? '' : ' st--off') + '" aria-hidden="true">' +
           '<path d="m10 1.6 2.5 5.3 5.7.8-4.1 4.1 1 5.8-5.1-2.8-5.1 2.8 1-5.8L1.8 7.7l5.7-.8z"/></svg>';
  }

  function starRow(n) {
    var out = '';
    for (var i = 1; i <= 5; i++) out += starSvg(i <= n);
    return '<span class="stars stars--sm">' + out + '</span>';
  }

  function renderStarPicker() {
    var box = $('#rStars');
    if (!box) return;
    var out = '';
    for (var i = 1; i <= 5; i++) {
      out += '<button type="button" class="stars__b" role="radio" data-v="' + i + '" ' +
             'aria-checked="' + (i === rating) + '" aria-label="' + i + '">' + starSvg(i <= rating) + '</button>';
    }
    box.innerHTML = out;
  }

  function fmtDate(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return '';
    var m = lang === 'ky'
      ? ['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь']
      : ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
    return d.getDate() + ' ' + m[d.getMonth()] + ' ' + d.getFullYear();
  }

  function paintReviews(list) {
    var box = $('#revList');
    if (!box) return;

    if (!list || !list.length) {
      box.innerHTML = '<p class="rlist__empty">' + esc(t('reviews.empty')) + '</p>';
      return;
    }
    box.innerHTML = list.map(function (r) {
      return '<article class="rev">' +
               '<header class="rev__h">' +
                 '<span class="rev__n">' + esc(r.name) + '</span>' +
                 starRow(r.rating) +
               '</header>' +
               '<p class="rev__t">' + esc(r.text) + '</p>' +
               '<time class="rev__d">' + esc(fmtDate(r.created_at)) + '</time>' +
             '</article>';
    }).join('');
  }

  function loadReviews() {
    var box = $('#revList');
    if (!box) return;
    box.innerHTML = '<p class="rlist__empty">' + esc(t('reviews.loading')) + '</p>';

    ReviewStore.list().then(paintReviews).catch(function (err) {
      console.error('Не удалось загрузить отзывы:', err);
      paintReviews([]);
    });
  }

  function msg(text, kind) {
    var el = $('#rMsg');
    if (!el) return;
    el.textContent = text;
    el.className = 'rform__msg' + (kind ? ' is-' + kind : '');
    el.hidden = false;
  }

  function initReviews() {
    var form = $('#revForm');
    if (!form) return;

    var stars = $('#rStars');
    stars.addEventListener('click', function (e) {
      var b = e.target.closest('.stars__b');
      if (!b) return;
      rating = Number(b.getAttribute('data-v'));
      renderStarPicker();
    });
    stars.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      rating = Math.min(5, Math.max(1, rating + (e.key === 'ArrowRight' ? 1 : -1)));
      renderStarPicker();
      stars.querySelector('[data-v="' + rating + '"]').focus();
    });

    var name = $('#rName');
    var text = $('#rText');
    [name, text].forEach(function (el) {
      el.addEventListener('input', function () { el.closest('.f').classList.remove('has-e'); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // ловушка для ботов: если поле заполнено — тихо выходим
      if ($('#rHp').value) return;

      var bad = false;
      if (name.value.trim().length < 2) { name.closest('.f').classList.add('has-e'); bad = true; }
      if (text.value.trim().length < 10) { text.closest('.f').classList.add('has-e'); bad = true; }
      if (bad) {
        $('.f.has-e input, .f.has-e textarea', form).focus();
        return;
      }

      // не чаще раза в минуту с одного устройства
      var now = Date.now();
      if (now - lastSent < 60000) {
        msg(t('reviews.ok'), 'ok');
        return;
      }

      var btn = $('#rSubmit');
      btn.disabled = true;
      btn.textContent = t('reviews.sending');

      ReviewStore.add({ name: name.value, rating: rating, text: text.value })
        .then(function () {
          lastSent = Date.now();
          form.reset();
          rating = 5;
          renderStarPicker();
          msg(t('reviews.ok') + (ReviewStore.isShared() ? '' : ' ' + t('reviews.localOnly')), 'ok');
          loadReviews();
        })
        .catch(function (err) {
          console.error('Отзыв не отправился:', err);
          msg(t('reviews.errSend'), 'err');
        })
        .then(function () {
          btn.disabled = false;
          btn.textContent = t('reviews.submit');
        });
    });

    renderStarPicker();
    loadReviews();
  }

  /* ---------- шапка и меню ------------------------------------------------ */

  function initHeader() {
    var hdr = $('#hdr');
    var burger = $('#burger');
    var menu = $('#mmenu');
    var open = false;

    var links = $$('.nav a');
    var secs = links.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);

    // Текущий раздел считаем от точки на 45% высоты экрана.
    // Через scroll, а не IntersectionObserver: работает предсказуемо и когда
    // вкладка ещё не отрисовала первый кадр.
    function markCurrent() {
      var mid = window.scrollY + window.innerHeight * 0.45;
      var cur = null;
      secs.forEach(function (s) { if (s.offsetTop <= mid) cur = s; });
      links.forEach(function (a) {
        a.classList.toggle('is-cur', !!cur && a.getAttribute('href') === '#' + cur.id);
      });
    }

    var onScroll = function () {
      hdr.classList.toggle('is-stuck', window.scrollY > 20);
      markCurrent();
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', markCurrent);

    function openMenu() {
      open = true;
      menu.hidden = false;
      requestAnimationFrame(function () { if (open) menu.classList.add('is-on'); });
      burger.classList.add('is-on');
      burger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('is-lock');
    }
    function closeMenu() {
      open = false;
      menu.classList.remove('is-on');
      burger.classList.remove('is-on');
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-lock');
      setTimeout(function () { if (!open) menu.hidden = true; }, 300);
    }

    burger.addEventListener('click', function () { open ? closeMenu() : openMenu(); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) closeMenu(); });
  }

  /* ---------- появление по скроллу ---------------------------------------- */

  var REVEAL = ['.sec', '.about__txt', '.about__side', '.srv__c', '.chips', '.ba',
                '.ba__meta', '.grid__h', '.works__i', '.rform', '.rlist',
                '.consult__media', '.consult__txt', '.cnt__card'].join(',');

  function initReveal() {
    $$(REVEAL).forEach(function (el) { el.classList.add('reveal'); });

    if (reduceMotion || !('IntersectionObserver' in window)) {
      $$('.reveal').forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var seen = new Map();
    $$('.reveal').forEach(function (el) {
      var n = seen.get(el.parentNode) || 0;
      seen.set(el.parentNode, n + 1);
      el.style.transitionDelay = Math.min(n * 70, 350) + 'ms';
    });

    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    $$('.reveal').forEach(function (el) { io.observe(el); });
  }

  /* ---------- язык -------------------------------------------------------- */

  function applyLang(next) {
    lang = (next === 'ky') ? 'ky' : 'ru';
    document.documentElement.lang = lang;

    $$('[data-t]').forEach(function (el) { el.innerHTML = t(el.getAttribute('data-t')); });
    $$('[data-tp]').forEach(function (el) { el.setAttribute('placeholder', t(el.getAttribute('data-tp'))); });
    $$('.lang__b').forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-lang') === lang); });

    renderAbout();
    renderServices();
    renderChips();
    renderWorks();
    showCase(caseIndex);
    applyContacts();

    var btn = $('#rSubmit');
    if (btn && !btn.disabled) btn.textContent = t('reviews.submit');

    try { localStorage.setItem('drnz-lang', lang); } catch (e) { /* приватный режим */ }
  }

  function initLang() {
    $$('.lang__b').forEach(function (b) {
      b.addEventListener('click', function () {
        applyLang(b.getAttribute('data-lang'));
        loadReviews();
        initReveal();
        $$('.reveal').forEach(function (el) { el.classList.add('is-in'); });
      });
    });

    var saved = null;
    try { saved = localStorage.getItem('drnz-lang'); } catch (e) { /* приватный режим */ }
    applyLang(saved || 'ru');
  }

  /* ---------- запуск ------------------------------------------------------ */

  function init() {
    $('#year').textContent = new Date().getFullYear();

    initLang();
    initHeader();
    initCurtain();
    initLightbox();
    initReviews();
    initReveal();

    document.body.classList.add('is-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
