/* =========================================================================
   Хранилище отзывов.

   Если в content.js заполнены CONFIG.supabaseUrl и CONFIG.supabaseAnonKey —
   отзывы читаются и пишутся в базу Supabase и видны всем посетителям.
   Пока ключей нет, работает запасной режим: отзыв сохраняется в браузере
   автора, чтобы раздел можно было показывать и проверять.

   Настройка базы описана в SUPABASE.md (лежит рядом с index.html).
   ========================================================================= */
var ReviewStore = (function () {
  'use strict';

  var TABLE = 'reviews';
  var LS_KEY = 'drnz-reviews';
  var LIMIT = 100;

  function configured() {
    return !!(window.CONFIG && CONFIG.supabaseUrl && CONFIG.supabaseAnonKey);
  }

  function headers(extra) {
    var h = {
      apikey: CONFIG.supabaseAnonKey,
      Authorization: 'Bearer ' + CONFIG.supabaseAnonKey,
      'Content-Type': 'application/json'
    };
    if (extra) Object.keys(extra).forEach(function (k) { h[k] = extra[k]; });
    return h;
  }

  function endpoint(query) {
    return CONFIG.supabaseUrl.replace(/\/+$/, '') + '/rest/v1/' + TABLE + (query || '');
  }

  /* ---- запасной режим: localStorage ---- */

  function localRead() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function localWrite(list) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(list.slice(0, LIMIT))); } catch (e) { /* нет места или приватный режим */ }
  }

  /* ---- публичный интерфейс ---- */

  return {
    // true — отзывы видны всем; false — только автору на этом устройстве
    isShared: configured,

    list: function () {
      if (!configured()) {
        return Promise.resolve(localRead());
      }
      return fetch(endpoint('?select=id,name,rating,text,created_at&order=created_at.desc&limit=' + LIMIT), {
        headers: headers()
      }).then(function (r) {
        if (!r.ok) throw new Error('Supabase ответил ' + r.status);
        return r.json();
      });
    },

    add: function (review) {
      var row = {
        name: String(review.name || '').trim().slice(0, 60),
        rating: Math.min(5, Math.max(1, parseInt(review.rating, 10) || 5)),
        text: String(review.text || '').trim().slice(0, 1000)
      };

      if (!configured()) {
        var list = localRead();
        row.id = 'local-' + Date.now();
        row.created_at = new Date().toISOString();
        list.unshift(row);
        localWrite(list);
        return Promise.resolve(row);
      }

      return fetch(endpoint(), {
        method: 'POST',
        headers: headers({ Prefer: 'return=representation' }),
        body: JSON.stringify(row)
      }).then(function (r) {
        if (!r.ok) {
          return r.text().then(function (t) { throw new Error('Supabase ' + r.status + ': ' + t); });
        }
        return r.json();
      }).then(function (rows) {
        return Array.isArray(rows) ? rows[0] : rows;
      });
    }
  };
})();
