/* ===== GET PRODUCT FROM URL ===== */
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));
const product = products.find(p => p.id === productId);
/* RECENTLY VIEWED */
let recent = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

// remove if already exists
recent = recent.filter(id => id !== product.id);

// add to front
recent.unshift(product.id);

// keep only last 4
recent = recent.slice(0, 4);

localStorage.setItem("recentlyViewed", JSON.stringify(recent));

if (!product) {
  alert("Product not found");
  window.location.href = "index.html";
}

/* ===== ELEMENTS ===== */
const mainImage = document.getElementById("mainImage");
const thumbnails = document.getElementById("thumbnails");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const wishlistBtn = document.getElementById("wishlistBtn");
const addToCartBtn = document.getElementById("addToCartBtn");

const ratingDiv = document.getElementById("rating");
const stockDiv = document.getElementById("stock");
const sizeOptions = document.getElementById("sizeOptions");
const colorOptions = document.getElementById("colorOptions");
const reviewsDiv = document.getElementById("reviews");

/* ===== BASIC INFO ===== */
mainImage.src = product.images[0];
productName.innerText = product.name;
productPrice.innerText = `₹${product.price}`;
/* DELIVERY ESTIMATE */
const deliveryEl = document.getElementById("deliveryEstimate");

const deliveryDate = new Date();
deliveryDate.setDate(deliveryDate.getDate() + 3 + Math.floor(Math.random() * 3));

deliveryEl.innerText =
  "🚚 Delivery by " +
  deliveryDate.toDateString();
/* DYNAMIC PRICING */
const priceBox = document.getElementById("priceBox");

const discount = product.originalPrice - product.price;
const discountPercent = Math.round((discount / product.originalPrice) * 100);
const tax = Math.round(product.price * 0.18); // 18% GST (India realistic)
const finalPrice = product.price + tax;

priceBox.innerHTML = `
  <div>
    <span>MRP</span>
    <span>₹${product.originalPrice}</span>
  </div>

  <div>
    <span>Discount (${discountPercent}%)</span>
    <span>-₹${discount}</span>
  </div>

  <div>
    <span>Tax (18%)</span>
    <span>₹${tax}</span>
  </div>

  <div class="total">
    <span>Total</span>
    <span>₹${finalPrice}</span>
  </div>
`;

/* ===== DISCOUNT BADGE ===== */
if (product.originalPrice && product.originalPrice > product.price) {
  const badge = document.createElement("div");
  badge.className = "badge";
  badge.innerText = "SALE";
  document.querySelector(".details")?.appendChild(badge);
}

/* ===== RATING ===== */
if (ratingDiv && product.rating) {
  ratingDiv.innerText =
    "⭐".repeat(Math.floor(product.rating)) + ` (${product.rating})`;
}

/* ===== STOCK ===== */
if (stockDiv) {
  if (product.stock > 0) {
    stockDiv.innerText = `In Stock (${product.stock} left)`;
  } else {
    stockDiv.innerText = "Out of Stock";
    stockDiv.classList.add("out");
    addToCartBtn.disabled = true;
  }
}

/* ===== IMAGE GALLERY ===== */
product.images.forEach((img, index) => {
  const thumb = document.createElement("img");
  thumb.src = img;
  if (index === 0) thumb.classList.add("active");

  thumb.onclick = () => {
    mainImage.src = img;
    document.querySelectorAll(".thumbnails img")
      .forEach(i => i.classList.remove("active"));
    thumb.classList.add("active");
  };

  thumbnails.appendChild(thumb);
});

/* ===== SIZE OPTIONS ===== */
if (sizeOptions && product.sizes) {
  product.sizes.forEach((size, i) => {
    const span = document.createElement("span");
    span.innerText = size;
    if (i === 0) span.classList.add("active");

    span.onclick = () => {
      document.querySelectorAll("#sizeOptions span")
        .forEach(s => s.classList.remove("active"));
      span.classList.add("active");
    };

    sizeOptions.appendChild(span);
  });
}

/* ===== COLOR OPTIONS ===== */
if (colorOptions && product.colors) {
  product.colors.forEach((color, i) => {
    const span = document.createElement("span");
    span.innerText = color;
    if (i === 0) span.classList.add("active");

    span.onclick = () => {
      document.querySelectorAll("#colorOptions span")
        .forEach(c => c.classList.remove("active"));
      span.classList.add("active");
    };

    colorOptions.appendChild(span);
  });
}

/* ===== REVIEWS ===== */
if (reviewsDiv && product.reviews) {
  product.reviews.forEach(r => {
    const div = document.createElement("div");
    div.className = "review";
    div.innerHTML = `<strong>${r.user}</strong><p>${r.text}</p>`;
    reviewsDiv.appendChild(div);
  });
}

/* ===== WISHLIST ===== */
wishlistBtn.onclick = () => toggleWishlist(product.id);
updateWishlistUI();

/* ===== ADD TO CART ===== */
addToCartBtn.onclick = () => {
  if (product.stock <= 0) {
    showToast("Out of stock", "error");
    return;
  }
  addToCart(product);
};
