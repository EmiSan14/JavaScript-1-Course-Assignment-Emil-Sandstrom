export let cart = [];

export async function fetchProducts() {
  try {
    const response = await fetch(URL_ENDPOINT);
    if (!response.ok) {
      moviesContainer.textContent = "Something went wrong when fetching data";
      throw new Error();
    }
    const result = await response.json();
    movieData = result.data;
    const movieDataJSON = JSON.stringify(movieData);
    // localStorage.setItem("movieData", movieDataJSON);
  } catch (error) {
    // Add DOM-manipulation here later
    console.log("Error", error.message);
  }
}

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
  }
}

export function clearCart() {
  const filledCart = localStorage.getItem("cart");
  if (filledCart) {
    localStorage.removeItem("cart");
  }
}

export function hideItem(item) {
  item.classList.add("hidden");
}

export function removeItem(item) {
  item.remove();
}

export function inCaseOfEmptyCart(cartArray, htmlDiv) {
  if (!cartArray || cartArray.length === 0) {
    const newPElement = document.createElement("p");
    newPElement.textContent = "Your cart is empty";
    htmlDiv.appendChild(newPElement);
  }
}

export function readLength(element) {
  const length = element.length;
  return length;
}

export function calculatePrice(cartArray) {
  let totalPrice = 0;
  cartArray.forEach((item) => {
    totalPrice += item.discountedPrice;
  });
  const finalPrice = totalPrice.toFixed(2);
  return finalPrice;
}

export function confirmPurchase(divToAppendTo, url) {
  const confirmPurchaseAnchor = document.createElement("a");
  confirmPurchaseAnchor.textContent = "confirm purchase";
  confirmPurchaseAnchor.setAttribute("href", url);
  divToAppendTo.appendChild(confirmPurchaseAnchor);
  return confirmPurchaseAnchor;
}
