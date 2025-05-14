// Product fetching and validation
async function fetchProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products");
    if (!response.ok) throw new Error("Failed to fetch products");
    const { products } = await response.json();
    return products;
  } catch (error) {
    throw new Error(`Product Service Error: ${error.message}`);
  }
}

function findProduct(products, productId) {
  return products.find((p) => p.id === parseInt(productId));
}

//filter product by category
function filterProduct(products, category) {
  if (!category) return products;
  return products.filter(
    (product) =>
      product.category &&
      product.category.toLowerCase() === category.toLowerCase()
  );
}

export { fetchProducts, findProduct, filterProduct };

//login
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  if (!emailInput || !passwordInput) return;

  //all registered users from localStorage
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      alert("please enter valid email and password");
      return;
    }

    users.isLoggedIn = true;
    localStorage.setItem("users", JSON.stringify(user));

    localStorage.setItem("currentUser", JSON.stringify(user));

    arlet("login successful!");
    emailInput.value = "";
    passwordInput.value = "";
    document.getElementById("id01").style.display = "none";

    //update the UI to reflect logged-in state
    updateLoggedinState;
  });
});
