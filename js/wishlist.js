let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function toggleWishlist(productId) {
  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter(id => id !== productId);
  } else {
    wishlist.push(productId);
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistUI();
}

function isWishlisted(productId) {
  return wishlist.includes(productId);
}

function updateWishlistUI() {
  document.querySelectorAll(".wishlist").forEach(icon => {
    const id = Number(icon.dataset.id);

    if (wishlist.includes(id)) {
      icon.classList.add("active");
      icon.innerText = "❤️";
    } else {
      icon.classList.remove("active");
      icon.innerText = "🤍";
    }
  });
}
