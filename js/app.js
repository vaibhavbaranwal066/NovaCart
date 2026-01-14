/* ===== DOM ELEMENTS ===== */
const list = document.getElementById("productList");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const ratingFilter = document.getElementById("ratingFilter");
const availabilityFilter = document.getElementById("availabilityFilter");
const sortBy = document.getElementById("sortBy");
const priceFilter = document.getElementById("priceFilter");
const priceValue = document.getElementById("priceValue");
const heroContent = document.querySelector(".hero-content");

/* ===== STATE ===== */
let filteredProducts = [...products];

/* ===== SCROLL REVEAL ===== */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("reveal");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

/* ===== SKELETON LOADER ===== */
function showSkeletons(count = 6) {
  list.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const skel = document.createElement("div");
    skel.className = "product-card skeleton skeleton-card";
    list.appendChild(skel);
  }
}

/* ===== RENDER PRODUCTS ===== */
function renderProducts(items) {
  list.innerHTML = "";

  items.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.style.transitionDelay = `${index * 0.05}s`;

    card.innerHTML = `
      <span 
        class="wishlist ${isWishlisted(p.id) ? "active" : ""}"
        onclick="toggleWishlist(${p.id})"
      >
        ${isWishlisted(p.id) ? "❤️" : "🤍"}
      </span>

      <h4>${p.name}</h4>
      <p>₹${p.price}</p>
      <p>⭐ ${p.rating}</p>

      <a href="product.html?id=${p.id}">
        <button class="btn-primary">View</button>
      </a>

      <button class="btn-primary add-cart">Add to Cart</button>
    `;

    const addBtn = card.querySelector(".add-cart");
    addBtn.onclick = () => flyToCart(card, p);

    list.appendChild(card);
    observer.observe(card);
  });

  updateWishlistUI();
}
function renderRecentlyViewed() {
  const recentList = document.getElementById("recentList");
  if (!recentList) return;

  const recent = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
  recentList.innerHTML = "";

  recent.forEach(id => {
    const p = products.find(prod => prod.id === id);
    if (!p) return;

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <h4>${p.name}</h4>
      <p>₹${p.price}</p>
      <a href="product.html?id=${p.id}">
        <button class="btn-primary">View</button>
      </a>
    `;

    recentList.appendChild(card);
  });
}


/* ===== APPLY ALL FILTERS ===== */
function applyFilters() {
  let filtered = [...products];

  const text = searchInput.value.toLowerCase();
  const category = categoryFilter?.value;
  const rating = Number(ratingFilter?.value);
  const availability = availabilityFilter?.value;
  const sort = sortBy?.value;
  const maxPrice = priceFilter ? Number(priceFilter.value) : Infinity;

  filtered = filtered.filter(p =>
    p.name.toLowerCase().includes(text) &&
    p.price <= maxPrice
  );

  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }

  if (rating) {
    filtered = filtered.filter(p => p.rating >= rating);
  }

  if (availability === "in") {
    filtered = filtered.filter(p => p.stock > 0);
  }

  if (sort === "priceLow") filtered.sort((a, b) => a.price - b.price);
  if (sort === "priceHigh") filtered.sort((a, b) => b.price - a.price);
  if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating);
  if (sort === "popular") filtered.sort((a, b) => b.popularity - a.popularity);

  renderProducts(filtered);
}

/* ===== EVENTS ===== */
[
  searchInput,
  categoryFilter,
  ratingFilter,
  availabilityFilter,
  sortBy,
  priceFilter
].forEach(el => el && el.addEventListener("input", applyFilters));

if (priceFilter && priceValue) {
  priceValue.innerText = `₹${priceFilter.value}`;
  priceFilter.addEventListener("input", () => {
    priceValue.innerText = `₹${priceFilter.value}`;
  });
}

/* ===== HERO PARALLAX ===== */
window.addEventListener("scroll", () => {
  if (!heroContent) return;
  heroContent.style.transform = `translateY(${window.scrollY * 0.15}px)`;
});

/* ===== FLY TO CART ===== */
function flyToCart(sourceEl, product) {
  const cartIcon = document.getElementById("cartBtn");
  if (!cartIcon) return addToCart(product);

  const sourceRect = sourceEl.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  const flyEl = sourceEl.cloneNode(true);
  flyEl.classList.add("fly-item");
  document.body.appendChild(flyEl);

  flyEl.style.left = sourceRect.left + "px";
  flyEl.style.top = sourceRect.top + "px";
  flyEl.style.width = sourceRect.width + "px";

  requestAnimationFrame(() => {
    flyEl.style.transform = `
      translate(${cartRect.left - sourceRect.left}px,
                ${cartRect.top - sourceRect.top}px)
      scale(0.1)
    `;
    flyEl.style.opacity = "0";
  });

  setTimeout(() => {
    flyEl.remove();
    addToCart(product);
    cartIcon.classList.add("cart-bounce");
    setTimeout(() => cartIcon.classList.remove("cart-bounce"), 300);
  }, 700);
}

/* ===== INITIAL LOAD ===== */
showSkeletons();
setTimeout(() => renderProducts(products), 700);
renderRecentlyViewed();
function getRecommendations() {
  // take top popular products
  return [...products]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 4);
}
function renderRecommendations() {
  const list = document.getElementById("recommendList");
  if (!list) return;

  list.innerHTML = "";

  getRecommendations().forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <h4>${p.name}</h4>
      <p>₹${p.price}</p>
      <p>⭐ ${p.rating}</p>

      <a href="product.html?id=${p.id}">
        <button class="btn-primary">View</button>
      </a>
    `;

    list.appendChild(card);
  });
}
renderRecommendations();
