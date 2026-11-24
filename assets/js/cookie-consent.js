(function () {
  "use strict";

  const COOKIE_NAME = "olemesheva_cookie_consent_v1";
  const COOKIE_VERSION = 1;
  const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
  const METRIKA_ID = 110977312;
  const METRIKA_DISABLE_KEY = "disableYaCounter" + METRIKA_ID;
  const DEFAULT_PREFERENCES = Object.freeze({
    version: COOKIE_VERSION,
    functional: false,
    analytics: false,
  });

  let preferences = readPreferences();
  let notice = null;
  let noticeReady = null;
  let metrikaLoaded = false;

  window[METRIKA_DISABLE_KEY] = !preferences.analytics;

  function clonePreferences(value) {
    return {
      version: COOKIE_VERSION,
      functional: value.functional === true,
      analytics: value.analytics === true,
    };
  }

  function readPreferences() {
    const prefix = COOKIE_NAME + "=";
    const item = document.cookie
      .split(";")
      .map(function (part) {
        return part.trim();
      })
      .find(function (part) {
        return part.indexOf(prefix) === 0;
      });

    if (!item) {
      return clonePreferences(DEFAULT_PREFERENCES);
    }

    try {
      const parsed = JSON.parse(decodeURIComponent(item.slice(prefix.length)));
      if (!parsed || parsed.version !== COOKIE_VERSION) {
        return clonePreferences(DEFAULT_PREFERENCES);
      }
      return clonePreferences(parsed);
    } catch (error) {
      return clonePreferences(DEFAULT_PREFERENCES);
    }
  }

  function hasStoredChoice() {
    return document.cookie.split(";").some(function (part) {
      return part.trim().indexOf(COOKIE_NAME + "=") === 0;
    });
  }

  function writePreferences(nextPreferences) {
    const stored = clonePreferences(nextPreferences);
    stored.updatedAt = new Date().toISOString();

    let cookie = COOKIE_NAME + "=" + encodeURIComponent(JSON.stringify(stored));
    cookie += "; Max-Age=" + COOKIE_MAX_AGE + "; Path=/; SameSite=Lax";
    if (window.location.protocol === "https:") {
      cookie += "; Secure";
    }
    document.cookie = cookie;
    preferences = clonePreferences(stored);
  }

  function dispatchChange() {
    document.dispatchEvent(
      new CustomEvent("cookieconsent:change", {
        detail: clonePreferences(preferences),
      })
    );
  }

  function loadMetrika() {
    if (metrikaLoaded || !preferences.analytics) {
      return;
    }

    metrikaLoaded = true;
    window[METRIKA_DISABLE_KEY] = false;
    window.ym =
      window.ym ||
      function () {
        (window.ym.a = window.ym.a || []).push(arguments);
      };
    window.ym.l = Number(new Date());

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://mc.yandex.ru/metrika/tag.js?id=" + METRIKA_ID;
    script.addEventListener("load", function () {
      window.ym(METRIKA_ID, "init", {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: false,
      });
    });
    script.addEventListener("error", function () {
      metrikaLoaded = false;
    });
    document.head.appendChild(script);
  }

  function loadFunctionalMaps() {
    if (!preferences.functional) {
      return;
    }

    document.querySelectorAll('[data-cookie-service="functional-map"]').forEach(function (container) {
      if (container.dataset.cookieLoaded === "true" || !container.dataset.src) {
        return;
      }

      container.dataset.cookieLoaded = "true";
      container.replaceChildren();

      const script = document.createElement("script");
      script.async = true;
      script.charset = "utf-8";
      script.src = container.dataset.src;
      script.addEventListener("error", function () {
        container.dataset.cookieLoaded = "false";
        container.innerHTML =
          '<p class="map-consent__error">Не удалось загрузить карту. Проверьте соединение и попробуйте ещё раз.</p>';
      });
      container.appendChild(script);
    });
  }

  function applyPreferences() {
    window[METRIKA_DISABLE_KEY] = !preferences.analytics;
    if (preferences.analytics) {
      loadMetrika();
    }
    if (preferences.functional) {
      loadFunctionalMaps();
    }
  }

  function expireCookie(name, domain) {
    let cookie = name + "=; Max-Age=0; Path=/; SameSite=Lax";
    if (domain) {
      cookie += "; Domain=" + domain;
    }
    if (window.location.protocol === "https:") {
      cookie += "; Secure";
    }
    document.cookie = cookie;
  }

  function clearAnalyticsStorage() {
    window[METRIKA_DISABLE_KEY] = true;

    document.cookie.split(";").forEach(function (part) {
      const name = part.split("=")[0].trim();
      if (/^_ym_|^yandexuid$|^yuidss$|^ymex$/.test(name)) {
        expireCookie(name);
        expireCookie(name, window.location.hostname);
        expireCookie(name, "." + window.location.hostname);
      }
    });

    try {
      Object.keys(window.localStorage).forEach(function (key) {
        if (/^_ym|metrika/i.test(key)) {
          window.localStorage.removeItem(key);
        }
      });
    } catch (error) {
      // Storage can be unavailable in privacy modes. Blocking future loading is still enforced.
    }
  }

  function syncControls() {
    if (!notice) {
      return;
    }
    const functional = notice.querySelector(".js-cookie-functional");
    const analytics = notice.querySelector(".js-cookie-analytics");
    if (functional) {
      functional.checked = preferences.functional;
    }
    if (analytics) {
      analytics.checked = preferences.analytics;
    }
  }

  function showNotice(openSettings) {
    if (!notice) {
      return;
    }

    syncControls();
    const settings = notice.querySelector(".js-cookie-settings");
    const toggle = notice.querySelector(".js-cookie-toggle-settings");
    const save = notice.querySelector(".js-cookie-save");
    settings.hidden = !openSettings;
    save.hidden = !openSettings;
    toggle.setAttribute("aria-expanded", openSettings ? "true" : "false");
    notice.hidden = false;
    notice.focus();
  }

  function hideNotice() {
    if (notice) {
      notice.hidden = true;
    }
  }

  function saveChoice(nextPreferences) {
    const previous = clonePreferences(preferences);
    writePreferences(nextPreferences);

    if (!preferences.analytics) {
      clearAnalyticsStorage();
    }

    dispatchChange();
    hideNotice();

    if (
      (previous.analytics && !preferences.analytics) ||
      (previous.functional && !preferences.functional)
    ) {
      window.location.reload();
      return;
    }

    applyPreferences();
  }

  function bindNotice() {
    const settings = notice.querySelector(".js-cookie-settings");
    const toggle = notice.querySelector(".js-cookie-toggle-settings");
    const save = notice.querySelector(".js-cookie-save");

    notice.querySelector(".js-cookie-reject").addEventListener("click", function () {
      saveChoice(DEFAULT_PREFERENCES);
    });

    notice.querySelector(".js-cookie-accept").addEventListener("click", function () {
      saveChoice({
        functional: true,
        analytics: true,
      });
    });

    toggle.addEventListener("click", function () {
      const willOpen = settings.hidden;
      settings.hidden = !willOpen;
      save.hidden = !willOpen;
      toggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
      if (willOpen) {
        notice.querySelector(".js-cookie-functional").focus();
      }
    });

    save.addEventListener("click", function () {
      saveChoice({
        functional: notice.querySelector(".js-cookie-functional").checked,
        analytics: notice.querySelector(".js-cookie-analytics").checked,
      });
    });

    notice.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && hasStoredChoice()) {
        hideNotice();
      }
    });
  }

  function ensureNotice() {
    if (noticeReady) {
      return noticeReady;
    }

    notice = document.querySelector("#cookie-notice-root .js-cookie-notice");
    if (notice) {
      bindNotice();
    }
    noticeReady = Promise.resolve(notice);
    return noticeReady;
  }

  document.addEventListener("click", function (event) {
    const settingsButton = event.target.closest("[data-cookie-settings-open]");
    if (settingsButton) {
      event.preventDefault();
      ensureNotice().then(function () {
        showNotice(true);
      });
      return;
    }

    const mapButton = event.target.closest("[data-cookie-map-enable]");
    if (mapButton) {
      event.preventDefault();
      saveChoice({
        functional: true,
        analytics: preferences.analytics,
      });
    }
  });

  window.siteCookieConsent = {
    open: function () {
      return ensureNotice().then(function () {
        showNotice(true);
      });
    },
    getPreferences: function () {
      return clonePreferences(preferences);
    },
  };

  function initialize() {
    applyPreferences();
    ensureNotice().then(function () {
      if (!hasStoredChoice()) {
        showNotice(false);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
