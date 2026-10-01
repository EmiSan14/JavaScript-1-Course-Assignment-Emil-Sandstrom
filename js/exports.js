const moviesContainer = document.getElementById("movies-container");
const anchorDiv = document.querySelector("anchor-div");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const numberedPagesContainer = document.getElementById(
  "numbered-pages-container",
);
const searchInput = document.getElementById("search-input");

const URL_ENDPOINT = "https://v2.api.noroff.dev/square-eyes";
let movieData = [];
const fetchedData = await fetchProducts();
let cart = [];
let currentPage = 1;
const itemsPerPage = 4;

// --- FETCHING DATA ---

/**
 * Fetching API-data
 * @returns - Said API-data
 */
export async function fetchProducts() {
  try {
    const response = await fetch(URL_ENDPOINT);
    if (!response.ok) {
      moviesContainer.textContent = "Something went wrong when fetching data";
      throw new Error();
    }
    const result = await response.json();
    movieData = result.data;
    return movieData;
  } catch (error) {
    const p = document.createElement("p");
    p.textContent = "Failed to fetch API-Data. Try again";
    moviesContainer.appendChild("p");
  }
}

// --- CART-SPECIFIC ---

/**
 * Used as callback for dynamically
 * added event listener on cart buttons.
 * @param {Array<Object>.title} data - The title of the movie
 * gets added here (data) to show user what they added to cart
 * with a toast notification
 */
export function addToCartToast(data) {
  const toastDiv = document.getElementById("toast-container");
  toastDiv.classList.remove("hidden");
  const toastMessage = document.createElement("p");
  toastMessage.textContent = `Added ${data} to cart!`;
  toastDiv.appendChild(toastMessage);

  setTimeout(() => {
    toastDiv.classList.add("hidden");
    toastMessage.classList.add("hidden");
  }, 3000);
}

/**
 * Used as callback for dynamically
 * added event listener on cart buttons.
 * @param {Array<Object>.title} data - The title of the movie
 * gets added here (data) to show user what they removed from cart
 * with a toast notification
 */
export function removeFromCartToast(data) {
  const toastDiv = document.getElementById("toast-container");
  toastDiv.classList.remove("hidden");
  const toastMessage = document.createElement("p");
  toastMessage.textContent = `Removed ${data} from cart!`;
  toastDiv.appendChild(toastMessage);

  setTimeout(() => {
    toastDiv.classList.add("hidden");
    toastMessage.classList.add("hidden");
  }, 3000);
}

/**
 * Adds specific product to the cart after checking whether
 * it exists in the cart before and saves it/adds quantity in
 * localStorage on event listener in createMovieCards function
 * @param {Array<Object>} product - The full singular product
 * with all its separate values included
 */
export function addToCart(product) {
  const cartFromStorage = loadCart();
  const onlyItems = [];

  if (cartFromStorage.length === 0) {
    const cartItem = {
      item: product,
      quantity: 1,
    };
    cartFromStorage.push(cartItem);
  } else if (cartFromStorage.length === 1) {
    if (cartFromStorage[0].item.id === product.id) {
      cartFromStorage[0].quantity += 1;
    } else {
      const cartItem = {
        item: product,
        quantity: 1,
      };
      cartFromStorage.push(cartItem);
      cartFromStorage.forEach((onlyItem) => {
        onlyItems.push(onlyItem.item);
      });
    }
  } else {
    console.log("onlyItems:", onlyItems);
    for (let i = 0; i < cartFromStorage.length; i++) {
      if (cartFromStorage[i].item.id === product.id) {
        cartFromStorage[i].quantity += 1;
      }
    }
  }
  let nr = 0;
  for (let i = 0; i < cartFromStorage.length; i++) {
    if (cartFromStorage[i].item.id === product.id) {
      break;
    } else {
      nr += 1;
      continue;
    }
  }
  if (nr === cartFromStorage.length) {
    const cartItem = {
      item: product,
      quantity: 1,
    };
    cartFromStorage.push(cartItem);
  }
  const jsonCart = JSON.stringify(cartFromStorage);
  localStorage.setItem("cart", jsonCart);
}

/**
 * Removes specific product from the cart and saves new cart in
 * localStorage on event listener in createMovieCards function
 * @param {Array<Object>} arrayIndex - Index of the item to be
 * skipped in the new cart-arrays list
 * @returns {Array<Object>} newCart - The new array for use in
 * a different function to handle case of empty cart before page
 * reload
 */
export function removeFromCart(arrayIndex) {
  const newCart = cart.filter((index) => {
    return index !== arrayIndex;
  });
  const jsonCart = JSON.stringify(newCart);
  localStorage.setItem("cart", jsonCart);
  return newCart;
}

/**
 * Loads cart items stored in localStorage
 * @returns {Array}
 */
export function loadCart() {
  const filledCart = localStorage.getItem("cart");
  if (filledCart) {
    cart = JSON.parse(filledCart);
    return cart;
  } else {
    cart = [];
    return cart;
  }
}

/**
 * Self-explanatory. Clears the cart from localStorage.
 */
export function clearCart() {
  const filledCart = localStorage.getItem("cart");
  if (filledCart) {
    localStorage.removeItem("cart");
  }
}

/**
 *
 * @param {Array} cartArray - Whatever items are in
 * the cart currently
 * @returns - The total sum of every items
 * price added together.
 */
export function calculatePrice(cartArray) {
  let totalPrice = 0;
  let totalSingularPrice = 0;
  cartArray.forEach((cartItem) => {
    totalSingularPrice = 0;
    totalSingularPrice += cartItem.item.discountedPrice;
    totalSingularPrice *= cartItem.quantity;
    totalPrice += totalSingularPrice;
  });
  const finalPrice = totalPrice.toFixed(2);
  return finalPrice;
}

/**
 * Adds a button for paying for whatever items are in the cart
 * @param {DOM element} divToAppendTo - The div in
 * the cart that holds the items
 * @param {URL} url - The url/path that the confirmation-page
 * is at.
 * @returns - The anchor created to be used as
 * the path to purchasing the cart items.
 */
export function confirmPurchase(divToAppendTo, url) {
  const confirmPurchaseAnchor = document.createElement("a");
  confirmPurchaseAnchor.textContent = "confirm purchase";
  confirmPurchaseAnchor.setAttribute("href", url);
  divToAppendTo.appendChild(confirmPurchaseAnchor);
  return confirmPurchaseAnchor;
}

/**
 * When the cart is empty, this will be added to signify that.
 * @param {array} cartArray - The cart-items
 * @param {DOM element} htmlDiv - The div that the cart is
 * attached to.
 */
export function inCaseOfEmptyCart(cartArray, htmlDiv) {
  if (!cartArray || cartArray.length === 0) {
    const newPElement = document.createElement("p");
    newPElement.textContent = "Your cart is empty";
    htmlDiv.appendChild(newPElement);
  }
}

// --- MISC-FUNCTIONS ---

export function hideItem(item) {
  item.classList.add("hidden");
}

export function removeItem(item) {
  item.remove();
}

export function readLength(element) {
  const length = element.length;
  return length;
}
