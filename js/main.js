import {
  
    fetchProducts,
    filterProduct,
    findProduct
  
} from "../js/script.js";

const closeProductDialog = document.querySelector("dialog button");

let currentProducts = [];
const form = document.getElementById("registerForm");

// DOM Elements
const domElements = {

    productsContainer: document.getElementById("products-container"),
    filterSelect: document.querySelector("#filter"),

    viewBtn: document.getElementById("viewBtn"),

    cartIcon: document.getElementById("cart-icon"),
    wishlistIcon: document.getElementById("wishList-icon"),

    modals: {
        product: document.getElementById("product-modal"),
        cart: document.getElementById("cart-modal"),
        wishlist: document.getElementById("wishlist-modal"),
        login: document.getElementById("login-modal"),
        register: document.getElementById("register-modal"),
    },
};

// register
let modalReg = document.getElementById("id03");

// user register
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    if (!form) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = form.name.value.trim();
        const email = form.email.value.trim().toLowerCase();
        const password = form.registerPassword.value;
        const confirmPassword = form.confirmPassword.value;

        if (!name || !email || !password || !confirmPassword) {
            alert('All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        const isDuplicate = users.some(u =>
            u.email === email
        );
        if (isDuplicate) {
            alert('A user with that name or email already exists.');
            return;
        }

        const newUser = {
            name,
            email,
            password,
            isLoggedIn: false,
            favorites: [],
        };

        users.push(newUser);
        try {
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registration successful! Please log in.');
            document.getElementById('id03').style.display = 'none'
            document.getElementById('id01').style.display = 'block'
        } catch (err) {
            console.error('Storage error:', err);
            alert('Sorry, registration failed. Please try again.');
            form.reset();
        }
    });
});



// products
function renderProductList(products) {
    if (!domElements.productsContainer) return;

    domElements.productsContainer.innerHTML = products
        .map((product) =>
            `<div class="product transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900 hover:scale-105 h-[35rem] rounded-[.5rem] position-relative overflow-hidden bg-white" data-id="${product.id
            }">${product.discountPercentage
                ? `<div class="discount position-absolute top-[1rem] left-[1rem] w-[4rem] bg-emerald-500 text-white p-[0.5rem]">${product.discountPercentage}%</div>`
                : ""
            }
        <img src="${product.thumbnail}" alt="${product.title}">
        <div class="details text-center relative p-[2rem]">
          <div class="title font-bold text-gray-500">${product.title}</div>
          <div class="price text-emerald-900 font-bold text-3xl">R${product.price.toFixed(2)}</div>
          <div class="title font-thin text-gray-500">${product.category}</div>

           <div class="btn-group h-10 flex gap-2 mt-5">
          <button id="viewBtn"
            class="viewBtn flex-1 bg-emerald-900 rounded-full text-white transform hover:scale-105 hover:bg-emerald-900 hover:text-amber-400">View</button>
          <button id="cartBtn"
            class="cartBtn flex-1 border border-emerald-900 rounded-full transform hover:scale-105 text-emerald-900 text-sm"><i
              class="bi text-emerald-900 text-xl bi-cart-check-fill"></i> Buy</button>
          <button id="wishListBtn"
            class="wishListBtn flex-1 border border-amber-400 rounded-full transform hover:scale-105 text-amber-400 text-sm "><i
              class="bi text-amber-400 text-xl bi-heart-fill"></i> Favourite</button>
          </div>
        </div>
      </div>`).join("");
}

// Product Rendering
const renderProducts = async () => {
    try {
        currentProducts = await fetchProducts();
        renderProductList(currentProducts);
    } catch (error) {
        if (domElements.productsContainer) {
            domElements.productsContainer.innerHTML = ` <div class="error h-[10rem] bg-red-500 flex justify-content-center p-10 content-center items-center text-center ">⚠️ ${error.message}</div> `;
        }
    }
};

//show products
renderProducts();


//filter products
if (domElements.filterSelect) {
    domElements.filterSelect.addEventListener("change", () => {
      const category = domElements.filterSelect.value;
      const filtered =
        !category || category === "All Categories"
          ? currentProducts
          : currentProducts.filter((p) => p.category === category);
      renderProductList(filtered);
    });
  }
// show products
function showProductModal(product) {
    const modal = domElements.modals.product;
    if (!modal) {
      console.error("Product modal not found in the DOM");
      return;
    }
  
    // Main image
    const mainImg = modal.querySelector(".detailsModal > img");
    if (mainImg) {
      mainImg.src = product.thumbnail;
      mainImg.alt = product.title;
    }
  
    // alternative images container
    const altImagesContainer = modal.querySelector(".altImagesContainer");
    if (altImagesContainer) {
      // alternative image elements
      const altImages = altImagesContainer.querySelectorAll(".altImages");
      altImagesContainer.className = "altImagesContainer flex flex-row flex-1 w-[30%]"
  
      // clear images 
      altImages.forEach(imgElement => {
        imgElement.src = "";
        imgElement.alt = "";
      });
  
      // alternative images
      if (product.images && product.images.length > 0) {
        altImages.forEach((imgElement, index) => {
          if (index < product.images.length) {
            imgElement.src = product.images[index];
            imgElement.alt = product.title;
          }
        });
      }
    }
  
    // Brand
    const brand = modal.querySelector(".brand");
    if (brand) brand.textContent = `Brand: ${product.brand}`;
  
    // Rating
    const rating = modal.querySelector(".rating");
    if (rating) {
      // round rating to the nearest integer
      const roundedRating = Math.round(product.rating);
  
      //  stars rating
      let starsHTML = '';
      for (let i = 0; i < roundedRating; i++) {
        starsHTML += '<i class="bi gap-1  text-amber-400 bi-star-fill"></i> ';
      }
  
      rating.innerHTML = `Rating : ${starsHTML}`;
    }
  
    // Discount
    const discount = modal.querySelector(".discount");
    if (discount) discount.textContent = `${product.discountPercentage}%`;
  
    // Title
    const title = modal.querySelector(".title");
    if (title) title.textContent = product.title;
  
    // Category
    const category = modal.querySelector(".category");
    if (category) category.textContent = `Category: ${product.category}`;
  
    // Description
    const description = modal.querySelector(".description");
    if (description) description.textContent = product.description;
  
   // Stock
  const availabilityStatusElements = modal.querySelectorAll(".stock");
  availabilityStatusElements.forEach((element) => {
    element.textContent = product.availabilityStatus;
    // Change color based on availability status
    const status = product.availabilityStatus.toLowerCase();
    if (status === 'in stock') {
      element.style.color = '#064e3b'; // Bright green
      element.style.fontWeight = 'bold';
    } else if (status === 'low stock') {
      element.style.color = 'red'; // You can use '#FF0000' for a brighter red if you want
      element.style.fontWeight = 'bold';
    } else {
      element.style.color = '';
      element.style.fontWeight = '';
    }
  });
    
  
    // Quantity
    const quantity = modal.querySelector(".quantity");
    if (quantity) quantity.textContent = `Minimum order Quantity: ${product.minimumOrderQuantity}`;
  
    // return policy
    const returnPolicy = modal.querySelector(".returnPolicy");
    if (returnPolicy) returnPolicy.textContent = `Return Policy: ${product.returnPolicy}`
  
    // warranty info
    const warranty = modal.querySelector(".warrantyInfo");
    if (warranty) warranty.textContent = `Warranty Info : ${product.warrantyInformation}`
  
    // Price
    const price = modal.querySelector(".price");
    if (price) price.textContent = `R${product.price.toFixed(2)}`;
  
    // Show the modal
    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      modal.style.display = "block";
    }
  }

  // Event Handlers
const setupEventListeners = () => {
    // Product interactions
    if (!domElements.productsContainer) return;
  
    domElements.productsContainer.addEventListener("click", async (e) => {
      const productElement = e.target.closest(".product");
      if (!productElement) return;
  
      const productId = productElement.dataset.id;
      const product = findProduct(currentProducts, productId);
  
      if (e.target.closest(".viewBtn")) {
        showProductModal(product);
      }
    });
}



// Initialize event listeners
document.addEventListener("DOMContentLoaded", () => {
    const viewBtns = domElements.productsContainer.querySelectorAll('.viewBtn');
    viewBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const productId = this.getAttribute('data-id');
        const product = currentProducts.find(p => String(p.id) === String(productId));
        if (product) {
          showProductModal(product);
        }
      });
    });
})
// Modal close buttons
document.querySelectorAll(".modal-close").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest("dialog").close();
    });
  });
  


 // Initialize App
document.addEventListener("DOMContentLoaded", async () => {
    await renderProducts();
    setupEventListeners();
})
