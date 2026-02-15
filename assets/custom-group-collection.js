document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = Array.from(
      document.querySelectorAll('.category__filter--option input[type="checkbox"][name="type"]')
    );
    const categories = Array.from(document.querySelectorAll('.category__group[data-type]'));
    const countEl = document.querySelector('.category__filter--count');
    const resetBtn = document.querySelector('.category__filter--reset');

    if (!checkboxes.length || !categories.length) return;

    const applyFilter = () => {
      const checked = checkboxes.filter((cb) => cb.checked);
      const selectedValues = new Set(checked.map((cb) => cb.value));

      // Wenn nichts ausgewählt: alles anzeigen
      const showAll = selectedValues.size === 0;

      categories.forEach((cat) => {
        const type = cat.getAttribute('data-type');
        const shouldShow = showAll || selectedValues.has(type);
        cat.classList.toggle('is-hidden', !shouldShow);
      });

      // Counter (Typ (n))
      if (countEl) {
        if (checked.length > 0) {
          countEl.textContent = `(${checked.length})`;
          countEl.hidden = false;
        } else {
          countEl.hidden = true;
        }
      }

      // Reset Button nur zeigen, wenn mind. 1 Filter aktiv ist
      if (resetBtn) {
        resetBtn.classList.toggle('hidden', checked.length === 0);
      }
    };

    // Reset: alle Checkboxen aus + Filter neu anwenden
    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // verhindert details-toggle durch summary

        checkboxes.forEach((cb) => {
          cb.checked = false;
        });
        applyFilter();
      });
    }

    // initial
    applyFilter();

    // Änderungen
    checkboxes.forEach((cb) => cb.addEventListener('change', applyFilter));
  });