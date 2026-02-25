

// #region (Favourites slide and update )

let favourites = JSON.parse(localStorage.getItem('favourites')) || [];

function updateFavouriteCounter() {
  const countFavourite = document.querySelector('.count_favourits');
  if (countFavourite) countFavourite.textContent = favourites.length;
}

function saveFavourites() {
  localStorage.setItem('favourites', JSON.stringify(favourites));
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  toast.style.color = 'white';
  toast.style.padding = '10px 16px';
  toast.style.borderRadius = '6px';
  toast.style.fontSize = '14px';
  toast.style.zIndex = '9999';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.3s ease';

  document.body.appendChild(toast);
  setTimeout(() => toast.style.opacity = '1', 10);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 2000);
}

function renderFavorites() {
  const favoritesList = document.getElementById('favoritesList');
  if (!favoritesList) return;

  favoritesList.innerHTML = '';
  favourites.forEach((fav, index) => {
    const item = document.createElement('div');
    item.className = 'favorite-item';
    item.innerHTML = `
      <img src="${fav.img}" alt="${fav.name}" style="width: 100px; height: 100px; object-fit: cover;">
      <p style="margin: 6px 0;"><a href="#">${fav.name}</a></p>
      <button class="btn_add_cart_from_fav" data-index="${index}" style="padding: 4px 10px; background-color: var(--main_color); color: white; border: none; border-radius: 4px; cursor: pointer;">
        <i class="fa-solid fa-cart-shopping"></i> Add to Cart
      </button>
      <span class="remove-fav" data-index="${index}" style="cursor:pointer; margin-left:10px; color:red; font-size: 20px;">&times;</span>
    `;
    favoritesList.appendChild(item);
  });

  document.querySelectorAll('.remove-fav').forEach(btn => {
    btn.addEventListener('click', function () {
      const i = parseInt(this.getAttribute('data-index'));
      favourites.splice(i, 1);
      saveFavourites();
      updateFavouriteCounter();
      renderFavorites();
      showToast('Removed from Favorites');
    });
  });

  document.querySelectorAll('.btn_add_cart_from_fav').forEach(btn => {
    btn.addEventListener('click', function () {
      const i = parseInt(this.getAttribute('data-index'));
      const favItem = favourites[i];
      if (!favItem) return;

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const alreadyInCart = cart.some(item => item.name.toLowerCase() === favItem.name.toLowerCase());
      if (!alreadyInCart) {
        cart.push({ name: favItem.name, img: favItem.img, price: 0 });
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount?.();
        showToast('Added to Cart');
      } else {
        showToast('Already in Cart');
      }
    });
  });
}

function setupFavoriteButtons() {
  const favoriteButtons = document.querySelectorAll('.icon_product');
  favoriteButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      const productCard = this.closest('.product');
      if (!productCard) return;

      const nameEl = productCard.querySelector('.name_product a') || productCard.querySelector('.name_product');
      const imgEl = productCard.querySelector('.img_product img');
      if (!nameEl || !imgEl) return;

      const productName = nameEl.innerText.trim();
      const productImg = imgEl.getAttribute('src');

      const alreadyExists = favourites.some(fav => fav.name.toLowerCase() === productName.toLowerCase());

      if (!alreadyExists) {
        favourites.push({
          id: product.id,
          name: productName,
          img: productImg
        });
                saveFavourites();
        updateFavouriteCounter();
        renderFavorites?.();
        showToast('Added to Favorites');
      } else {
        showToast('Already in Favorites');
      }
    });
  });
}

updateFavouriteCounter();

document.addEventListener('DOMContentLoaded', function () {
  const favoriteSidebar = document.getElementById('favoritesSidebar');
  const closeSidebarBtn = document.getElementById('closeSidebar');
  const openFavoriteBtn = document.querySelector('.header-icons .icon a');

  if (favoriteSidebar && closeSidebarBtn && openFavoriteBtn) {
    openFavoriteBtn.addEventListener('click', function (e) {
      e.preventDefault();
      renderFavorites();
      favoriteSidebar.classList.add('active');
    });

    closeSidebarBtn.addEventListener('click', function () {
      favoriteSidebar.classList.remove('active');
    });
  }
});
// #endregion

//=====================================================================================

// #region (Swiper header)

// === Swiper Initialization ===
var swiperMain = new Swiper(".slide-swp", {
  pagination: { el: ".swiper-pagination", dynamicBullets: true, clickable: true },
  autoplay: { delay: 2500 },
  loop: true
});
// === Load Products from JSON ===

fetch('products_with_multiple_images.json')
  .then(response => response.json())
  .then(data => {
    const swiper_items_sale = document.getElementById("swiper_items_sale");
    const swiper_women = document.getElementById("swiper_women");
    const swiper_men = document.getElementById("swiper_men");

    data.forEach(product => {
      if (product.old_price) {
        const percent_disc = Math.floor((product.old_price - product.price) / product.old_price * 100);
        swiper_items_sale.innerHTML += `
          <div class="swiper-slide product">
            <span class="sale_present">%${percent_disc}</span>
            <div class="img_product">
  <img src="${product.images[0]}" alt="${product.name}">
</div>
            <div class="stars">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
            </div>
            <p class="name_product">
              <a href="product-details.html?id=${product.id}">${product.name}</a>
            </p>
            <div class="price">
              <p><span>$${product.price}</span></p>
              <p class="old_price">$${product.old_price}</p>
            </div>
            <div class="icons">
              <span class="btn_add_cart">
                <i class="fa-solid fa-cart-shopping"></i> add to cart
              </span>
              <span class="icon_product">
                <i class="fa-regular fa-heart"></i>
              </span>
            </div>
          </div>
        `;
      }
      
    });
    var swiperHotDeals = new Swiper(".hot-deals-swiper", {
      slidesPerView: 5,
      spaceBetween: 20,
      autoplay: { delay: 2500, disableOnInteraction: false },
      navigation: { nextEl: ".hot-deals-next", prevEl: ".hot-deals-prev" },
      loop: true,
      breakpoints: {
        1200: { slidesPerView: 5 },
        1000: { slidesPerView: 4 },
        700: { slidesPerView: 3 },
        0: { slidesPerView: 2 }
      }
    });
    data.forEach(product => {
      if (product.category === "women") {
        const old_price_Pargrahp = product.old_price ? `<p class="old_price">$${product.old_price}</p>` : "";
        const percent_disc_div = product.old_price ? `<span class="sale_present">%${Math.floor((product.old_price - product.price) / product.old_price * 100)}</span>` : "";
    
        swiper_women.innerHTML += `
          <div class="swiper-slide product">
            ${percent_disc_div}
            <div class="img_product">
  <img src="${product.images[0]}" alt="${product.name}">
</div>
            <div class="stars">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
            </div>
            <p class="name_product">
              <a href="product-details.html?id=${product.id}">${product.name}</a>
            </p>
            <div class="price">
              <p><span>$${product.price}</span></p>
              ${old_price_Pargrahp}
            </div>
            <div class="icons">
              <span class="btn_add_cart">
                <i class="fa-solid fa-cart-shopping"></i> add to cart
              </span>
              <span class="icon_product">
                <i class="fa-regular fa-heart"></i>
              </span>
            </div>
          </div>
        `;
      }
    });
    var swiperWomen = new Swiper(".women-swiper", {
      slidesPerView: 5,
      spaceBetween: 20,
      navigation: { nextEl: ".women-next", prevEl: ".women-prev" },
      loop: true,
      breakpoints: {
        1200: { slidesPerView: 5 },
        1000: { slidesPerView: 4 },
        700: { slidesPerView: 3 },
        0: { slidesPerView: 2 }
      }
    });

    data.forEach(product => {
      if (product.category === "men") {
        const old_price_Pargrahp = product.old_price ? `<p class="old_price">$${product.old_price}</p>` : "";
        const percent_disc_div = product.old_price ? `<span class="sale_present">%${Math.floor((product.old_price - product.price) / product.old_price * 100)}</span>` : "";
    
        swiper_men.innerHTML += `
          <div class="swiper-slide product">
            ${percent_disc_div}
            <div class="img_product">
  <img src="${product.images[0]}" alt="${product.name}">
</div>
            <div class="stars">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
            </div>
            <p class="name_product">
              <a href="product-details.html?id=${product.id}">${product.name}</a>
            </p>
            <div class="price">
              <p><span>$${product.price}</span></p>
              ${old_price_Pargrahp}
            </div>
            <div class="icons">
              <span class="btn_add_cart">
                <i class="fa-solid fa-cart-shopping"></i> add to cart
              </span>
              <span class="icon_product">
                <i class="fa-regular fa-heart"></i>
              </span>
            </div>
          </div>
        `;
      }
    });

    var swiperMen = new Swiper(".men-swiper", {
      slidesPerView: 5,
      spaceBetween: 20,
      navigation: { nextEl: ".men-next", prevEl: ".men-prev" },
      loop: true,
      breakpoints: {
        1200: { slidesPerView: 5 },
        1000: { slidesPerView: 4 },
        700: { slidesPerView: 3 },
        0: { slidesPerView: 2 }
      }
    });


setupFavoriteButtons();
setupCartButtons();

  });

//cart btn 

  function setupCartButtons() {
    const cartButtons = document.querySelectorAll('.btn_add_cart');
    cartButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const productCard = btn.closest('.product');
        if (!productCard) return;
  
        const nameEl = productCard.querySelector('.name_product a') || productCard.querySelector('.name_product');
        const imgEl = productCard.querySelector('.img_product img');
        const priceEl = productCard.querySelector('.price span');
  
        if (!nameEl || !imgEl || !priceEl) return;
  
        const name = nameEl.innerText;
        const img = imgEl.getAttribute('src');
        const price = parseFloat(priceEl.textContent.replace('$', ''));
  
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
        const alreadyInCart = cart.some(item => item.name === name);
        if (!alreadyInCart) {
          cart.push({ name, img, price });
          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartCount(); 
        }
      });
    });
  }
  


//haert btn update

function setupFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.icon_product');
    favoriteButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        const productCard = this.closest('.product');
        if (!productCard) return;
  
    
        const nameEl = productCard.querySelector('.name_product a') || productCard.querySelector('.name_product');
        const imgEl = productCard.querySelector('.img_product img');
        if (!nameEl || !imgEl) return;
  
        const productName = nameEl.innerText;
        const productImg = imgEl.getAttribute('src');
        if (favourites.some(fav => fav.name === productName)) {
          btn.classList.add("active");
          const icon = btn.querySelector("i");
          if (icon) {
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
          }
        }
        
  
        const alreadyExists = favourites.some(fav => fav.name === productName);
        
        if (alreadyExists) {

          favourites = favourites.filter(fav => fav.name !== productName);
          saveFavourites();
          updateFavouriteCounter();
          renderFavorites();
        
          btn.classList.remove("active");
          const icon = btn.querySelector("i");
          if (icon) {
            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");
          }
        
        } else {
  
          favourites.push({ name: productName, img: productImg });
          saveFavourites();
          updateFavouriteCounter();
          renderFavorites();
        
          btn.classList.add("active");
          const icon = btn.querySelector("i");
          if (icon) {
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
          }
        }
        
      });
    });
  }
// #endregion

//=========================================================================================//

// #region (Search Box )
  //search box

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.search-box').addEventListener('submit', function (e) {
      e.preventDefault();
  
      const category = document.getElementById("category").value.toLowerCase();
      const searchTerm = document.getElementById("Search").value.toLowerCase();
  
      document.querySelectorAll('.login_singup , .nav_links , .slider , .banners_4, .slider_products, footer').forEach(el => el.style.display = 'none');
  
      const resultsDiv = document.getElementById("searchResults");
      searchResults.style.display = "grid";
      document.getElementById("searchHeader").style.display = "block";
      document.body.classList.add("search-active");
      
      resultsDiv.innerHTML = "<p style='font-size: 20px;'>Loading...</p>";
  
      const backBtn = document.getElementById("backButton");
      backBtn.style.display = 'block';
      backBtn.onclick = function () {
        document.querySelectorAll('header, .slider, .banners_4, .slider_products, footer').forEach(el => el.style.display = '');
        resultsDiv.style.display = 'none';
        resultsDiv.innerHTML = '';
        backBtn.style.display = 'none';
        document.getElementById("Search").value = '';
      
// Recreate all swipers manually after back to home
        
        swiperMain = new Swiper(".slide-swp", {
          pagination: { el: ".swiper-pagination", dynamicBullets: true, clickable: true },
          autoplay: { delay: 2500 },
          loop: true
        });
      
        swiperHotDeals = new Swiper(".hot-deals-swiper", {
          slidesPerView: 5,
          spaceBetween: 20,
          autoplay: { delay: 2500, disableOnInteraction: false },
          navigation: { nextEl: ".hot-deals-next", prevEl: ".hot-deals-prev" },
          loop: true,
          breakpoints: {
            1200: { slidesPerView: 5 },
            1000: { slidesPerView: 4 },
            700: { slidesPerView: 3 },
            0: { slidesPerView: 2 }
          }
        });
      
        swiperWomen = new Swiper(".women-swiper", {
          slidesPerView: 5,
          spaceBetween: 20,
          navigation: { nextEl: ".women-next", prevEl: ".women-prev" },
          loop: true,
          breakpoints: {
            1200: { slidesPerView: 5 },
            1000: { slidesPerView: 4 },
            700: { slidesPerView: 3 },
            0: { slidesPerView: 2 }
          }
        });
      
        swiperMen = new Swiper(".men-swiper", {
          slidesPerView: 5,
          spaceBetween: 20,
          navigation: { nextEl: ".men-next", prevEl: ".men-prev" },
          loop: true,
          breakpoints: {
            1200: { slidesPerView: 5 },
            1000: { slidesPerView: 4 },
            700: { slidesPerView: 3 },
            0: { slidesPerView: 2 }
          }
        });
      };
      
  
      fetch('products_with_multiple_images.json')
        .then(res => res.json())
        .then(data => {
          const filtered = data.filter(product =>
            product.category.toLowerCase() === category &&
            (
              product.name.toLowerCase().includes(searchTerm) ||
              product.filter.toLowerCase().includes(searchTerm)
            )
          );
  
          if (filtered.length === 0) {
            resultsDiv.innerHTML = `<p style="font-size: 20px;">No results found for "<strong>${searchTerm}</strong>"</p>`;
            return;
          }
  
          resultsDiv.innerHTML = "";
  
          filtered.forEach(product => {
            const item = document.createElement('div');
            item.className = 'product';
  
            item.innerHTML = `
              ${product.old_price ? `<span class="sale_present">%${Math.floor((product.old_price - product.price) / product.old_price * 100)}</span>` : ""}
             <div class="img_product">
  <img src="${product.images[0]}" alt="${product.name}" />
</div>

              <p class="name_product">${product.name}</p>
              <div class="price">
                <p><span>$${product.price}</span></p>
                ${product.old_price ? `<p class="old_price">$${product.old_price}</p>` : ""}
              </div>
              <div class="icons">
                <span class="btn_add_cart">
                  <i class="fa-solid fa-cart-shopping"></i> add to cart
                </span>
                <span class="icon_product">
                  <i class="fa-regular fa-heart"></i>
                </span>
              </div>
            `;


// Favorite button

const favBtn = item.querySelector('.icon_product');

if (favourites.some(fav => fav.name === product.name)) {
  favBtn.classList.add("active");
  const icon = favBtn.querySelector("i");
  if (icon) {
    icon.classList.remove("fa-regular");
    icon.classList.add("fa-solid");
  }
}

favBtn.addEventListener('click', function () {
  const alreadyExists = favourites.some(fav => fav.name === product.name);
  const icon = favBtn.querySelector("i");

  if (alreadyExists) {

// remove from fav

    favourites = favourites.filter(fav => fav.name !== product.name);
    saveFavourites();
    updateFavouriteCounter();
    renderFavorites();
    favBtn.classList.remove("active");
    if (icon) {
      icon.classList.remove("fa-solid");
      icon.classList.add("fa-regular");
    }
  } else {

// add to fav

    favourites.push({ name: product.name, img: product.img });
    saveFavourites();
    updateFavouriteCounter();
    renderFavorites();
    favBtn.classList.add("active");
    if (icon) {
      icon.classList.remove("fa-regular");
      icon.classList.add("fa-solid");
    }
  }
});

// Cart button

            const cartBtn = item.querySelector('.btn_add_cart');
            cartBtn.addEventListener('click', function () {
              alert(`"${product.name}" added to cart!`);
            });
  
            resultsDiv.appendChild(item);
          });
        })
        .catch(err => {
          resultsDiv.innerHTML = `<p style="font-size: 20px; color: red;">Failed to load products.</p>`;
          console.error(err);
        });
    });
  });
  
  // #endregion

//========================================================================================================//

//#region function to close and open 

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'block';
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'none';
}
// #endregion
//=================================================================================//

//#region (Login and Sign in )


// connect btn with login and sign in  

document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.querySelector(".login_singup a:nth-child(1)");
  const signupBtn = document.querySelector(".login_singup a:nth-child(2)");

  if (loginBtn) {
    loginBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openModal('loginModal');
    });
  }

  if (signupBtn) {
    signupBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openModal('signupModal');
    });
  }
});
document.addEventListener("DOMContentLoaded", function () {


//Login Form 

  const loginForm = document.querySelector("#loginModal form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = loginForm.querySelector("input[type='email']").value;
      const password = loginForm.querySelector("input[type='password']").value;

      if (email.trim() && password.trim()) {
        alert("✅ Login successful");
        closeModal("loginModal");
        loginForm.reset();
      } else {
        alert("❌ Please fill all fields");
      }
    });
  }

//Sign Up Form

  const signupForm = document.querySelector("#signupModal form");
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const inputs = signupForm.querySelectorAll("input");
      const allFilled = Array.from(inputs).every(input => input.value.trim() !== "");

      if (allFilled) {

        alert("✅ Account created");
        closeModal("signupModal");
        signupForm.reset();
      } else {
        alert("❌ Please fill all fields");
      }
    });
  }
});
// #endregion

//=================================================================================//

//#region (Cart)

// cart

const cartSidebar = document.createElement("div");
cartSidebar.className = "favorites-sidebar";
cartSidebar.id = "cartSidebar";
cartSidebar.innerHTML = `
  <div class="favorites-header">
<h3>Cart</h3>
    <span id="closeCartSidebar">&times;</span>
  </div>
  <div id="cartList" class="favorites-list"></div>
  <div style="text-align:center; margin-top: 20px;">
    <button class="btn" onclick="location.href='checkout.html'">Checkout</button>
  </div>
`;
document.body.appendChild(cartSidebar);

// localStorage

function renderCartSidebar() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartList = document.getElementById("cartList");
  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = "<p>Your cart is empty</p>";
    return;
  }

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "favorite-item";
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <p>${item.name}</p>
      <p style="font-weight: bold; color: #ff8716;">$${item.price}</p>
      <span class="remove-cart" data-index="${index}">&times;</span>
    `;
    cartList.appendChild(div);
  });

  document.querySelectorAll(".remove-cart").forEach(btn => {
    btn.addEventListener("click", function () {
      const i = parseInt(this.getAttribute("data-index"));
      cart.splice(i, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCartSidebar();
      updateCartCount(); 
    });
  });
}

// open and close

document.getElementById("openCartSidebar").addEventListener("click", () => {
  renderCartSidebar();
  document.getElementById("cartSidebar").classList.add("active");
});

document.getElementById("closeCartSidebar").addEventListener("click", () => {
  document.getElementById("cartSidebar").classList.remove("active");
});
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = document.querySelector(".item_header");
  if (count) count.textContent = cart.length;
}

updateCartCount();

// #endregion

