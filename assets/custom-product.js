document.addEventListener('change', function (event) {
    const input = event.target;

    if (!input.matches('.product__option-input')) return;

    onVariantChange(event);
  });

  function onVariantChange(event) {
    // Assumes the option value picker is wrapped in a section with a class optionValueSelectors with a section-id data attribute
    const optionValueSelectors = event.target.closest('.optionValueSelectors');
    const sectionId = optionValueSelectors.dataset.sectionId;

    // Get the selected option value IDs and format as query param
    const selectedOptionValues = Array.from(optionValueSelectors.querySelectorAll('input[type="radio"]:checked')).map(
      ({ dataset }) => dataset.optionValueId
    );

    const params = selectedOptionValues.length > 0 ? `&option_values=${selectedOptionValues.join(',')}` : '';

    // Fetch the product section with the new option value selection, and replace the option value picker with the new availability state
    fetch(`${window.location.href}?section_id=${sectionId}${params}`)
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, 'text/html');

        const currentSection = document.querySelector(`#shopify-section-${sectionId}`);
        const newSection = html.querySelector(`#shopify-section-${sectionId}`);

        currentSection.innerHTML = newSection.innerHTML;
        document.dispatchEvent(new CustomEvent('product:section:updated'));
        document.querySelector(`#${event.target.id}`).focus();
      });
  }

  (function () {
    function initProductGallery() {
      const STORAGE_KEY = 'productGalleryIndex';

      const gallery = document.querySelector('.product__gallery-scroll');
      if (!gallery) return;

      // prevent double init
      if (gallery.dataset.initialized) return;
      gallery.dataset.initialized = 'true';

      const slides = gallery.querySelectorAll('.product__media-wrapper--hero');
      const dots = document.querySelectorAll('.product__gallery-dot');
      const prevBtn = document.querySelector('.product__gallery-arrow--left');
      const nextBtn = document.querySelector('.product__gallery-arrow--right');

      let scrollTimeout;

      function saveIndex(index) {
        sessionStorage.setItem(STORAGE_KEY, index);
      }

      function updateArrows(index) {
        if (prevBtn) {
          prevBtn.style.display = index === 0 ? 'none' : '';
        }

        if (nextBtn) {
          nextBtn.style.display = index === slides.length - 1 ? 'none' : '';
        }
      }

      function updateDots(index) {
        dots.forEach((d) => d.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');
      }

      function getClosestIndex() {
        let closest = 0;
        let min = Infinity;

        slides.forEach((slide, i) => {
          const dist = Math.abs(slide.offsetLeft - gallery.scrollLeft);
          if (dist < min) {
            min = dist;
            closest = i;
          }
        });

        return closest;
      }

      // snap on release
      gallery.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const index = getClosestIndex();
          gallery.scrollTo({
            left: slides[index].offsetLeft,
            behavior: 'smooth',
          });
          updateDots(index);
          updateArrows(index);
          saveIndex(index);
        }, 120);
      });

      // dots
      dots.forEach((dot) => {
        dot.addEventListener('click', () => {
          const index = Number(dot.dataset.slide);
          gallery.scrollTo({
            left: slides[index].offsetLeft,
            behavior: 'smooth',
          });
          updateDots(index);
          updateArrows(index);
          saveIndex(index);
        });
      });

      // arrows
      if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
          const index = getClosestIndex() - 1;
          if (index >= 0) {
            gallery.scrollTo({
              left: slides[index].offsetLeft,
              behavior: 'smooth',
            });
            updateDots(index);
            updateArrows(index);
            saveIndex(index);
          }
        });

        nextBtn.addEventListener('click', () => {
          const index = getClosestIndex() + 1;
          if (index < slides.length) {
            gallery.scrollTo({
              left: slides[index].offsetLeft,
              behavior: 'smooth',
            });
            updateDots(index);
            updateArrows(index);
            saveIndex(index);
          }
        });
      }
      const savedIndex = Number(sessionStorage.getItem(STORAGE_KEY)) || 0;

      requestAnimationFrame(() => {
        gallery.scrollTo({
          left: slides[savedIndex]?.offsetLeft || 0,
          behavior: 'auto',
        });

        updateDots(savedIndex);
        updateArrows(savedIndex);
      });
    }

    // init on first load
    document.addEventListener('DOMContentLoaded', initProductGallery);

    // 🔥 re-init after AJAX section swap
    document.addEventListener('product:section:updated', () => {
      // reset flag in case HTML was replaced
      const gallery = document.querySelector('.product__gallery-scroll');
      if (gallery) delete gallery.dataset.initialized;

      initProductGallery();
    });
  })();

  (function () {
    // Map to store persistence per wrapper (keyed by wrapper ID)
    const wrapperPersistence = new Map();

    /**
     * Sync custom UI to match native select
     */
    function syncCustomSelectFromNative(wrapper) {
      const select = wrapper.querySelector('.js-native-select');
      const custom = wrapper.querySelector('.custom-select');
      if (!select || !custom) return;

      const selectedOption = select.options[select.selectedIndex];
      if (!selectedOption) return;

      const value = selectedOption.value;

      const customOption = custom.querySelector(`.custom-select__option[data-value="${CSS.escape(value)}"]`);
      if (!customOption) return;

      const selected = custom.querySelector('.custom-select__selected');
      const valueSpan = selected.querySelector('.custom-select__value');
      const priceSpan = selected.querySelector('.custom-select__price');
      const shippingSpan = selected.querySelector('.custom-select__shipping');

      const optionValue = customOption.querySelector('.option-value');
      const optionPrice = customOption.querySelector('.option-price');
      const optionShipping = customOption.querySelector('.option-shipping');

      if (optionValue) valueSpan.textContent = optionValue.textContent;
      if (optionPrice) priceSpan.textContent = optionPrice.textContent;
      if (optionShipping) shippingSpan.innerHTML = optionShipping.innerHTML;

      // mark selected visually
      custom.querySelectorAll('.custom-select__option').forEach((opt) => {
        opt.classList.toggle('is-selected', opt === customOption);
      });
    }

    /**
     * Restore native select based on stored persistence
     */
    function restoreByPersistenceCode(wrapper) {
      const wrapperId = wrapper.id;
      if (!wrapperId) return;

      const code = wrapperPersistence.get(wrapperId);
      if (!code) return;

      const select = wrapper.querySelector('.js-native-select');
      if (!select) return;

      const option = select.querySelector(`option[data-persistence-code="${code}"]`);
      if (!option) return;

      select.value = option.value;
    }

    /**
     * Initialize all custom selects
     */
    function initCustomSelects() {
      const wrappers = document.querySelectorAll('.custom-select-wrapper');

      wrappers.forEach((wrapper, index) => {
        // Ensure wrapper has a unique ID
        if (!wrapper.id) {
          wrapper.id = 'custom-select-' + index;
        }

        if (wrapper.dataset.initialized) return;
        wrapper.dataset.initialized = 'true';

        const select = wrapper.querySelector('.js-native-select');
        const custom = wrapper.querySelector('.custom-select');
        const selected = custom.querySelector('.custom-select__selected');
        const dropdown = custom.querySelector('.custom-select__dropdown');

        const valueSpan = selected.querySelector('.custom-select__value');
        const priceSpan = selected.querySelector('.custom-select__price');
        const shippingSpan = selected.querySelector('.custom-select__shipping');

        // Toggle dropdown
        selected.addEventListener('click', (e) => {
          e.stopPropagation();
          document.querySelectorAll('.custom-select__dropdown.open').forEach((d) => d.classList.remove('open'));
          dropdown.classList.toggle('open');
        });

        // Option click
        custom.querySelectorAll('.custom-select__option').forEach((option) => {
          option.addEventListener('click', (e) => {
            e.stopPropagation();

            // store selection in Map by wrapper ID
            wrapperPersistence.set(wrapper.id, option.dataset.persistenceCode);

            // update native select
            select.value = option.dataset.value;

            // update custom UI
            const optionValue = option.querySelector('.option-value');
            const optionPrice = option.querySelector('.option-price');
            const optionShipping = option.querySelector('.option-shipping');

            if (optionValue) valueSpan.textContent = optionValue.textContent;
            if (optionPrice) priceSpan.textContent = optionPrice.textContent;
            if (optionShipping) shippingSpan.innerHTML = optionShipping.innerHTML;

            dropdown.classList.remove('open');

            select.dispatchEvent(new Event('change', { bubbles: true }));
          });
        });

        // Restore selection & sync UI
        restoreByPersistenceCode(wrapper);
        syncCustomSelectFromNative(wrapper);
      });
    }

    // Close dropdowns on outside click
    document.addEventListener('click', () => {
      document.querySelectorAll('.custom-select__dropdown.open').forEach((d) => d.classList.remove('open'));
    });

    // Init on page load
    document.addEventListener('DOMContentLoaded', initCustomSelects);

    // Re-init after Shopify AJAX section reload
    document.addEventListener('product:section:updated', () => {
      document.querySelectorAll('.custom-select-wrapper').forEach((wrapper) => {
        delete wrapper.dataset.initialized; // allow re-init
      });
      initCustomSelects();
    });
  })();

  function updateAllOverlays() {
    const selects = document.querySelectorAll('.js-native-select');
    const overlays = document.querySelectorAll('.overlay');

    // Get all currently selected values
    const selectedRefs = Array.from(selects)
      .map((sel) => sel.value)
      .filter((val) => val); // remove empty values

    overlays.forEach((img) => {
      // Show if this overlay is selected in any select
      img.classList.toggle('hidden', !selectedRefs.includes(img.dataset.wallReference));
    });
  }

  // Attach to all selects
  document.querySelectorAll('.js-native-select').forEach((select) => {
    select.addEventListener('change', updateAllOverlays);
  });

  // Initial run
  updateAllOverlays();
  document.addEventListener('product:section:updated', (event) => {
    const section = event.target;
    section.querySelectorAll('.js-native-select').forEach((select) => {
      select.removeEventListener('change', updateAllOverlays);
      select.addEventListener('change', updateAllOverlays);
    });
    updateAllOverlays();
  });

  /// Make QuantityState global to persist across AJAX
  window.QuantityState = window.QuantityState || { value: 1 };

  // --- Save quantity before AJAX reload ---
  document.addEventListener('change', (e) => {
    if (e.target.matches('.quantity__input')) {
      window.QuantityState.value = parseInt(e.target.value, 10) || 1;
    }
  });

  // --- Initialize product form ---
  function initProductForm() {
    const form = document.querySelector('form[action^="/cart"]');
    if (!form) return;

    // --- 1. Restore tent quantity ---
    const qtyInput = document.querySelector('.quantity__input');
    if (qtyInput) {
      qtyInput.value = window.QuantityState.value;

      // Bind multiplier
      qtyInput.oninput = null;
      qtyInput.onchange = null;
      qtyInput.addEventListener('input', syncAllFormQtys);
      qtyInput.addEventListener('change', syncAllFormQtys);
    }

    // --- 2. Create/update configured products ---
    updateConfiguredProducts();

    // --- 3. Sync all quantities ---
    syncAllFormQtys();

    updateDisplayedPrice();
  }

  // --- Sync all form-qty inputs ---
  function syncAllFormQtys() {
    const qtyInput = document.querySelector('.quantity__input');
    if (!qtyInput) return;

    window.QuantityState.value = parseInt(qtyInput.value, 10) || 1;

    document.querySelectorAll('.form-qty').forEach((input) => {
      const base = parseInt(input.dataset.base, 10) || 1;
      input.value = base * window.QuantityState.value;
    });
  }

  // --- Update configured products dynamically ---
  function updateConfiguredProducts() {
    const form = document.querySelector('form[action^="/cart"]');
    if (!form) return;

    // Remove old configured inputs
    form.querySelectorAll('.configured-item').forEach((el) => el.remove());

    const selects = document.querySelectorAll('.product__configuration-select');
    const variantCount = {};

    selects.forEach((select) => {
      const option = select.selectedOptions[0];
      if (!option) return;
      const variantId = option.dataset.variantId;
      if (!variantId) return;
      variantCount[variantId] = (variantCount[variantId] || 0) + 1;
    });

    // 👉 ANKER: vor items[0][id] einfügen
    const anchor = form.querySelector('input[name="items[0][id]"]');
    if (!anchor) return;

    let index = 1; // 0 = base tent

    for (const [variantId, count] of Object.entries(variantCount)) {
      const inputId = document.createElement('input');
      inputId.type = 'hidden';
      inputId.name = `items[${index}][id]`;
      inputId.value = variantId;
      inputId.classList.add('configured-item');

      const inputQty = document.createElement('input');
      inputQty.type = 'hidden';
      inputQty.name = `items[${index}][quantity]`;
      inputQty.value = count;
      inputQty.dataset.base = count;
      inputQty.classList.add('form-qty', 'configured-item');

      const inputParent = document.createElement('input');
      inputParent.type = 'hidden';
      inputParent.name = `items[${index}][parent_id]`;
      inputParent.value = anchor.value;
      inputParent.classList.add('configured-item');

      anchor.insertAdjacentElement('beforebegin', inputId);
      anchor.insertAdjacentElement('beforebegin', inputQty);
      anchor.insertAdjacentElement('beforebegin', inputParent);

      index++;
    }
  }

  // --- Event listeners ---
  document.addEventListener('DOMContentLoaded', initProductForm);
  document.addEventListener('product:section:updated', initProductForm);
  document.addEventListener('change', (e) => {
    if (e.target.matches('.product__configuration-select')) {
      initProductForm();
    }
  });

  function updateDisplayedPrice() {
    const priceEl = document.querySelector('.product__price[data-variant-price]');
    const stickyPrice = document.querySelector('.product__stickybar--price-current');
    if (!priceEl) return;

    // Base tent price in cents
    let total = parseInt(priceEl.dataset.variantPrice, 10) || 0;

    // Add prices of selected configuration options (ignore quantity)
    document.querySelectorAll('.product__configuration-select').forEach((select) => {
      const option = select.selectedOptions[0];
      if (!option) return;
      const priceCents = parseInt(option.dataset.variantPrice, 10) || 0;
      total += priceCents;
    });

    // Format with Shopify locale/currency
    priceEl.textContent = formatCurrency(total / 100);
    stickyPrice.textContent = formatCurrency(total / 100);
  }

  function formatCurrency(value) {
    const currency = Shopify.currency.active; // "EUR"

    // Format the number part using your locale for decimal/separator
    const locale = Shopify.locale || 'de-DE';
    const numberFormatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

    // Prepend currency symbol
    return currency === 'EUR' ? '€' + numberFormatted : numberFormatted + ' ' + currency;
  }

  (function () {
    const mq = window.matchMedia('(min-width: 990px)');
    let raf = 0;

    function getStickyTopOffset() {
      const siteHeader = document.querySelector('.header-wrapper, .shopify-section-header, header');
      if (!siteHeader) return 0;

      const pos = getComputedStyle(siteHeader).position;
      const isStickyOrFixed = pos === 'sticky' || pos === 'fixed';
      return isStickyOrFixed ? Math.round(siteHeader.getBoundingClientRect().height) : 0;
    }

    function update() {
      raf = 0;
      if (!mq.matches) return;

      const bar = document.querySelector('[data-sticky-bar]');
      const startEl = document.querySelector('[data-sticky-start]');
      const compactEl = document.querySelector('[data-sticky-compact]');
      const endEl = document.querySelector('[data-sticky-end]');
      if (!bar || !startEl || !compactEl || !endEl) return;

      const offset = getStickyTopOffset();
      bar.style.setProperty('--stickybar-top', offset + 'px');

      // ACTIVE: passed top line logic (reliable with direct rect reads)
      const startPassed = startEl.getBoundingClientRect().top < offset;
      const endPassed = endEl.getBoundingClientRect().top < offset;
      const active = startPassed && !endPassed;

      bar.classList.toggle('is-active', active);
      bar.setAttribute('aria-hidden', active ? 'false' : 'true');

      // COMPACT: use viewport-bottom trigger with hysteresis
      if (!active) {
        bar.classList.remove('is-compact');
        return;
      }

      const vh = window.innerHeight || document.documentElement.clientHeight;
      const top = compactEl.getBoundingClientRect().top;

      // hysteresis: prevents flicker when hovering around the line
      const ENTER = vh - 8; // compact turns ON when sentinel is within 8px of bottom
      const LEAVE = vh + 16; // compact turns OFF only after it moves away

      const isCompact = bar.classList.contains('is-compact');

      if (!isCompact && top <= ENTER) bar.classList.add('is-compact');
      else if (isCompact && top > LEAVE) bar.classList.remove('is-compact');
    }

    function requestUpdate() {
      if (raf) return;
      raf = requestAnimationFrame(update);
    }

    function init() {
      // run once to set correct initial state (loads mid-scroll / anchor)
      requestUpdate();

      // scroll is needed for compact reliability
      window.addEventListener('scroll', requestUpdate, { passive: true });
      window.addEventListener('resize', requestUpdate);

      document.addEventListener('product:section:updated', requestUpdate);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }

    // handle breakpoint changes
    if (mq.addEventListener) mq.addEventListener('change', requestUpdate);
    else mq.addListener(requestUpdate);
  })();
  (function () {
    let activeFetchController = null;

    function getSectionIdFromEl(el) {
      const wrapper = el.closest('[id^="shopify-section-"]');
      if (!wrapper) return null;
      return wrapper.id.replace('shopify-section-', '');
    }

    async function swapProductSection(productUrl, triggerEl, { pushState = true } = {}) {
      const sectionId = getSectionIdFromEl(triggerEl);
      if (!sectionId) return;

      // abort previous request (prevents race conditions on fast clicks)
      if (activeFetchController) activeFetchController.abort();
      activeFetchController = new AbortController();

      // build URL: /products/xxx?section_id=SECTIONID (keep existing query if any)
      const url = new URL(productUrl, window.location.origin);
      url.searchParams.set('section_id', sectionId);

      const res = await fetch(url.toString(), {
        credentials: 'same-origin',
        signal: activeFetchController.signal,
      });

      if (!res.ok) throw new Error(`Product switch failed: ${res.status}`);
      const htmlText = await res.text();

      const doc = new DOMParser().parseFromString(htmlText, 'text/html');

      const currentSection = document.querySelector(`#shopify-section-${CSS.escape(sectionId)}`);
      const newSection = doc.querySelector(`#shopify-section-${CSS.escape(sectionId)}`);

      if (!currentSection || !newSection) return;

      // Replace section content
      currentSection.innerHTML = newSection.innerHTML;

      // Update URL + title (so your existing variant fetch uses correct product URL)
      if (pushState) {
        history.pushState({ productUrl }, '', productUrl);
      }
      const newTitle = doc.querySelector('title')?.textContent;
      if (newTitle) document.title = newTitle;

      // Mark active tab in the *new* DOM
      const pathname = new URL(productUrl, window.location.origin).pathname;
      document.querySelectorAll('.product__tabnav--item').forEach((li) => li.classList.remove('is-active'));
      document.querySelectorAll('.product__tabnav--btn').forEach((btn) => {
        try {
          const btnPath = new URL(btn.dataset.productUrl, window.location.origin).pathname;
          if (btnPath === pathname) btn.closest('.product__tabnav--item')?.classList.add('is-active');
        } catch (e) {}
      });

      // Re-init everything you already wired to this event
      document.dispatchEvent(new CustomEvent('product:section:updated'));
    }

    // Click handler (event delegation survives section swaps)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-product-switcher] [data-product-url]');
      if (!btn) return;

      e.preventDefault();
      const productUrl = btn.dataset.productUrl;
      if (!productUrl) return;

      swapProductSection(productUrl, btn).catch(console.error);
    });

    // Back/forward support
    window.addEventListener('popstate', () => {
      swapProductSection(window.location.href, document.body, { pushState: false }).catch(() => {
        // fallback hard reload if something goes wrong
        window.location.reload();
      });
    });
  })();