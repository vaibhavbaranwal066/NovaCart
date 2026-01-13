/* ===== DOM ELEMENTS ===== */
const list = document.getElementById("productList");
const searchInput = document.getElementById("searchInput");
const priceFilter = document.getElementById("priceFilter");
const priceValue = document.getElementById("priceValue");

/* ===== STATE ===== */
let filteredProducts = [...products];

/* ===== SCROLL REVEAL ===== */
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
        observer.unobserve(entry.target); // reveal only once
      }
    });
  },
  { threshold: 0.2 }
);

/* ===== RENDER PRODUCTS ===== */
function renderProducts(items) {
  list.innerHTML = "";

  items.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.style.transitionDelay = `${index * 0.06}s`;

    card.innerHTML = `
      <span 
        class="wishlist ${isWishlisted(p.id) ? "active" : ""}"
        data-id="${p.id}"
        onclick="toggleWishlist(${p.id})"
      >
        ${isWishlisted(p.id) ? "❤️" : "🤍"}
      </span>

      <h4>${p.name}</h4>
      <p>₹${p.price}</p>
      <button class="btn-primary">Add to Cart</button>
    `;

    card.querySelector(".btn-primary").onclick = () => addToCart(p);

    list.appendChild(card);
    observer.observe(card);
  });

  updateWishlistUI();
}

/* ===== APPLY FILTERS ===== */
function applyFilters() {
  const searchText = searchInput.value.toLowerCase();
  const maxPrice = Number(priceFilter.value);

  filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchText) &&
    p.price <= maxPrice
  );

  renderProducts(filteredProducts);
}

/* ===== SEARCH ===== */
searchInput.addEventListener("input", applyFilters);

/* ===== PRICE FILTER ===== */
priceFilter.addEventListener("input", () => {
  priceValue.innerText = `₹${priceFilter.value}`;
  applyFilters();
});

/* ===== INITIAL LOAD ===== */
priceValue.innerText = `₹${priceFilter.value}`;
renderProducts(products);
