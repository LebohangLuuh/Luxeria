import {
  
    fetchProducts,
    filterProduct
  
} from "../js/script.js";


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
