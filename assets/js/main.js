//START
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    })
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('body').classList.toggle('mobile-nav-active')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scroll with offset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let body = select('body')
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with offset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Hero type effect (re-created whenever the language changes)
   */
  const typedEl = select('.typed')
  let typedInstance = null
  const startTyped = (items) => {
    if (!typedEl || typeof Typed === 'undefined') return
    if (typedInstance) {
      typedInstance.destroy()
      typedInstance = null
    }
    typedEl.textContent = ''
    typedInstance = new Typed('.typed', {
      strings: items,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    })
  }

  /**
   * Language switcher (English / Persian)
   */
  const FA = window.I18N_FA || {}
  const mainEl = select('#main')
  const langBtn = select('#lang-toggle')
  const langLabel = select('#lang-toggle-label')
  const enTyped = typedEl ? typedEl.getAttribute('data-typed-items') : ''
  const enTitle = document.title
  const i18nEls = select('[data-i18n]', true)

  // Remember the original English markup so we can switch back
  i18nEls.forEach(el => { el.dataset.en = el.innerHTML })

  const applyLang = (lang) => {
    const fa = lang === 'fa'

    document.documentElement.lang = fa ? 'fa' : 'en'
    document.body.classList.toggle('lang-fa', fa)
    if (mainEl) mainEl.setAttribute('dir', fa ? 'rtl' : 'ltr')

    i18nEls.forEach(el => {
      const key = el.dataset.i18n
      el.innerHTML = (fa && FA[key] !== undefined) ? FA[key] : el.dataset.en
    })

    document.title = (fa && FA['meta.title']) ? FA['meta.title'] : enTitle
    if (langLabel) langLabel.textContent = fa ? 'English' : 'فارسی'

    const typedItems = (fa && FA['hero.typed']) ? FA['hero.typed'] : enTyped
    startTyped(typedItems.split(',').map(s => s.trim()))

    try { localStorage.setItem('lang', lang) } catch (e) {}
  }

  if (langBtn) {
    langBtn.addEventListener('click', () => {
      applyLang(document.documentElement.lang === 'fa' ? 'en' : 'fa')
    })
  }

  // Initial language: ?lang=fa  >  saved choice  >  English
  let initialLang = 'en'
  try {
    const q = new URLSearchParams(window.location.search).get('lang')
    const saved = localStorage.getItem('lang')
    if (q === 'fa' || q === 'en') initialLang = q
    else if (saved === 'fa' || saved === 'en') initialLang = saved
  } catch (e) {}
  applyLang(initialLang)

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

})()
