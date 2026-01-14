if (cart.length === 0) {
  showToast("Your cart is empty", "error");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
}

let currentStep = 1;
const steps = document.querySelectorAll(".step");
const stepIndicators = document.querySelectorAll(".steps span");

const summary = document.getElementById("summaryItems");
const cart = JSON.parse(localStorage.getItem("cart")) || [];

let total = 0;
cart.forEach(item => {
  total += item.price * item.qty;

  const div = document.createElement("div");
  div.innerText = `${item.name} × ${item.qty} — ₹${item.price * item.qty}`;
  summary.appendChild(div);
});

const totalDiv = document.createElement("p");
totalDiv.style.fontWeight = "bold";
totalDiv.innerText = `Total: ₹${total}`;
summary.appendChild(totalDiv);

function nextStep() {
  if (currentStep === 2) {
    const name = document.getElementById("name").value;
if (!name) {
  showToast("Please enter your name", "error");
  return;
}

  }

  steps[currentStep - 1].classList.remove("active");
  stepIndicators[currentStep - 1].classList.remove("active");

  currentStep++;

  steps[currentStep - 1].classList.add("active");
  stepIndicators[currentStep - 1].classList.add("active");

  if (currentStep === 4) {
    localStorage.removeItem("cart");
  }
}

function finish() {
  window.location.href = "index.html";
}
