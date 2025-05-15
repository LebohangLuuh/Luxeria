import {
  
    fetchProducts, findProduct,
    filterProduct, 
    addItem, removeItem, updateQuantity, calculateTotal,
    toggleItem,
  
} from "../js/script.js";

const closeProductDialog = document.querySelector("dialog button");

let currentProducts = [];
const form = document.getElementById("registerForm");
let cart = JSON.parse(localStorage.getItem('persistentCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('persistentwishlist')) || [];

 let currentUser = JSON.parse(localStorage.getItem('currentUser'));

 console.log(currentUser);

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

//----------------------------------------------peristent cart and wishlist------------------------------------------------>
const persistCart = () => {
    localStorage.setItem('persistentCart', JSON.stringify(cart));
}
const persistWishlist = () => {
    localStorage.setItem('persistentwishlist', JSON.stringify(wishlist));
}
const clearPersistentData = () => {
    localStorage.removeItem('persistentCart');
    localStorage.removeItem('persistentwishlist');
}

//------------------------------------------ Notification System------------------------------------------------------------->
// const showNotification = (message) => {
//     const notification = document.createElement('div');
//     notification.className = 'notification';
//     notification.textContent = message;
//     document.body.appendChild(notification);
//     setTimeout(() => notification.remove(), 1500);
// };

// ----------------------------------------------Cart Management------------------------------------------------------------------->
const updateCartUI = () => {
    // Update cart count
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    domElements.cartIcon.querySelector('span').textContent = cartCount;

    // Update cart modal
    const cartContent = domElements.modals.cart.querySelector('.modal-content');
    cartContent.innerHTML = cart.length ? cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.thumbnail}" class="cart-item-image">
            <div class="cart-item-info">
                <h4>${item.title}</h4>
                <p>R${item.price.toFixed(2)} 
                    <button class="btn quantity-btn" data-action="decrease">-</button>
                    ${item.quantity}
                    <button class="btn quantity-btn" data-action="increase">+</button>
                </p>
                <p>Subtotal: R${(item.price * item.quantity).toFixed(2)}</p>
                <button class="btn btn-primary remove-btn">Remove</button>
            </div>
        </div>
    `).join('') : '<p>Your cart is empty</p>';

    // Update cart summary
    const total = calculateTotal(cart);
    domElements.modals.cart.querySelector('.cart-summary').innerHTML = `
        <h3>Total: R${total.toFixed(2)}</h3>
        <button class="btn btn-primary checkout-btn">Checkout</button>
        <button id = "clearCartBtn" class = "btn btn-primary clearCartBtn">CLEAR CART</button>
        
    `;
};

//-----------------------------------------------Wishlist Management------------------------------------------------------------->
const updateWishlistUI = () => {
    const wishlistContent = domElements.modals.wishlist.querySelector('.modal-content');
    wishlistContent.innerHTML = wishlist.length ? wishlist.map(item => `
        <div class="wishlist-item" data-id="${item.id}">
            <img src="${item.thumbnail}" class="wishlist-item-image">
            <div class="wishlist-item-info">
                <h4>${item.title}</h4>
                <p>R${item.price.toFixed(2)}</p>
                <button class="btn btn-primary remove-btn">Remove</button>
            </div>
        </div>
    `).join('') : '<p>Your wishlist is empty</p>';
};
//--------------------------------------------------Checkout---------------------------------------------------------------------->

const handleCheckout = (e) => {
  e.preventDefault();
  if (!currentUser) {
      alert('Please log in or register to proceed with checkout!');
      domElements.modals.login.showModal();
      return;
  }
  if (cart.length !== 0) {
      alert('✔Checkout successful! Your order is being processed !');
      clearCartFn();
      clearPersistentData(); 
      updateCartUI();
  } 
  else {
      alert('⚠️ Your cart is empty! Please add items to your cart before checking out!');
  }
}

//---------------------------------------------clearCart function----------------------------------------------------------->
const clearCartFn = () =>{
  cart.length = 0;
  updateCartUI();
  localStorage.removeItem('persistentCart');

}



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


// hide and show login/logout state
function updateLoginState() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
  const loginLink = document.querySelector(".login");
  const registerLink = document.querySelector(".register");
  const logoutLink = document.querySelector(".logout");
  const userWelcome = document.querySelector(".user");
  const usernameSpan = document.getElementById("username");
  
  if (currentUser) {
    // User is logged in
    loginLink.classList.add("hidden");
    registerLink.classList.add("hidden");
    logoutLink.classList.remove("hidden");
    userWelcome.classList.remove("hidden");
    
    // Set the username in the welcome message
    if (usernameSpan) {
      usernameSpan.textContent = currentUser.name;
    }
  } else {
    // User is logged out
    loginLink.classList.remove("hidden");
    registerLink.classList.remove("hidden");
    logoutLink.classList.add("hidden");
    userWelcome.classList.add("hidden");
  }
}

// login
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');

  if (!emailInput || !passwordInput) return;

  
  // all registered users from localStorage  
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    const user = users.find(u =>
      u.email === email && u.password === password
    );

    if (!user) {
      alert('Please enter valid email and password.');
      console.log("")
      return;
    }

    user.isLoggedIn = true;

    localStorage.setItem('users', JSON.stringify(users));

    localStorage.setItem('currentUser', JSON.stringify(user));

    alert('Login successful!');
    emailInput.value = '';
    passwordInput.value = '';
    document.getElementById('id01').style.display = 'none';
    
    // Update the UI to reflect logged-in state
    updateLoginState();
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

 // ---------------------------------------------------Event Handlers-------------------------------------------------------------------->
const setupEventListeners = () => {

  //-------Checkout button handler---->
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('checkout-btn')) {
        handleCheckout(e);
        //domElements.modals.cart.close();
    }
});

  //------------------------ clear cart ------------------------------------------------------------------------->
    document.addEventListener('click', (e) => {
        if(e.target.classList.contains('clearCartBtn')){

            clearCartFn();
        }
    })


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

    //------------------------- Product interactions ------------------------------------------------------------>
    domElements.productsContainer.addEventListener('click', async (e) => {
        const productElement = e.target.closest('.product');
        if (!productElement) return;

        const productId = productElement.dataset.id;
        const product = findProduct(currentProducts, productId);


        if (e.target.closest('.cartBtn')) {
            cart = addItem(cart, product);
            updateCartUI();
            persistCart();
            alert('Added to cart 🛒');
        }

        if (e.target.closest('.wishListBtn')) {
            const result = toggleItem(wishlist, product);
            wishlist = result.updatedList;
            updateWishlistUI();
            persistWishlist();
            alert(result.action === 'added' ?
                'Added to wishlist 💖' : 'Removed from wishlist ❌');
        }
    });


    //----------------------------------Cart interactions--------------------------------------------------------->
    domElements.modals.cart.addEventListener('click', (e) => {
        const itemElement = e.target.closest('.cart-item');
        if (!itemElement) return;

        const productId = itemElement.dataset.id;

        if (e.target.closest('.quantity-btn')) {
            const action = e.target.dataset.action;
            cart = updateQuantity(cart, parseInt(productId),
                action === 'increase' ? 1 : -1);
            updateCartUI();
            persistCart();
        }

        if (e.target.closest('.remove-btn')) {
            cart = removeItem(cart, parseInt(productId));
            updateCartUI();
            persistCart();
            alert('Removed from cart 🗑️');
        }
        //-------------------clearCart---------------------->
        // if (e.target.closest('.clearCartBtn')){
        //   console.log("Buton works...............")
        //     clearCartFn();
        //     updateCartUI;
        // }
    });

    //--------------------------------- Wishlist interactions-------------------------------------------->
    domElements.modals.wishlist.addEventListener('click', (e) => {
        const itemElement = e.target.closest('.wishlist-item');
        if (!itemElement) return;

        const productId = parseInt(itemElement.dataset.id);
        const product = findProduct(currentProducts, productId);

        if (e.target.closest('.remove-btn')) {
            const result = toggleItem(wishlist, product);
            wishlist = result.updatedList;
            updateWishlistUI();
            persistWishlist();
            alert('Removed from wishlist ❌');
        }
    });

    //-----------------------------Modal close buttons----------------------------------------->
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('dialog').close();
        });
    });

    //----------------------------Cart and Wishlist buttons------------------------------------------->
    domElements.cartIcon.addEventListener('click', () => {
        updateCartUI();
        domElements.modals.cart.showModal();
    });

    domElements.wishlistIcon.addEventListener('click', () => {
        updateWishlistUI();
        domElements.modals.wishlist.showModal();
    });

};


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

  // Update login/logout state
  updateLoginState();

  // Add logout functionality
  const logoutLink = document.querySelector(".logout");
  if (logoutLink) {
    logoutLink.addEventListener("click", function() {
      // Clear user data from localStorage
      localStorage.removeItem("currentUser");
      // Update the UI
      updateLoginState();
      // Show a logout message
      alert("You have been logged out successfully");
    });
  }

  // Add login functionality
  const loginLink = document.querySelector(".login");
  if (loginLink) {
    loginLink.addEventListener("click", function(e) {
      e.preventDefault();
      document.getElementById('id01').style.display = 'block';
    });
  }

  // Add register functionality
  const registerLink = document.querySelector(".register");
  if (registerLink) {
    registerLink.addEventListener("click", function(e) {
      e.preventDefault();
      document.getElementById('id03').style.display = 'block';
    });
  }
});

