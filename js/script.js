// ====== CONFIG ======
const OFFER_ACTIVE = true;

const phone = "919497090854";

// ====== OFFER TOGGLE ======
function toggleOffer() {
  const offerActive = document.querySelector("#offer-active");
  const offerEmpty = document.querySelector("#offer-empty");

  const homeOfferActive = document.querySelector("#home-offer-active");
  const homeOfferEmpty = document.querySelector("#home-offer-empty");

  if (OFFER_ACTIVE) {
    // Offer page
    offerActive.classList.remove("hidden");
    offerEmpty.classList.add("hidden");

    // Home hero
    homeOfferActive.classList.remove("hidden");
    homeOfferEmpty.classList.add("hidden");

    if (typeof renderProducts === "function") {
      renderProducts();
    }
  } else {
    // Offer page
    offerActive.classList.add("hidden");
    offerEmpty.classList.remove("hidden");

    // Home hero
    homeOfferActive.classList.add("hidden");
    homeOfferEmpty.classList.remove("hidden");
  }
}

// Run when page loads
document.addEventListener("DOMContentLoaded", () => {
  toggleOffer();
});

// MERGED DOMContentLoaded listener
document.addEventListener("DOMContentLoaded", () => {
  const WEBSITE_BASE_URL = window.location.href.substring(
    0,
    window.location.href.lastIndexOf("/") + 1
  );

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  const state = {
    currentPage: "home",
    cart: {
      type: null, // 'offer' or 'single'
      items: [],
    },
  };

  function showInfoModal(title, message) {
    const modalContainer = $("#modal-container");
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50";
    modal.innerHTML = `
                <div class="bg-white rounded-lg p-6 w-full max-w-sm text-center">
                    <h3 class="font-bold text-lg">${title}</h3>
                    <p class="mt-2 text-slate-600">${message}</p>
                    <div class="mt-6 flex justify-end">
                        <button id="close-info-modal" class="bg-blue-600 text-white px-4 py-2 rounded-md">OK</button>
                    </div>
                </div>
            `;
    modalContainer.innerHTML = "";
    modalContainer.appendChild(modal);

    const closeModal = () => (modalContainer.innerHTML = "");
    $("#close-info-modal").addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => e.target === modal && closeModal());
  }

  function showIncompleteOfferModal(message) {
    const modalContainer = $("#modal-container");
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50";
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 w-full max-w-sm text-center relative">
            <button class="close-modal-btn absolute top-2 right-3 text-3xl text-slate-400 hover:text-slate-700">&times;</button>
            <h3 class="font-bold text-lg">Selection Incomplete</h3>
            <p class="mt-2 text-slate-600">${message}</p>
            <div class="mt-6 flex justify-center">
                <button id="go-to-offer" class="bg-blue-600 text-white px-4 py-2 rounded-md">Offer Page</button>
            </div>
        </div>
    `;
    modalContainer.innerHTML = "";
    modalContainer.appendChild(modal);

    const closeModal = () => (modalContainer.innerHTML = "");

    modal
      .querySelector(".close-modal-btn")
      .addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => e.target === modal && closeModal());

    $("#go-to-offer").addEventListener("click", () => {
      navigateTo("offer");
      closeModal();
    });
  }

  function showConfirmationModal(message, onConfirm) {
    const modalContainer = $("#modal-container");
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50";
    modal.innerHTML = `
                <div class="bg-white rounded-lg p-6 w-full max-w-sm">
                    <h3 class="font-bold text-lg">Please Confirm</h3>
                    <p class="mt-2 text-slate-600">${message}</p>
                    <div class="mt-6 flex justify-end gap-3">
                        <button id="cancel-confirm" class="bg-gray-200 px-4 py-2 rounded-md">Cancel</button>
                        <button id="confirm-action" class="bg-blue-600 text-white px-4 py-2 rounded-md">Continue</button>
                    </div>
                </div>
            `;
    modalContainer.innerHTML = "";
    modalContainer.appendChild(modal);

    const closeModal = () => (modalContainer.innerHTML = "");

    $("#cancel-confirm").addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => e.target === modal && closeModal());

    $("#confirm-action").addEventListener("click", () => {
      onConfirm();
      closeModal();
    });
  }

  function showReplacementModal(newProduct, onConfirm) {
    const modalContainer = $("#modal-container");
    const modal = document.createElement("div");
    const [item1, item2] = state.cart.items;
    modal.className =
      "fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50";
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 class="font-bold text-lg">Replace an Item</h3>
            <p class="mt-2 text-slate-600">Your cart is full. Choose an item to replace with <strong>${newProduct.name}</strong>.</p>
            <div class="mt-4 space-y-3">
                <button id="replace-0" class="w-full text-left p-3 border rounded-lg hover:bg-slate-100 hover:border-blue-600 transition-colors">Replace: ${item1.name}</button>
                <button id="replace-1" class="w-full text-left p-3 border rounded-lg hover:bg-slate-100 hover:border-blue-600 transition-colors">Replace: ${item2.name}</button>
            </div>
            <div class="mt-6 flex justify-end">
                <button id="cancel-replace" class="bg-gray-200 px-4 py-2 rounded-md">Cancel</button>
            </div>
        </div>
    `;

    modalContainer.innerHTML = "";
    modalContainer.appendChild(modal);

    const closeModal = () => (modalContainer.innerHTML = "");

    $("#cancel-replace").addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => e.target === modal && closeModal());

    $("#replace-0").addEventListener("click", () => {
      onConfirm(0); // Callback with index 0
      closeModal();
    });

    $("#replace-1").addEventListener("click", () => {
      onConfirm(1); // Callback with index 1
      closeModal();
    });
  }

  const OFFER_BASE_PRICE = 999;
  const SHIPPING_FEE = 100;

  function saveState() {
    sessionStorage.setItem("STYLYY_KICKS_STATE", JSON.stringify(state));
  }

  function loadState() {
    const savedState = sessionStorage.getItem("STYLYY_KICKS_STATE");
    if (savedState) {
      Object.assign(state, JSON.parse(savedState));
    }
  }

  function formatINR(n) {
    return `₹${n.toLocaleString("en-IN")}`;
  }

  function navigateTo(page) {
    if (!page) return;
    state.currentPage = page;
    $$(".page-view").forEach((p) => p.classList.add("hidden-view"));
    $(`#${page}-view`).classList.remove("hidden-view");

    $$(".nav-link").forEach((l) => l.classList.remove("active"));
    const activeLink = $(`.nav-link[data-page="${page}"]`);
    if (activeLink) activeLink.classList.add("active");

    window.scrollTo(0, 0);
    $("#nav-menu").classList.add("hidden");

    if (page === "checkout") {
      renderCheckout();
    }

    saveState();
  }

  function createProductCard(product, mode) {
    const card = document.createElement("div");
    card.className =
      "card bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all cursor-pointer";
    card.dataset.id = product.id;

    let detailsHtml = "";

    if (mode === "offer") {
      detailsHtml = `
                <div class="flex items-center justify-between mt-2">
                    <div class="flex flex-wrap gap-2">
                        ${product.sizes
                          .map(
                            (s) =>
                              `<span class="text-xs border rounded-md px-2 py-1">${s}</span>`
                          )
                          .join("")}
                    </div>
                    ${
                      product.extra > 0
                        ? `<span class="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">+${formatINR(
                            product.extra
                          )}</span>`
                        : ""
                    }
                </div>
            `;
    } else {
      detailsHtml = `
                <div class="flex items-center justify-between mt-2">
                    <p class="font-semibold text-blue-600">${formatINR(
                      product.price
                    )}</p>
                </div>
            `;
    }

    card.innerHTML = `
        <div class="h-48 bg-gray-200">
            <img src="${product.img}" alt="${product.name}" class="w-full h-full object-cover">
        </div>
        <div class="p-4">
            <h3 class="font-bold text-slate-800">${product.name}</h3>
            ${detailsHtml}
            <button data-id="${product.id}" class="select-btn mt-2 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all">Select</button>
        </div>
    `;

    card.addEventListener("click", () => showProductModal(product, mode));
    card.querySelector(".select-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      handleProductSelection(product, mode);
    });

    return card;
  }

  function renderProducts() {
    const offerGrid = $("#offer-grid");
    const productsGrid = $("#products-grid");
    offerGrid.innerHTML = "";
    productsGrid.innerHTML = "";

    OFFER_CATALOG.forEach((p) => {
      offerGrid.appendChild(createProductCard(p, "offer"));
    });

    CATALOG.forEach((p) => {
      productsGrid.appendChild(createProductCard(p, "single"));
    });
  }

  function showProductModal(product, mode) {
    const modalContainer = $("#modal-container");
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50";
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl m-4 transform transition-all opacity-0 -translate-y-4 max-h-[90vh] overflow-y-auto">
            <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="flex items-center">
                        <img src="${product.img}" alt="${
      product.name
    }" class="w-full h-auto rounded-lg cursor-zoom-in modal-image"/>
                    </div>
                    <div>
                        <div class="flex justify-between items-start mb-4">
                              <h2 class="text-2xl font-bold text-slate-800">${
                                product.name
                              }</h2>
                              <button class="close-modal text-3xl text-slate-400 hover:text-slate-700">&times;</button>
                        </div>
                        <p class="text-slate-600">Base Price: ${formatINR(
                          product.price
                        )}</p>
                        ${
                          mode === "offer" && product.extra > 0
                            ? `<p class="text-sm text-red-600">Note: This model has an extra charge of ${formatINR(
                                product.extra
                              )} for the offer.</p>`
                            : ""
                        }
                        ${
                          product.sizes
                            ? `<div class="mt-4"><h4 class="font-semibold">Available Sizes:</h4><div class="flex flex-wrap gap-2 mt-2">${product.sizes
                                .map(
                                  (s) =>
                                    `<span class="border rounded-md px-3 py-1 text-sm">${s}</span>`
                                )
                                .join("")}</div></div>`
                            : ""
                        }
                        <button class="modal-select-btn mt-6 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all">Select</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    modalContainer.innerHTML = "";
    modalContainer.appendChild(modal);

    setTimeout(() => {
      modal
        .querySelector(".bg-white")
        .classList.remove("opacity-0", "-translate-y-4");
      modal
        .querySelector(".bg-white")
        .classList.add("opacity-100", "translate-y-0");
    }, 10);

    const closeModal = () => {
      modal
        .querySelector(".bg-white")
        .classList.add("opacity-0", "-translate-y-4");
      setTimeout(() => (modalContainer.innerHTML = ""), 300);
    };

    modal.querySelector(".close-modal").addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    modal.querySelector(".modal-image").addEventListener("click", (e) => {
      const imageUrl = e.target.src;
      const overlay = document.createElement("div");
      overlay.className = "image-overlay";
      overlay.innerHTML = `<img src="${imageUrl}" alt="Full resolution product image">`;
      document.body.appendChild(overlay);

      overlay.addEventListener("click", () => {
        document.body.removeChild(overlay);
      });
    });

    modal.querySelector(".modal-select-btn").addEventListener("click", () => {
      const replacementModalWasShown = handleProductSelection(product, mode);
      if (!replacementModalWasShown) {
        closeModal();
      }
    });
  }

  function handleProductSelection(product, mode) {
    let replacementModalShown = false;
    const performSelection = () => {
      state.cart.type = mode;

      if (mode === "offer") {
        if (state.cart.items.length < 2) {
          state.cart.items.push({ ...product, selectedSize: null });
        } else {
          showReplacementModal(product, (indexToReplace) => {
            state.cart.items[indexToReplace] = {
              ...product,
              selectedSize: null,
            };
            updateUI();
          });
          replacementModalShown = true;
          return;
        }
      } else {
        // single mode
        if (
          state.cart.items.length > 0 &&
          state.cart.items[0].id === product.id
        ) {
          state.cart.items = [];
        } else {
          state.cart.items = [{ ...product, selectedSize: null }];
        }
      }
      updateUI();
    };

    if (state.cart.type && state.cart.type !== mode) {
      showConfirmationModal(
        "This will clear your current cart, which is from a different offer. Continue?",
        () => {
          clearCart();
          performSelection();
        }
      );
    } else {
      performSelection();
    }
    return replacementModalShown;
  }

  function selectSizeForCartItem(itemIndex) {
    const item = state.cart.items[itemIndex];
    if (!item || !item.sizes) return;

    const modalContainer = $("#modal-container");
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50";
    modal.innerHTML = `
                <div class="bg-white rounded-lg p-6 w-full max-w-sm">
                    <h3 class="font-bold text-lg">Select Size for ${
                      item.name
                    }</h3>
                    <div class="flex flex-wrap gap-3 mt-4">
                        ${item.sizes
                          .map(
                            (size) => `
                            <label class="block">
                                <input type="radio" name="size" value="${size}" class="sr-only peer">
                                <span class="cursor-pointer border rounded-md px-4 py-2 peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600">${size}</span>
                            </label>
                            `
                          )
                          .join("")}
                    </div>
                    <div class="mt-6 flex justify-end gap-3">
                        <button id="cancel-size" class="bg-gray-200 px-4 py-2 rounded-md">Cancel</button>
                        <button id="confirm-size" class="bg-blue-600 text-white px-4 py-2 rounded-md">Confirm</button>
                    </div>
                </div>
            `;
    modalContainer.innerHTML = "";
    modalContainer.appendChild(modal);

    const closeModal = () => (modalContainer.innerHTML = "");
    $("#cancel-size").addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => e.target === modal && closeModal());

    $("#confirm-size").addEventListener("click", () => {
      const selectedSize = modal.querySelector('input[name="size"]:checked');
      if (selectedSize) {
        state.cart.items[itemIndex].selectedSize = selectedSize.value;
        renderCheckout();
        closeModal();
      } else {
        showInfoModal("Selection Required", "Please select a size.");
      }
    });
  }

  function updateUI() {
    const [offerItem1, offerItem2] =
      state.cart.type === "offer" ? state.cart.items : [null, null];
    $("#offer-sel1").textContent = offerItem1 ? offerItem1.name : "-";
    $("#offer-sel2").textContent = offerItem2 ? offerItem2.name : "-";

    const singleItem =
      state.cart.type === "single" ? state.cart.items[0] : null;
    $("#product-sel").textContent = singleItem ? singleItem.name : "-";

    // Update offer total
    if (state.cart.type === "offer" && state.cart.items.length > 0) {
      const offerTotal = state.cart.items.reduce(
        (acc, item) => acc + (item.extra || 0),
        OFFER_BASE_PRICE
      );
      $("#offer-total").textContent = formatINR(offerTotal);
    } else {
      $("#offer-total").textContent = "-";
    }

    // Update product price
    if (state.cart.type === "single" && singleItem) {
      $("#product-price").textContent = formatINR(singleItem.price);
    } else {
      $("#product-price").textContent = "-";
    }

    // Update selected cards
    $$(".card").forEach((c) => c.classList.remove("selected"));
    if (state.cart.items.length > 0) {
      const gridId =
        state.cart.type === "offer" ? "#offer-grid" : "#products-grid";
      const selectedIds = state.cart.items.map((item) => item.id);

      const selectedCount = {};
      selectedIds.forEach((id) => {
        selectedCount[id] = (selectedCount[id] || 0) + 1;
      });

      $$(`${gridId} .card`).forEach((card) => {
        const cardId = card.dataset.id;
        if (selectedCount[cardId] > 0) {
          card.classList.add("selected");
          selectedCount[cardId]--;
        }
      });
    }

    saveState();
  }

  function clearCart() {
    state.cart.type = null;
    state.cart.items = [];
    updateUI();
  }

  function renderCheckout() {
    const summaryContainer = $("#summary-items");
    const billContainer = $("#bill-details");
    summaryContainer.innerHTML = "";
    billContainer.innerHTML = "";

    if (!state.cart.type || state.cart.items.length === 0) {
      summaryContainer.innerHTML =
        '<p class="text-slate-500">Your cart is empty.</p>';
      return;
    }

    let baseTotal = 0;
    let extraTotal = 0;

    if (state.cart.type === "offer") {
      baseTotal = OFFER_BASE_PRICE;
      extraTotal = state.cart.items.reduce(
        (acc, item) => acc + (item.extra || 0),
        0
      );
    } else {
      // single
      baseTotal = state.cart.items.reduce((acc, item) => acc + item.price, 0);
    }

    state.cart.items.forEach((item, index) => {
      const itemEl = document.createElement("div");
      itemEl.className = "flex gap-4 items-center";
      itemEl.innerHTML = `
                      <img src="${
                        item.img
                      }" class="w-20 h-20 object-cover rounded-md">
                      <div>
                          <p class="font-semibold">${item.name}</p>
                          <p class="text-sm text-slate-500">Size: 
                              <button data-item-index="${index}" class="size-select-btn text-blue-600 font-semibold underline">${
        item.selectedSize || "Select"
      }</button>
                          </p>
                      </div>
                  `;
      itemEl
        .querySelector(".size-select-btn")
        .addEventListener("click", () => selectSizeForCartItem(index));
      summaryContainer.appendChild(itemEl);
    });

    const finalTotal = baseTotal + extraTotal + SHIPPING_FEE;

    const createBillRow = (label, value) =>
      `<div class="flex justify-between"><span>${label}</span><span>${value}</span></div>`;

    billContainer.innerHTML = `
                ${createBillRow("Base Price", formatINR(baseTotal))}
                ${
                  extraTotal > 0
                    ? createBillRow("Extra Charges", formatINR(extraTotal))
                    : ""
                }
                ${createBillRow("Shipping Fee", formatINR(SHIPPING_FEE))}
                <div class="flex justify-between font-bold text-lg text-blue-700 border-t mt-2 pt-2">
                    <span>Total</span>
                    <span>${formatINR(finalTotal)}</span>
                </div>
            `;
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const vals = Object.fromEntries(formData.entries());

    if (state.cart.items.some((item) => item.sizes && !item.selectedSize)) {
      showInfoModal(
        "Size Required",
        "Please select a size for all items before placing the order."
      );
      return;
    }

    let msg = `*New Order — Stylyy Kicks*%0A%0A`;
    msg += `*Customer Details:*%0A`;
    msg += `Name: ${vals.name}%0A`;
    msg += `Address: ${vals.address}%0A`;
    msg += `District: ${vals.district}%0A`;
    msg += `State: ${vals.state}%0A`;
    msg += `Pincode: ${vals.pincode}%0A`;
    msg += `Landmark: ${vals.landmark || "N/A"}%0A`;
    msg += `Contact 1: ${vals.contact1}%0A`;
    msg += `Contact 2: ${vals.contact2 || "N/A"}%0A`;
    msg += `Instagram: ${vals.instagram || "N/A"}%0A%0A`;

    msg += `*Order Details:*%0A`;
    if (state.cart.type === "offer") {
      msg += `_Order Type: 2-Pair Offer_%0A`;
      state.cart.items.forEach((item, i) => {
        const imageUrl = WEBSITE_BASE_URL + item.img.replace("./", "");
        msg += `%0A*Pair ${i + 1}:*%0A`;
        msg += `Name: ${item.name}%0A`;
        msg += `Size: ${item.selectedSize || "N/A"}%0A`;
        msg += `Image: ${imageUrl}%0A`;
      });
    } else {
      msg += `_Order Type: Single Pair_%0A`;
      const item = state.cart.items[0];
      const imageUrl = WEBSITE_BASE_URL + item.img.replace("./", "");
      msg += `Name: ${item.name}%0A`;
      msg += `Size: ${item.selectedSize || "N/A"}%0A`;
      msg += `Image: ${imageUrl}%0A`;
    }

    let baseTotal = 0;
    let extraTotal = 0;
    if (state.cart.type === "offer") {
      baseTotal = OFFER_BASE_PRICE;
      extraTotal = state.cart.items.reduce(
        (acc, item) => acc + (item.extra || 0),
        0
      );
    } else {
      baseTotal = state.cart.items[0].price;
    }
    const finalTotal = baseTotal + extraTotal + SHIPPING_FEE;

    msg += `%0A*Total Amount: ${formatINR(finalTotal)}*%0A(Including Shipping)`;

    const url = `https://wa.me/${phone}?text=${msg}`;
    window.open(url, "_blank");
  }

  // Event Listeners
  $$(".nav-link, .nav-btn, #brand-logo").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const page = e.currentTarget.dataset.page || "home";

      if (page === "checkout") {
        if (state.cart.type === "offer" && state.cart.items.length !== 2) {
          showIncompleteOfferModal(
            "You have an incomplete offer in your cart. Please select a second pair to continue."
          );
          return;
        }
        if (state.cart.type === "single" && state.cart.items.length !== 1) {
          showInfoModal(
            "Selection Incomplete",
            "Please select one pair before checking out."
          );
          return;
        }
      }

      navigateTo(page);
    });
  });

  $("#menu-toggle").addEventListener("click", () => {
    $("#nav-menu").classList.toggle("active-menu");
  });

  $("#offer-clear").addEventListener("click", clearCart);
  $("#product-clear").addEventListener("click", clearCart);

  $("#offer-checkout").addEventListener("click", () => {
    if (state.cart.type === "offer" && state.cart.items.length === 2) {
      navigateTo("checkout");
    } else {
      showIncompleteOfferModal("Please select two pairs for the offer.");
    }
  });

  $("#product-checkout").addEventListener("click", () => {
    if (state.cart.type === "single" && state.cart.items.length === 1) {
      navigateTo("checkout");
    } else {
      showInfoModal("Selection Incomplete", "Please select one pair.");
    }
  });

  $("#checkout-form").addEventListener("submit", handleFormSubmit);

  // Initial Load
  loadState();
  renderProducts();
  navigateTo(state.currentPage || "home");
  updateUI();
});
