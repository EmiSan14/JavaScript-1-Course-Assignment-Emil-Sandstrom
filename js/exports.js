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
    // Add DOM-manipulation here later
    console.log("Error", error.message);
  }
}

// --- HOME-PAGE ---

/**
 *
 * @param {input.value} searchTerm - Whatever gets put
 * into the search-input on the home-page.
 * @returns - The filtered list of items to be read elsewhere
 * and used for updating the HTML.
 */
export async function filterMovies(searchTerm) {
  try {
    if (!searchTerm) {
      return fetchedData;
    }

    const filteredList = fetchedData.filter((movie) => {
      const trimmedSearchTerm = searchTerm.toLowerCase().trim();
      const nameMatch = movie.title.toLowerCase().includes(trimmedSearchTerm);
      const descriptionMatch = movie.description
        .toLowerCase()
        .includes(trimmedSearchTerm);
      const genreMatch = movie.genre.toLowerCase().includes(trimmedSearchTerm);
      return nameMatch || descriptionMatch || genreMatch;
    });

    return filteredList;
  } catch (error) {
    console.log(error);
    const errorP = document.createElement("p");
    errorP.textContent =
      "Something went wrong when fetching data. Try again later.";
    moviesContainer.appendChild(errorP);
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
 * Adds specific product to the cart and saves it in
 * localStorage on event listener in createMovieCards function
 * @param {Array<Object>} product - The full singular product
 * with all its separate values included
 */
export function addToCart(product) {
  cart.push(product);
  const jsonCart = JSON.stringify(cart);
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
  cartArray.forEach((item) => {
    totalPrice += item.discountedPrice;
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
