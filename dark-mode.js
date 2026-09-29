(function () {
  'use strict';

  const STORAGE_KEY = 'quran-site-theme';
  const root = document.documentElement;
  const pagePath = window.location.pathname.replace(/\\/g, '/').toLowerCase();
  const isReaderPage = /\/quran-mp3\//.test(pagePath);
  const isHomePage = !isReaderPage && (pagePath.endsWith('/index.html') || pagePath.endsWith('/'));
  const isQuranPdfPage = pagePath.endsWith('/quran-pdf.html');
  root.classList.toggle('dark-black-header-page', isHomePage || isQuranPdfPage);

  function getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      /* يستمر الوضع الليلي حتى لو منع المتصفح التخزين المحلي. */
    }
  }

  function preferredTheme() {
    const saved = getSavedTheme();
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    root.classList.toggle('dark-mode', isDark);
    root.dataset.theme = isDark ? 'dark' : 'light';

    const button = document.getElementById('darkModeToggle');
    if (button) {
      button.textContent = isDark ? '☀️' : '🌙';
      button.setAttribute('aria-label', isDark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي');
      button.setAttribute('title', isDark ? 'الوضع النهاري' : 'الوضع الليلي');
      button.setAttribute('aria-pressed', String(isDark));
    }
  }

  const style = document.createElement('style');
  style.id = 'darkModeStyles';
  style.textContent = `
    #darkModeToggle {
      position: fixed;
      right: 20px;
      bottom: 20px;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 52px;
      height: 52px;
      padding: 0;
      border: 1px solid rgba(0, 0, 0, .12);
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 0 6px 22px rgba(0, 0, 0, .18);
      color: #17203b;
      font-size: 24px;
      line-height: 1;
      cursor: pointer;
      transition: transform .2s ease, background-color .2s ease, box-shadow .2s ease;
    }
    #darkModeToggle:hover { transform: translateY(-2px); box-shadow: 0 9px 26px rgba(0, 0, 0, .24); }
    #darkModeToggle:focus-visible { outline: 3px solid #e39d3d; outline-offset: 3px; }

    html.dark-mode { color-scheme: dark; }
    html.dark-mode body { background: #11141b !important; color: #e8eaf0 !important; }
    html.dark-mode .main-header,
    html.dark-mode .page-header,
    html.dark-mode footer { background-color: #171b24 !important; color: #f2f3f7 !important; border-color: #303643 !important; }
    html.dark-mode .main-nav,
    html.dark-mode .main-nav ul,
    html.dark-mode .dropdown-menu { background-color: #171b24 !important; }
    html.dark-mode .main-nav a,
    html.dark-mode footer,
    html.dark-mode footer p { color: #f1f2f6 !important; }
    /* الصفحة الرئيسية وصفحة القرآن PDF: نفس رمادي هيدر صفحة الفهرس */
    html.dark-mode.dark-black-header-page .main-header,
    html.dark-mode.dark-black-header-page .main-header .container,
    html.dark-mode.dark-black-header-page .page-header,
    html.dark-mode.dark-black-header-page .page-header .page-wrapper,
    html.dark-mode.dark-black-header-page .main-nav,
    html.dark-mode.dark-black-header-page .main-nav ul,
    html.dark-mode.dark-black-header-page .dropdown-menu,
    html.dark-mode.dark-black-header-page .logo {
      background: #171b24 !important;
      background-color: #171b24 !important;
      color: #ffffff !important;
    }
    html.dark-mode.dark-black-header-page .main-header a,
    html.dark-mode.dark-black-header-page .page-header h1,
    html.dark-mode.dark-black-header-page .main-nav a { color: #ffffff !important; }
    html.dark-mode.dark-black-header-page .main-header,
    html.dark-mode.dark-black-header-page .page-header {
      background-image: none !important;
    }
    html.dark-mode .main-nav a:hover,
    html.dark-mode .main-nav a:focus { background-color: #252b38 !important; }
    html.dark-mode .content,
    html.dark-mode .sidebar,
    html.dark-mode article,
    html.dark-mode section,
    html.dark-mode .stat-box,
    html.dark-mode .mp3-reciter-card,
    html.dark-mode .surah-audio-card,
    html.dark-mode .other-surah-link,
    html.dark-mode .same-surah-reciter-link,
    html.dark-mode .zikr-card,
    html.dark-mode .dua-card,
    html.dark-mode .ruqia-card,
    html.dark-mode .search-result-card,
    html.dark-mode .mushaf-section,
    html.dark-mode .contact-box,
    html.dark-mode .quran-item,
    html.dark-mode .pdf-card,
    html.dark-mode .pdf-item,
    html.dark-mode .mushaf-card,
    html.dark-mode .quran-pdf-card,
    html.dark-mode .download-card,
    html.dark-mode .read-card { background-color: #1b202a !important; border-color: #343b49 !important; box-shadow: none !important; }
    html.dark-mode h1,
    html.dark-mode h2,
    html.dark-mode h3,
    html.dark-mode h4,
    html.dark-mode p,
    html.dark-mode span,
    html.dark-mode li,
    html.dark-mode .reciter-name,
    html.dark-mode .zikr-text,
    html.dark-mode .dua-text,
    html.dark-mode .ruqia-text,
    html.dark-mode .search-result-ayah { color: #e8eaf0 !important; }

    /* النص القرآني والبسملة */
    html.dark-mode .quran-text,
    html.dark-mode .quran-text .ayah,
    html.dark-mode .bismillah,
    html.dark-mode .bismillah-text { color: #ffffff !important; }
    html.dark-mode .quran-text .ayah-number { color: #69dc78 !important; }

/* لفظ الجلالة باللون الأصفر في الوضع الليلي */
html.dark-mode .quran-text .lafz-jalalah,
html.dark-mode .ayah .lafz-jalalah,
html.dark-mode span.lafz-jalalah {
  color: #E3C03B !important;
}
    /* لفظ الجلالة الملوّن بالأحمر نهارًا يصبح أصفر في الوضع الليلي */
    html.dark-mode .quran-text span[style*="color: red"],
    html.dark-mode .quran-text span[style*="color:red"],
    html.dark-mode .quran-text span[style*="#ff0000"],
    html.dark-mode .quran-text span[style*="#f00"],
    html.dark-mode .quran-text .allah,
    html.dark-mode .quran-text .lafz-allah,
    html.dark-mode .quran-text .divine-name {
      color: #FFD700 !important;
    }
    html.dark-mode .bismillah img {
      filter: grayscale(1) invert(1) brightness(2) !important;
      opacity: .96;
    }
    html.dark-mode img[src*='Al-Alaq.webp'],
    html.dark-mode img[src*='al-alaq.webp'],
    html.dark-mode img[alt*='إقرأ باسم ربك'],
    html.dark-mode img[alt*='اقرأ باسم ربك'] {
      filter: invert(1) !important;
      background-color: #000000 !important;
    }

    /* صفحة اتصل بنا */
    html.dark-mode .contact-page,
    html.dark-mode .contact-box,
    html.dark-mode .contact-form,
    html.dark-mode .contact-form-section,
    html.dark-mode .contact-info,
    html.dark-mode .social-contact { color: #ffffff !important; }
    html.dark-mode .contact-box { background-color: #1b202a !important; border-color: #394150 !important; }
    html.dark-mode .contact-box h1,
    html.dark-mode .contact-box h2,
    html.dark-mode .contact-box h3,
    html.dark-mode .contact-box p,
    html.dark-mode .contact-intro,
    html.dark-mode .contact-info,
    html.dark-mode .contact-form-section h2,
    html.dark-mode .form-group label { color: #ffffff !important; }
    html.dark-mode .contact-info a,
    html.dark-mode .contact-info a:visited { color: #f0bc72 !important; }
    html.dark-mode .form-group input,
    html.dark-mode .form-group textarea {
      background-color: #151a22 !important;
      color: #ffffff !important;
      border-color: #4a5364 !important;
    }
    html.dark-mode .form-group input:focus,
    html.dark-mode .form-group textarea:focus { border-color: #e39d3d !important; }
    html.dark-mode a { color: #d2b4ff; }
    html.dark-mode a:hover { color: #efdfff; }

    /* فهرس سور القرآن الكريم */
    html.dark-mode .table-wrapper { background-color: #171b24 !important; border-color: #343b49 !important; }
    html.dark-mode table.quran-table,
    html.dark-mode table.quran-table tbody,
    html.dark-mode table.quran-table tr,
    html.dark-mode table.quran-table th,
    html.dark-mode table.quran-table td { background-color: #1b202a !important; color: #e8eaf0 !important; border-color: #394150 !important; }
    html.dark-mode table.quran-table thead th { background-color: #252c38 !important; color: #ffffff !important; }
    html.dark-mode table.quran-table caption {
      background: #000000 !important;
      color: #ffffff !important;
      border-color: #000000 !important;
    }
    html.dark-mode table.quran-table tbody tr:nth-child(even) td { background-color: #202631 !important; }
    html.dark-mode table.quran-table tbody tr:hover td { background-color: #2a3240 !important; }
    html.dark-mode table.quran-table a,
    html.dark-mode table.quran-table a:visited { color: #d7b8ff !important; }

    /* مستطيل السورة السابقة والسورة التالية */
    html.dark-mode .surah-nav { border-color: #394150 !important; }
    html.dark-mode .surah-nav a,
    html.dark-mode .surah-nav span,
    html.dark-mode .previous-surah,
    html.dark-mode .next-surah,
    html.dark-mode .prev-surah,
    html.dark-mode .surah-previous,
    html.dark-mode .surah-next { background-color: #232a36 !important; color: #d7b8ff !important; border-color: #414a5b !important; }
    html.dark-mode .surah-nav a:hover { background-color: #2d3645 !important; color: #ffffff !important; }
    html.dark-mode .surah-nav .disabled { color: #8d95a3 !important; }

    /* بطاقات المصاحف وأزرار القراءة والتحميل PDF */
    html.dark-mode .quran-item,
    html.dark-mode .pdf-card,
    html.dark-mode .pdf-item,
    html.dark-mode .mushaf-card,
    html.dark-mode .quran-pdf-card { padding: 14px !important; border: 1px solid #394150 !important; border-radius: 14px !important; }
    html.dark-mode .quran-item p,
    html.dark-mode .quran-item h2,
    html.dark-mode .quran-item h3,
    html.dark-mode .pdf-card p,
    html.dark-mode .mushaf-card p,
    html.dark-mode .mushaf-caption { color: #e8eaf0 !important; }
    html.dark-mode .pdf-actions,
    html.dark-mode .mushaf-actions { background-color: transparent !important; }
    html.dark-mode .pdf-btn,
    html.dark-mode .read-btn,
    html.dark-mode .download-btn,
    html.dark-mode .view-btn,
    html.dark-mode .read-pdf-btn,
    html.dark-mode .download-pdf-btn,
    html.dark-mode .content a[href$='.pdf'],
    html.dark-mode .quran-item a[href$='.pdf'] { background-color: #2d3747 !important; color: #ffffff !important; border-color: #4b5668 !important; }
    html.dark-mode .pdf-btn:hover,
    html.dark-mode .read-btn:hover,
    html.dark-mode .download-btn:hover,
    html.dark-mode .view-btn:hover,
    html.dark-mode .read-pdf-btn:hover,
    html.dark-mode .download-pdf-btn:hover,
    html.dark-mode .content a[href$='.pdf']:hover,
    html.dark-mode .quran-item a[href$='.pdf']:hover { background-color: #3a465a !important; color: #ffffff !important; }
    html.dark-mode hr,
    html.dark-mode .separator { border-color: #353c4a !important; }
    html.dark-mode input,
    html.dark-mode textarea,
    html.dark-mode select,
    html.dark-mode .full-search-form,
    html.dark-mode #searchResults { background: #161b24 !important; color: #f0f1f5 !important; border-color: #394150 !important; }
    html.dark-mode input::placeholder,
    html.dark-mode textarea::placeholder { color: #aeb4c0 !important; }
    html.dark-mode mark { background: #80631f !important; color: #fff !important; }
    html.dark-mode audio { color-scheme: dark; }
    html.dark-mode .azkar-note,
    html.dark-mode .duas-note,
    html.dark-mode .dua-opening,
    html.dark-mode .ruqia-note,
    html.dark-mode .search-status { background: #292416 !important; color: #f1d99e !important; border-color: #594b28 !important; }
    html.dark-mode .dua-source,
    html.dark-mode .ruqia-source { background: #293142 !important; color: #d9e2ff !important; }



/* أسماء السور الأخرى باللون الذهبي في الوضع الليلي */
html.dark-mode .other-surah-link,
html.dark-mode .other-surah-link:visited,
html.dark-mode .other-surah-link:hover,
html.dark-mode .other-surah-link:active {
    color: #E3B459 !important;
}



/* أسماء السور داخل الفهرس - ذهبي في الوضع الليلي */
html.dark-mode table.quran-table a,
html.dark-mode table.quran-table a:visited,
html.dark-mode table.quran-table a:hover,
html.dark-mode table.quran-table a:focus,
html.dark-mode table.quran-table a:active {
    color: #E3B459 !important;
}





/* السورة السابقة والتالية - الوضع الليلي */
html.dark-mode .surah-nav a,
html.dark-mode .surah-nav a:visited,
html.dark-mode .surah-nav a:hover,
html.dark-mode .surah-nav a:focus,
html.dark-mode .surah-nav a:active {
    color: #E3B459 !important;
}


/* عناوين أقسام القائمة الجانبية في الوضع الليلي */
html.dark-mode .sidebar .download-quran {
    background-color: #171b24 !important;
    color: #ffffff !important;
}








html.dark-mode .sidebar .search-inner button,
html.dark-mode .search-box button {
    background-color: #1c1c1c !important;
    border-color: #1c1c1c !important;
}

html.dark-mode .sidebar .search-inner button:hover,
html.dark-mode .search-box button:hover {
    background-color: #1c1c1c !important;
    border-color: #1c1c1c !important;
}








    /* أزرار الحروف الهجائية في صفحة القراء */
    html.dark-mode .alphabet-filter button {
      background: #000000 !important;
      background-color: #000000 !important;
      color: #ffffff !important;
      border-color: #444444 !important;
    }
    html.dark-mode .alphabet-filter button:hover,
    html.dark-mode .alphabet-filter button:focus,
    html.dark-mode .alphabet-filter button.active {
      background: #000000 !important;
      background-color: #000000 !important;
      color: #ffffff !important;
      border-color: #ffffff !important;
    }

    html.dark-mode #darkModeToggle { background: #252b37; color: #fff; border-color: #414a5b; }

    @media (max-width: 600px) {
      #darkModeToggle { right: 14px; bottom: 14px; width: 48px; height: 48px; font-size: 22px; }
    }
    @media print { #darkModeToggle { display: none !important; } }
  `;
  document.head.appendChild(style);

  applyTheme(preferredTheme());

  function createToggle() {
    if (document.getElementById('darkModeToggle')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'darkModeToggle';
    document.body.appendChild(button);
    applyTheme(root.classList.contains('dark-mode') ? 'dark' : 'light');
    button.addEventListener('click', function () {
      const nextTheme = root.classList.contains('dark-mode') ? 'light' : 'dark';
      applyTheme(nextTheme);
      saveTheme(nextTheme);
    });
  }


  /* ===== قائمة الجوال العامة لجميع الصفحات ===== */
  function setupUniversalMobileMenu() {
    const navs = document.querySelectorAll('.main-nav');

    navs.forEach(function (nav, index) {
      if (nav.dataset.mobileMenuReady === '1') return;
      nav.dataset.mobileMenuReady = '1';

      const header = nav.closest('.main-header') || nav.closest('header') || nav.parentElement;
      if (!header) return;

      /* استخدم الزر الموجود إن وجد، وإلا أنشئ زرًا تلقائيًا */
      let button = header.querySelector('.mobile-menu-toggle');
      if (!button) {
        button = document.createElement('button');
        button.type = 'button';
        button.className = 'mobile-menu-toggle';
        button.innerHTML = '<span></span><span></span><span></span>';

        /* يوضع قبل القائمة مباشرة، فلا يعتمد على وجود .container */
        nav.parentNode.insertBefore(button, nav);
      }

      const navId = nav.id || ('mainMobileMenu-' + index);
      nav.id = navId;
      button.setAttribute('aria-controls', navId);
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'فتح القائمة الرئيسية');

      function setOpen(open) {
        nav.classList.toggle('mobile-menu-open', open);
        nav.classList.toggle('is-open', open); /* توافق مع الكود القديم */
        button.classList.toggle('is-open', open);
        button.setAttribute('aria-expanded', open ? 'true' : 'false');
        button.setAttribute('aria-label', open ? 'إغلاق القائمة الرئيسية' : 'فتح القائمة الرئيسية');

        if (!open) {
          nav.querySelectorAll('.dropdown').forEach(function (item) {
            item.classList.remove('mobile-dropdown-open', 'mobile-open');
          });
        }
      }

      /* يمنع تضاعف التنفيذ مع أي كود Hamburger قديم */
      button.onclick = function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const open = !(nav.classList.contains('mobile-menu-open') || nav.classList.contains('is-open'));
        setOpen(open);
      };

      nav.querySelectorAll('.dropdown > a').forEach(function (link) {
        link.onclick = function (event) {
          if (!window.matchMedia('(max-width: 900px)').matches) return;

          const item = link.parentElement;
          const alreadyOpen =
            item.classList.contains('mobile-dropdown-open') ||
            item.classList.contains('mobile-open');

          if (!alreadyOpen) {
            event.preventDefault();
            event.stopImmediatePropagation();

            nav.querySelectorAll('.dropdown').forEach(function (other) {
              if (other !== item) {
                other.classList.remove('mobile-dropdown-open', 'mobile-open');
              }
            });

            item.classList.add('mobile-dropdown-open', 'mobile-open');
          }
        };
      });

      window.addEventListener('resize', function () {
        if (window.innerWidth > 900) setOpen(false);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { createToggle(); setupUniversalMobileMenu(); }, { once: true });
  } else {
    createToggle();
    setupUniversalMobileMenu();
  }
})();
