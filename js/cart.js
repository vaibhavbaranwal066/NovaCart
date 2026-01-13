let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartDrawer = document.getElementById("cartDrawer");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

updateCartUI();

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
}

function changeQty(id, amount) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += amount;

  if (item.qty <= 0) {
    removeFromCart(id);
  } else {
    saveCart();
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div>
        <h4>${item.name}</h4>
        <p>₹${item.price}</p>
      </div>

      <div class="cart-controls">
        <button onclick="changeQty(${item.id}, -1)">−</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${item.id}, 1)">+</button>
        <button onclick="removeFromCart(${item.id})">✕</button>
      </div>
    `;

    cartItems.appendChild(div);
  });

  cartTotal.innerText = total;
  cartCount.innerText = cart.reduce((sum, i) => sum + i.qty, 0);
}

function toggleCart() {
  cartDrawer.classList.toggle("open");
}
