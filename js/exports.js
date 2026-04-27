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

export function loadCart() {
  const filledCart = localStorage.getItem("cart");
  if (filledCart) {
    cart = JSON.parse(filledCart);
  }
}
