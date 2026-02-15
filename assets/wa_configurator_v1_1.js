document.addEventListener("DOMContentLoaded", function () {
  let productData = {};
  let quantity = 0;
  let selectedProduct = null;
  let formItems = [];
  let fixCost = 0;
  let selectedValidationServicePrice = 0;
  let selectedGraphicServicePrice = 0;
  let selectedVariantsBasePrice = 0;
  let selectedVariantsPrice = 0;

  const selectors = {
    printAreasButtonSelector:
      ".customization__button[data-section='print-area']",
    printMethodsButtonSelector:
      ".customization__button[data-section='print-method']",
    variantsButtonSelector: ".customization__button[data-section='variant']",
    uploadChoiceButtonSelector:
      ".customization__button[data-section='upload-choices']",
    fileUploadButtonSelector:
      ".customization__file[data-section='file-upload']",
    validationServiceButtonSelector:
      ".customization__button[data-section='validation-services']",
    graphicServiceButtonSelector:
      ".customization__button[data-section='graphic-services']",

    printAreaProgressCircleSelector:
      ".customization__progressbar-circle[data-section='print-area']",
    printMethodProgressCircleSelector:
      ".customization__progressbar-circle[data-section='print-method']",
    uploadChoicesProgressCircleSelector:
      ".customization__progressbar-circle[data-section='upload-choices']",
    fileUploadProgressCircleSelector:
      ".customization__progressbar-circle[data-section='file-upload']",
    validationServicesProgressCircleSelector:
      ".customization__progressbar-circle[data-section='validation-services']",
    graphicServicesProgressCircleSelector:
      ".customization__progressbar-circle[data-section='graphic-services']",

    printAreaProgressRectangleSelector:
      ".customization__progressbar-rectangle[data-section='print-area']",
    printMethodProgressRectangleSelector:
      ".customization__progressbar-rectangle[data-section='print-method']",
    uploadChoicesProgressRectangleSelector:
      ".customization__progressbar-rectangle[data-section='upload-choices']",
    fileUploadProgressRectangleSelector:
      ".customization__progressbar-rectangle[data-section='file-upload']",
    validationServicesProgressRectangleSelector:
      ".customization__progressbar-rectangle[data-section='validation-services']",
    graphicServicesProgressRectangleSelector:
      ".customization__progressbar-rectangle[data-section='graphic-services']",

    printMethodCustomizationSectionSelector:
      ".customization__section[data-section='print-method']",
    uploadChoicesCustomizationSectionSelector:
      ".customization__section[data-section='upload-choices']",
    fileUploadCustomizationSectionSelector:
      ".customization__section[data-section='file-upload']",
    validationServiceCustomizationSectionSelector:
      ".customization__section[data-section='validation-services']",
    graphicServicesCustomizationSectionSelector:
      ".customization__section[data-section='graphic-services']",

    printCustomizationCompletedSelector:
      ".customization__completed[data-section='print']",
    fileCustomizationCompletedSelector:
      ".customization__completed[data-section='file']",

    printAreaCustomizationOptionSelector: ".customization__option",
    printAreaCustomizationOptionLabelSelector: ".customization__option-label",

    customizationSummarySelector: ".customization__summary",
    customizationSummaryImagesSelector: ".customization__summary-images",

    summaryOptionsSelector: "[data-summary-handle]",

    uploadButtonsSelector: ".upload-wrapper",
    addUploadButtonSelector: ".customization__add-upload",
    deleteUploadButtonSelector: ".customization__remove-upload",

    quantityInputSelector: 'input[name="quantity"]',
    productDataScriptSelector: "#configurator-product-data",
    setupDataScriptSelector: "#configurator-product-setup",
    selectedValidationServiceSelector:
      ".customization__button[data-section='validation-services']:checked",
    selectedGraphicServiceSelector:
      ".customization__button[data-section='graphic-services']:checked",
    selectedVariantsSelector:
      ".customization__button[data-section='variant']:checked",

    quantityButtonSelector: ".qty-selector__button",

    grossUnitPriceSelector: ".price",
    grossTotalPriceSelector: ".pricing__gross-total",
    netTotalPriceSelector: ".pricing__net-total",
    netUnitPriceSelector: ".pricing__net-unit",
    netTotalDiscountSelector: ".pricing__net-discount",

    variantsWrapperSelector: ".variants-wrapper",
  };

  const elements = {
    printAreasElement: document.querySelectorAll(
      selectors.printAreasButtonSelector
    ),
    printMethodsElement: document.querySelectorAll(
      selectors.printMethodsButtonSelector
    ),
    variantsElement: document.querySelectorAll(
      selectors.variantsButtonSelector
    ),
    uploadChoicesElement: document.querySelectorAll(
      selectors.uploadChoiceButtonSelector
    ),
    fileUploadButtonElement: document.querySelector(
      selectors.fileUploadButtonSelector
    ),
    validationServicesElement: document.querySelectorAll(
      selectors.validationServiceButtonSelector
    ),
    graphicServicesElement: document.querySelectorAll(
      selectors.graphicServiceButtonSelector
    ),

    printAreaProgressCircleElement: document.querySelector(
      selectors.printAreaProgressCircleSelector
    ),
    printMethodProgressCircleElement: document.querySelector(
      selectors.printMethodProgressCircleSelector
    ),
    uploadChoicesProgressCircleElement: document.querySelector(
      selectors.uploadChoicesProgressCircleSelector
    ),
    fileUploadProgressCircleElement: document.querySelector(
      selectors.fileUploadProgressCircleSelector
    ),
    validationServicesProgressCircleElement: document.querySelector(
      selectors.validationServicesProgressCircleSelector
    ),
    graphicServicesProgressCircleElement: document.querySelector(
      selectors.graphicServicesProgressCircleSelector
    ),

    printAreaProgressRectangleElement: document.querySelector(
      selectors.printAreaProgressRectangleSelector
    ),
    printMethodProgressRectangleElement: document.querySelector(
      selectors.printMethodProgressRectangleSelector
    ),
    uploadChoicesProgressRectangleElement: document.querySelector(
      selectors.uploadChoicesProgressRectangleSelector
    ),
    fileUploadProgressRectangleElement: document.querySelector(
      selectors.fileUploadProgressRectangleSelector
    ),
    validationServicesProgressRectangleElement: document.querySelector(
      selectors.validationServicesProgressRectangleSelector
    ),
    graphicServicesProgressRectangleElement: document.querySelector(
      selectors.graphicServicesProgressRectangleSelector
    ),

    printMethodCustomizationSectionElement: document.querySelector(
      selectors.printMethodCustomizationSectionSelector
    ),
    uploadChoicesCustomizationSectionElement: document.querySelector(
      selectors.uploadChoicesCustomizationSectionSelector
    ),
    fileUploadCustomizationSectionElement: document.querySelector(
      selectors.fileUploadCustomizationSectionSelector
    ),
    validationServiceCustomizationSectionElement: document.querySelector(
      selectors.validationServiceCustomizationSectionSelector
    ),
    graphicServiceCustomizationSectionElement: document.querySelector(
      selectors.graphicServicesCustomizationSectionSelector
    ),

    printCustomizationCompletedElement: document.querySelector(
      selectors.printCustomizationCompletedSelector
    ),
    fileCustomizationCompletedElement: document.querySelector(
      selectors.fileCustomizationCompletedSelector
    ),

    printAreaCustomizationOptionElement: document.querySelectorAll(
      selectors.printAreaCustomizationOptionSelector
    ),

    customizationSummaryElement: document.querySelector(
      selectors.customizationSummarySelector
    ),
    customizationSummaryImagesElement: document.querySelector(
      selectors.customizationSummaryImagesSelector
    ),

    addUploadButtonElement: document.querySelector(
      selectors.addUploadButtonSelector
    ),
    deleteUploadButtonElement: document.querySelector(
      selectors.deleteUploadButtonSelector
    ),

    quantityInput: document.querySelector(selectors.quantityInputSelector),
    productDataScriptElement: document.querySelector(
      selectors.productDataScriptSelector
    ),
    setupDataScriptElement: document.querySelector(
      selectors.setupDataScriptSelector
    ),

    quantityButtons: document.querySelectorAll(
      selectors.quantityButtonSelector
    ),
    grossUnitPriceElement: document.querySelector(
      selectors.grossUnitPriceSelector
    ),
    grossTotalPriceElement: document.querySelector(
      selectors.grossTotalPriceSelector
    ),
    netTotalPriceElement: document.querySelector(
      selectors.netTotalPriceSelector
    ),
    netUnitPriceElement: document.querySelector(selectors.netUnitPriceSelector),
    netTotalDiscountElement: document.querySelector(
      selectors.netTotalDiscountSelector
    ),

    variantsWrapperElement: document.querySelectorAll(
      selectors.variantsWrapperSelector
    ),
  };

  const state = {
    selectedAreas: new Set(),
    selectedPrintMethods: new Set(),
    selectedVariants: new Set(),
    selectedUploadChoices: new Set(),
    selectedValidationService: new Set(),
    selectedGraphicService: new Set(),
  };

  const toggleHidden = (el, condition) => {
    if (el) el.classList.toggle("hidden", !condition); // condition=true remove hidden
  };

  const showSections = (
    showUploadSection,
    showValidationSection,
    showGraphicSection
  ) => {
    toggleHidden(
      elements.fileUploadCustomizationSectionElement,
      showUploadSection
    );
    toggleHidden(
      elements.validationServiceCustomizationSectionElement,
      showValidationSection
    );
    toggleHidden(
      elements.graphicServiceCustomizationSectionElement,
      showGraphicSection
    );
  };

  const toggleActive = (el, condition) => {
    if (el) el.classList.toggle("active", condition); // condition=true add active
  };

  const toggleActivePair = (el1, el2, condition) => {
    toggleActive(el1, condition);
    toggleActive(el2, condition);
  };

  const toggleActiveBlue = (el, condition) => {
    if (el) el.classList.toggle("active-blue", condition); // condition=true add active
  };

  const toggleActivePairBlue = (el1, el2, condition) => {
    toggleActiveBlue(el1, condition);
    toggleActiveBlue(el2, condition);
  };

  const safeParseJSON = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return {};
    }
  };

  function getQuantity() {
    const quantityInput = document.querySelector(
      selectors.quantityInputSelector
    );
    return quantityInput ? parseInt(quantityInput.value, 10) : 1;
  }

  function getVariantForQuantity(variantsData, quantity) {
    const tiers = Object.keys(variantsData)
      .map(Number)
      .sort((a, b) => a - b);

    let selected = null;

    for (const tier of tiers) {
      if (quantity >= tier) {
        selected = variantsData[tier];
      } else {
        break;
      }
    }

    return selected;
  }

  function getVariantForQuantityRoundUp(variantsData, quantity) {
    const tiers = Object.keys(variantsData)
      .map(Number)
      .sort((a, b) => a - b);

    for (const tier of tiers) {
      if (quantity <= tier) {
        return variantsData[tier];
      }
    }
    // Optional: return highest tier if quantity exceeds all tiers
    return variantsData[tiers[tiers.length - 1]];
  }

  function formatCurrency(value) {
    const currency = Shopify.currency.active;
    const locale = Shopify.locale;

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(value);
  }

  async function submitLineItems(lineItems) {
    for (const item of lineItems) {
      const properties = item.properties || {};
      if (Object.values(properties).some((v) => v instanceof File)) {
        // Use FormData if any property is a File
        const formData = new FormData();
        formData.append("id", item.id);
        formData.append("quantity", item.quantity);

        // Append properties (text or files)
        for (const [key, val] of Object.entries(item.properties)) {
          if (val instanceof File) {
            formData.append(`properties[${key}]`, val, val.name);
          } else {
            formData.append(`properties[${key}]`, val);
          }
        }

        await fetch("/cart/add.js", { method: "POST", body: formData });
      } else {
        // No files — safe to send JSON
        await fetch("/cart/add.js", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: [
              {
                id: item.id,
                quantity: item.quantity,
                properties: item.properties,
              },
            ],
          }),
        });
      }
    }
  }

  function createFormData() {
    formItems = [];
    quantity = getQuantity();
    fixCost = 0;

    const selectedValidationServiceElement = document.querySelector(
      selectors.selectedValidationServiceSelector
    );

    if (selectedValidationServiceElement) {
      const selectedValidationServiceID =
        selectedValidationServiceElement.dataset.id;
      formItems.push({
        id: selectedValidationServiceID,
        quantity: 1,
      });
    }

    const selectedGraphicServiceElement = document.querySelector(
      selectors.selectedGraphicServiceSelector
    );

    if (selectedGraphicServiceElement) {
      const selectedGraphicServiceID = selectedGraphicServiceElement.dataset.id;
      formItems.push({
        id: selectedGraphicServiceID,
        quantity: 1,
      });
    }

    const selectedVariantsElement = document.querySelectorAll(
      selectors.selectedVariantsSelector
    );

    if (selectedVariantsElement) {
      for (const variant of selectedVariantsElement) {
        const variantScriptID = variant.dataset.script;
        const loadScript = document.querySelector(`#${variantScriptID}`);

        if (loadScript) {
          const variantsData = safeParseJSON(loadScript.textContent);
          const selectedVariant = getVariantForQuantity(variantsData, quantity);
          const baseVariant = getVariantForQuantity(variantsData, 1);
          variantDataSavingsProperty = 0;
          variantDataSavingsProperty =
            (baseVariant.price - selectedVariant.price) * quantity;
          const properties = {
            _variants_data: JSON.stringify(variantsData),
          };
          if (variantDataSavingsProperty > 0) {
            variantDataSavingsProperty = variantDataSavingsProperty / 100;
            variantDataSavingsProperty = formatCurrency(
              variantDataSavingsProperty
            );
            properties[
              "Rabatt für Großabnehmer"
            ] = `(-${variantDataSavingsProperty})`;
          }
          fixCost += selectedVariant.setup;
          formItems.push({
            id: selectedVariant.id,
            quantity: quantity,
            properties: properties,
          });
        }
      }
    }

    if (selectedVariantsElement && fixCost > 0) {
      if (elements.setupDataScriptElement) {
        setupData = safeParseJSON(elements.setupDataScriptElement.textContent);
        fixCostinEuro = fixCost / 100;
        selectedFixCostVariant = getVariantForQuantityRoundUp(
          setupData,
          fixCostinEuro
        );
        formItems.push({
          id: selectedFixCostVariant.id,
          quantity: 1,
        });
      }
    }

    if (elements.productDataScriptElement) {
      const fileInputs = document.querySelectorAll(
        'input[type="file"][name^="properties["]'
      );
      const storedGclid = localStorage.getItem("gclid");
      productData = safeParseJSON(
        elements.productDataScriptElement.textContent
      );
      baseProduct = getVariantForQuantity(productData, 1);
      selectedProduct = getVariantForQuantity(productData, quantity);
      productDataSavingsProperty = 0;
      productDataSavingsProperty =
        (baseProduct.price - selectedProduct.price) * quantity;
      const properties = {
        _variants_data: JSON.stringify(productData),
      };
      if (storedGclid) {
        properties["_gclid"] = storedGclid;
      }
      if (productDataSavingsProperty > 0) {
        productDataSavingsProperty = productDataSavingsProperty / 100;
        productDataSavingsProperty = formatCurrency(productDataSavingsProperty);
        properties[
          "Rabatt für Großabnehmer"
        ] = `(-${productDataSavingsProperty})`;
      }
      fileInputs.forEach((input) => {
        if (input.files.length > 0) {
          const propName = input.name.replace(/^properties\[|\]$/g, "");
          properties[propName] = input.files[0];
        }
      });
      formItems.push({
        id: selectedProduct.id,
        quantity: quantity,
        properties: properties,
      });
    }
  }

  const updatePrice = () => {
    selectedValidationServicePrice = 0;
    selectedGraphicServicePrice = 0;
    selectedVariantsBasePrice = 0;
    selectedVariantsPrice = 0;
    let selectedFixCostVariant = { price: 0 };
    fixCost = 0;

    quantity = getQuantity();

    const selectedValidationServiceElement = document.querySelector(
      selectors.selectedValidationServiceSelector
    );
    const selectedGraphicServiceElement = document.querySelector(
      selectors.selectedGraphicServiceSelector
    );
    const selectedVariantsElement = document.querySelectorAll(
      selectors.selectedVariantsSelector
    );

    if (elements.productDataScriptElement) {
      productData = safeParseJSON(
        elements.productDataScriptElement.textContent
      );
    }
    if (selectedVariantsElement) {
      for (const variant of selectedVariantsElement) {
        const variantScriptID = variant.dataset.script;
        const loadScript = document.querySelector(`#${variantScriptID}`);

        if (loadScript) {
          const variantsData = safeParseJSON(loadScript.textContent);
          const selectedVariant = getVariantForQuantity(variantsData, quantity);
          const baseVariant = getVariantForQuantity(variantsData, 1);
          selectedVariantsPrice += selectedVariant.price;
          selectedVariantsBasePrice += baseVariant.price;
          fixCost += selectedVariant.setup;
        }
      }
    }
    if (selectedGraphicServiceElement) {
      selectedGraphicServicePrice = parseFloat(
        selectedGraphicServiceElement.dataset.price
      );
    }
    if (selectedValidationServiceElement) {
      selectedValidationServicePrice = parseFloat(
        selectedValidationServiceElement.dataset.price
      );
    }

    if (fixCost > 0) {
      if (elements.setupDataScriptElement) {
        setupData = safeParseJSON(elements.setupDataScriptElement.textContent);
        fixCostinEuro = fixCost / 100;
        selectedFixCostVariant = getVariantForQuantityRoundUp(
          setupData,
          fixCostinEuro
        );
      }
    }

    baseProduct = getVariantForQuantity(productData, 1);
    selectedProduct = getVariantForQuantity(productData, quantity);

    fixCostGross = selectedFixCostVariant.price ?? 0;
    fixCostNet = fixCostGross / 1.19;

    validationServicePriceGross = selectedValidationServicePrice;
    validationServicePriceNet = validationServicePriceGross / 1.19;

    graphicServicePriceGross = selectedGraphicServicePrice;
    graphicServicePriceNet = graphicServicePriceGross / 1.19;

    unitVariantsBasePriceGross = selectedVariantsBasePrice;
    unitVariantsBasePriceNet = unitVariantsBasePriceGross / 1.19;

    unitVariantsPriceGross = selectedVariantsPrice;
    unitVariantsPriceNet = unitVariantsPriceGross / 1.19;

    unitProductBasePriceGross = baseProduct.price;
    unitProductBasePriceNet = baseProduct.price / 1.19;

    unitProductPriceGross = selectedProduct.price;
    unitProductPriceNet = selectedProduct.price / 1.19;

    console.group("📦 Price Breakdown");

    console.log("Fix Cost:", { fixCostGross, fixCostNet });
    console.log("Validation Service:", {
      validationServicePriceGross,
      validationServicePriceNet,
    });
    console.log("Graphic Service:", {
      graphicServicePriceGross,
      graphicServicePriceNet,
    });
    console.log("Variants Base:", {
      unitVariantsBasePriceGross,
      unitVariantsBasePriceNet,
    });
    console.log("Variants Selected:", {
      unitVariantsPriceGross,
      unitVariantsPriceNet,
    });
    console.log("Base Product:", {
      unitProductBasePriceGross,
      unitProductBasePriceNet,
    });
    console.log("Selected Product:", {
      unitProductPriceGross,
      unitProductPriceNet,
    });

    const netTotalPriceAmount =
      ((unitProductPriceNet + unitVariantsPriceNet) / 100) * quantity +
      (validationServicePriceNet + graphicServicePriceNet + fixCostNet) / 100;
    const netUnitPriceAmount = netTotalPriceAmount / quantity;
    const netTotalDiscountAmount =
      ((unitProductBasePriceNet -
        unitProductPriceNet +
        (unitVariantsBasePriceNet - unitVariantsPriceNet)) /
        100) *
      quantity;
    const subtotalGrossAmount =
      ((unitProductPriceGross + unitVariantsPriceGross) / 100) * quantity +
      (validationServicePriceGross + graphicServicePriceGross + fixCostGross) /
        100;
    const unitGrossAmount = subtotalGrossAmount / quantity;

    console.log("netTotalPriceAmount:", netTotalPriceAmount);
    console.log("netUnitPriceAmount:", netUnitPriceAmount);
    console.log("netTotalDiscountAmount:", netTotalDiscountAmount);
    console.log("subtotalGrossAmount:", subtotalGrossAmount);
    console.groupEnd();

    elements.netUnitPriceElement.textContent =
      formatCurrency(netUnitPriceAmount) + "*";
    elements.netTotalPriceElement.textContent =
      formatCurrency(netTotalPriceAmount) + "*";
    elements.netTotalDiscountElement.textContent =
      formatCurrency(netTotalDiscountAmount) + "*";
    elements.grossUnitPriceElement.textContent =
      formatCurrency(unitGrossAmount);
    elements.grossTotalPriceElement.textContent =
      formatCurrency(subtotalGrossAmount);
  };

  const getFlags = () => ({
    isActive: state.selectedAreas.size > 0,
    hasUploadChoice: state.selectedUploadChoices.size > 0,
    hasValidationService: state.selectedValidationService.size > 0,
    hasGraphicService: state.selectedGraphicService.size > 0,
    isConfigured:
      state.selectedAreas.size > 0 &&
      state.selectedPrintMethods.size > 0 &&
      state.selectedAreas.size === state.selectedPrintMethods.size,
    uploadNow: state.selectedUploadChoices.has("upload-now"),
    uploadLater: state.selectedUploadChoices.has("upload-later"),
    useGraphicService: state.selectedUploadChoices.has("graphic-service"),
    fileIsUploaded: elements.fileUploadButtonElement.files.length > 0,
  });

  const toggleprintAreaCustomizationOptionElements = () => {
    elements.printAreaCustomizationOptionElement.forEach((el) => {
      const labelEl = el.querySelector(
        selectors.printAreaCustomizationOptionLabelSelector
      );
      const label = labelEl?.dataset.handle;

      const isActive = state.selectedAreas.has(label);
      toggleHidden(el, isActive);
    });
  };

  const togglePrintMethodVariants = () => {
    elements.variantsWrapperElement.forEach((wrapper) => {
      const pairKey = wrapper.dataset.pair;
      const shouldShow = state.selectedPrintMethods.has(pairKey);
      toggleHidden(wrapper, shouldShow);
    });
  };

  const toggleSections = (flags) => {
    toggleprintAreaCustomizationOptionElements();
    togglePrintMethodVariants();
    toggleHidden(
      elements.uploadChoicesCustomizationSectionElement,
      flags.isConfigured
    );
    toggleHidden(
      elements.printMethodCustomizationSectionElement,
      flags.isActive
    );
    switch (true) {
      case flags.uploadNow:
        showSections(true, true, false);
        break;
      case flags.uploadLater:
        showSections(false, true, false);
        break;
      case flags.useGraphicService:
        showSections(false, false, true);
        break;
    }
  };

  updateProgressBar = (flags) => {
    toggleActivePair(
      elements.printAreaProgressCircleElement,
      elements.printAreaProgressRectangleElement,
      flags.isActive
    );
    toggleActivePair(
      elements.printMethodProgressCircleElement,
      elements.printMethodProgressRectangleElement,
      flags.isConfigured
    );
    toggleHidden(
      elements.printCustomizationCompletedElement,
      flags.isConfigured
    );
    toggleActivePairBlue(
      elements.uploadChoicesProgressCircleElement,
      elements.uploadChoicesProgressRectangleElement,
      flags.hasUploadChoice
    );
    toggleActivePairBlue(
      elements.fileUploadProgressCircleElement,
      elements.fileUploadProgressRectangleElement,
      flags.fileIsUploaded
    );
    toggleActivePairBlue(
      elements.validationServicesProgressCircleElement,
      elements.validationServicesProgressRectangleElement,
      flags.hasValidationService
    );
    toggleActivePairBlue(
      elements.graphicServicesProgressCircleElement,
      elements.graphicServicesProgressRectangleElement,
      flags.hasGraphicService
    );
    const checkCompletion =
      (flags.uploadNow && flags.fileIsUploaded && flags.hasValidationService) ||
      (flags.uploadLater && flags.hasValidationService) ||
      (flags.useGraphicService && flags.hasGraphicService);
    toggleHidden(elements.fileCustomizationCompletedElement, checkCompletion);
  };

  const showOnlySelectedOptionsInSummary = () => {
    const allOptionEls = document.querySelectorAll(
      selectors.summaryOptionsSelector
    );
    allOptionEls.forEach((el) => {
      const handle = el.dataset.summaryHandle;
      isSelected = state.selectedPrintMethods.has(handle);
      toggleHidden(el, isSelected);
    });
  };

  toggleSummary = (flags) => {
    toggleHidden(elements.customizationSummaryElement, flags.isConfigured);
    toggleHidden(
      elements.customizationSummaryImagesElement,
      flags.isConfigured
    );
    showOnlySelectedOptionsInSummary();
  };

  const updateUI = () => {
    const flags = getFlags();

    toggleSections(flags);
    updateProgressBar(flags);
    toggleSummary(flags);
  };

  const updateState = (action, value) => {
    switch (action) {
      case "SELECT_AREA":
        updateState("DESELECT_UPLOAD_CHOICE");
        state.selectedAreas.add(value);
        break;

      case "SELECT_PRINT_METHOD":
        updateState("DESELECT_PRINT_METHOD", value);
        updateState("DESELECT_PRINT_VARIANT", value);
        updateState("PRESELECT_FIRST_PRINT_VARIANT", value);
        state.selectedPrintMethods.add(value);
        break;

      case "SELECT_PRINT_VARIANT":
        updateState("DESELECT_PRINT_VARIANT", value);
        state.selectedVariants.add(value);
        break;

      case "SELECT_UPLOAD_CHOICE":
        {
          updateState("DESELECT_UPLOAD_CHOICE");
          state.selectedUploadChoices.add(value);
          const flags = getFlags();
          switch (true) {
            case flags.uploadNow:
              updateState("PRESELECT_FIRST_VALIDATION_SERVICE");
              break;
            case flags.uploadLater:
              updateState("PRESELECT_FIRST_VALIDATION_SERVICE");
              break;
          }
        }
        break;

      case "SELECT_VALIDATION_SERVICE":
        {
          updateState("DESELECT_VALIDATION_SERVICE");
          state.selectedValidationService.add(value);
        }
        break;

      case "SELECT_GRAPHIC_SERVICE":
        {
          updateState("DESELECT_GRAPHIC_SERVICE");
          state.selectedGraphicService.add(value);
        }
        break;

      case "PRESELECT_FIRST_PRINT_VARIANT":
        {
          const variantPrefix = `${value}-`;

          const firstVariant = [...elements.variantsElement].find((input) =>
            input.value.startsWith(variantPrefix)
          );

          if (firstVariant) {
            firstVariant.checked = true;
            state.selectedVariants.add(firstVariant.value);
          }
        }
        break;

      case "PRESELECT_FIRST_VALIDATION_SERVICE":
        updateState("DESELECT_VALIDATION_SERVICE");
        const validationInputs = Array.from(
          document.querySelectorAll(selectors.validationServiceButtonSelector)
        );
        if (validationInputs.length > 0) {
          const firstInput = validationInputs[0];
          const value = firstInput.value;
          state.selectedValidationService.add(value);
          firstInput.checked = true;
        }
        break;

      case "DESELECT_AREA":
        state.selectedAreas.delete(value);
        updateState("DESELECT_PRINT_METHOD", value);
        updateState("DESELECT_PRINT_VARIANT", value);
        updateState("DESELECT_UPLOAD_CHOICE");
        break;

      case "DESELECT_PRINT_METHOD":
        const [printArea] = value.split("-");
        [...state.selectedPrintMethods].forEach((method) => {
          if (method.startsWith(printArea + "-")) {
            state.selectedPrintMethods.delete(method);
            const printInput = document.querySelector(
              `.customization__button[data-section="print-method"][value="${method}"]`
            );
            if (printInput) printInput.checked = false;
          }
        });
        break;

      case "DESELECT_PRINT_VARIANT":
        const [printVariant] = value.split("-");
        [...state.selectedVariants].forEach((variant) => {
          if (variant.startsWith(printVariant + "-")) {
            state.selectedVariants.delete(variant);
            const variantInput = document.querySelector(
              `.customization__button[data-section="variant"][value="${variant}"]`
            );
            if (variantInput) variantInput.checked = false;
          }
        });
        break;

      case "DESELECT_VALIDATION_SERVICE":
        [...state.selectedValidationService].forEach((service) => {
          const validationInput = document.querySelector(
            `.customization__button[data-section="validation-services"][value="${service}"]`
          );
          if (validationInput) validationInput.checked = false;
        });
        state.selectedValidationService.clear();
        break;

      case "DESELECT_GRAPHIC_SERVICE":
        [...state.selectedGraphicService].forEach((service) => {
          const graphicInput = document.querySelector(
            `.customization__button[data-section="graphic-services"][value="${service}"]`
          );
          if (graphicInput) graphicInput.checked = false;
        });
        state.selectedGraphicService.clear();
        break;

      case "DESELECT_UPLOAD_CHOICE":
        updateState("DESELECT_VALIDATION_SERVICE");
        updateState("DESELECT_GRAPHIC_SERVICE");
        [...state.selectedUploadChoices].forEach((upload) => {
          const uploadInput = document.querySelector(
            `.customization__button[data-section='upload-choices'][value="${upload}"]`
          );
          if (uploadInput) uploadInput.checked = false;
        });
        state.selectedUploadChoices.clear();

        document
          .querySelectorAll(
            ".customization__section[data-section='file-upload'], .customization__section[data-section='validation-services'], .customization__section[data-section='graphic-services']"
          )
          .forEach((el) => el.classList.add("hidden"));
        break;
    }
    console.log("Current state:", Array.from(state.selectedAreas));
    console.log("Current state:", Array.from(state.selectedPrintMethods));
    console.log("Current state:", Array.from(state.selectedVariants));
    console.log("Current state:", Array.from(state.selectedUploadChoices));
    console.log("Current state:", Array.from(state.selectedValidationService));
    console.log("Current state:", Array.from(state.selectedGraphicService));

    updateUI();
    updatePrice();
  };

  elements.printAreasElement.forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const value = e.target.value;
      if (e.target.checked) {
        updateState("SELECT_AREA", value);
      } else {
        updateState("DESELECT_AREA", value);
      }
    });
  });
  elements.printMethodsElement.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const value = e.target.value;
      if (e.target.checked) {
        updateState("SELECT_PRINT_METHOD", value);
      }
    });
  });
  elements.variantsElement.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const value = e.target.value;
      if (e.target.checked) {
        updateState("SELECT_PRINT_VARIANT", value);
      }
    });
  });
  elements.uploadChoicesElement.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const value = e.target.value;
      if (e.target.checked) {
        updateState("SELECT_UPLOAD_CHOICE", value);
      }
    });
  });
  elements.validationServicesElement.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const value = e.target.value;
      if (e.target.checked) {
        updateState("SELECT_VALIDATION_SERVICE", value);
      }
    });
  });
  elements.graphicServicesElement.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const value = e.target.value;
      if (e.target.checked) {
        updateState("SELECT_GRAPHIC_SERVICE", value);
      }
    });
  });
  elements.addUploadButtonElement.addEventListener("click", function () {
    const nextHidden = Array.from(
      document.querySelectorAll(selectors.uploadButtonsSelector)
    ).find((wrapper) => wrapper.classList.contains("hidden"));
    if (nextHidden) {
      nextHidden.classList.remove("hidden");
    }
  });
  document
    .querySelectorAll(selectors.uploadButtonsSelector)
    .forEach((wrapper) => {
      const removeBtn = wrapper.querySelector(
        selectors.deleteUploadButtonSelector
      );

      if (removeBtn) {
        removeBtn.addEventListener("click", function () {
          wrapper.classList.add("hidden");
        });
      }
    });

  elements.fileUploadButtonElement.addEventListener("change", () => {
    updateUI();
  });
  elements.quantityButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const quantity = this.getAttribute("data-cart-quantity");

      if (elements.quantityInput) {
        elements.quantityInput.value = quantity;
        elements.quantityInput.dispatchEvent(
          new Event("change", { bubbles: true })
        );
      }
    });
  });
  elements.quantityInput.addEventListener("change", () => {
    updatePrice();
  });
  document.addEventListener("click", async (e) => {
    if (!e.target.closest(".product-form__submit")) return;
    e.target.closest(".product-form__submit");
    e.preventDefault();

    createFormData(); // fills global formItems

    if (!formItems || formItems.length === 0) {
      console.warn("formItems is empty or undefined");
      return;
    }
    console.log("Sending formItems:", formItems);

    try {
      this.submitButton = this.querySelector('[type="submit"]');
      this.submitButton.classList.add("loading");
      this.querySelector(".loading-overlay__spinner").classList.remove(
        "hidden"
      );
      await submitLineItems(formItems);
      window.location = window.routes.cart_url;
    } catch (err) {
      console.error("Failed to add to cart", err);
    } finally {
      this.submitButton.classList.remove("loading");
      this.querySelector(".loading-overlay__spinner").classList.add("hidden");
    }
  });
  window.addEventListener("pageshow", function (event) {
    const navigationEntries = performance.getEntriesByType("navigation");
    const navType =
      navigationEntries.length > 0 ? navigationEntries[0].type : null;

    const historyTraversal = event.persisted || navType === "back_forward";

    if (historyTraversal) {
      // Handle page restore (back/forward navigation)
      window.location.reload();
    }
  });
  updateUI(); // initialize UI

  (function updateQtyFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const qty = urlParams.get("qty");

    if (qty) {
      const qtyValue = parseInt(qty, 10);

      if (elements.quantityInput && !isNaN(qtyValue)) {
        elements.quantityInput.value = qtyValue;
        elements.quantityInput.dispatchEvent(
          new Event("change", { bubbles: true })
        );
        updatePrice();
      }
    }
  })();
  (function overrideQtyWithMOQIfNoUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const hasQtyParam = urlParams.has("qty");

    if (hasQtyParam || !elements.quantityInput) return;

    const moqElement = document.querySelector(".qty-selector__moq");
    if (!moqElement) return; // Exit if MOQ element doesn't exist

    const moq = parseInt(moqElement.dataset.moq, 10);
    if (isNaN(moq)) return; // Exit if invalid value

    elements.quantityInput.value = moq;
    elements.quantityInput.dispatchEvent(
      new Event("change", { bubbles: true })
    );
    updatePrice();
  })();
});
