"use strict";

import * as imported from "./exports.js";

// DON'T FORGET!!!!
// REMOVE ALL CONSOLE LOGS BEFORE SUBMITTING

// --- STATE ---
// This is where we will store the application's data, like the list of all games
// and the current state of pagination and filters.

const URL_ENDPOINT = "https://v2.api.noroff.dev/square-eyes";
let movieData = [];
const dataForTotalPages = await fetchProducts();
let cart = [];
let currentPage = 1;
const itemsPerPage = 4;
const totalPages = Math.ceil(dataForTotalPages.length / itemsPerPage);

// 7.1 - Intro to Client-Side Pagination

// --- DOM ELEMENTS ---
// This is where we will select the elements from the HTML that we need to
// interact with, like containers and buttons.

const moviesContainer = document.getElementById("movies-container");
const anchorDiv = document.querySelector("anchor-div");

// --- FUNCTIONS ---

// Add Error message or do basic one below
/**
 * Fetches API-data
 */
async function fetchProducts() {
  try {
    const response = await fetch(URL_ENDPOINT);
    if (!response.ok) {
      moviesContainer.textContent = "Something went wrong when fetching data";
      throw new Error();
    }
    const result = await response.json();
    movieData = result.data;
    const movieDataJSON = JSON.stringify(movieData);
    return movieData;
    // localStorage.setItem("movieData", movieDataJSON);
  } catch (error) {
    // Add DOM-manipulation here later
    console.log("Error", error.message);
  }
}

// !!! Delete out-commented values when ready !!!
/**
 * Takes fetched API-data and creates cards for the
 * movies with its basic info to the DOM
 * @param {Array} apiData
 */
async function createMovieCards(apiData) {
  // Create constants for the values in the data
  for (let i = 0; i < apiData.length; i++) {
    const imageUrlValue = apiData[i].image.url;
    const imageAltValue = apiData[i].image.alt;
    const titleValue = apiData[i].title;
    /*
    const descriptionValue = apiData[i].description;
    const genreValue = apiData[i].genre;
    const ratingValue = apiData[i].rating;
    const releasedValue = apiData[i].released;
    */
    const priceValue = apiData[i].discountedPrice;

    // creating the HTML elements and adding the values to them
    const movieDiv = document.createElement("div");
    movieDiv.classList.add("movie-card");
    const image = document.createElement("img");

    // Set src and alt for the image created
    image.setAttribute("src", imageUrlValue);
    image.setAttribute("alt", imageAltValue);
    const title = document.createElement("h3");
    title.textContent = titleValue;
    /*
    const description = document.createElement("p");
    description.textContent = descriptionValue;
    const genre = document.createElement("p");
    genre.textContent = `Genre: ${genreValue}`;
    const rating = document.createElement("p");
    rating.textContent = `Rating: ${ratingValue}`;
    const released = document.createElement("p");
    released.textContent = `Released: ${releasedValue}`;
    */
    const priceDiscounted = document.createElement("p");
    priceDiscounted.textContent = `Price: ${priceValue} NOK `;
    const anchorDiv = document.createElement("div");

    // Putting both buttons in a container for placement
    anchorDiv.classList.add("anchor-div");
    anchorDiv.setAttribute("class", "anchor-div");
    const addToCartButton = document.createElement("button");
    addToCartButton.textContent = "add to cart";
    addToCartButton.setAttribute("class", "add-to-cart-button");
    // Adding to cart incl. toast message
    addToCartButton.addEventListener("click", () => {
      const apiDataProduct = apiData[i];
      imported.addToCartToast(titleValue);
      imported.addToCart(apiDataProduct);
      imported.loadCart();
    });
    const detailsAnchor = document.createElement("a");
    detailsAnchor.textContent = "details";
    detailsAnchor.setAttribute(
      "href",
      `product/index.html?id=${apiData[i].id}`,
    );
    // detailsButton.href = `product/index.html?id=${apiData[i].id}`;

    // Append to moviesContainer
    movieDiv.appendChild(image);
    movieDiv.appendChild(title);
    /*
    movieDiv.appendChild(description);
    movieDiv.appendChild(genre);
    movieDiv.appendChild(rating);
    movieDiv.appendChild(released);
    */

    // Prices will both be shown if there is a discounted price
    if (apiData[i].onSale === true) {
      const priceNormalValue = apiData[i].price;
      const priceDiscountedValueSpan = document.createElement("span");
      const priceNormalValueSpan = document.createElement("span");
      // Show both discounted price and non-discounted to see difference
      // and then also put a line through it w CSS
      priceDiscountedValueSpan.textContent = `${priceValue} NOK`;
      priceNormalValueSpan.textContent = `${priceNormalValue}`;
      priceNormalValueSpan.classList.add("discounted");
      priceDiscounted.textContent = "Price: ";
      priceDiscounted.appendChild(priceNormalValueSpan);
      priceDiscounted.appendChild(priceDiscountedValueSpan);
    }
    movieDiv.appendChild(priceDiscounted);
    anchorDiv.appendChild(addToCartButton);
    anchorDiv.appendChild(detailsAnchor);
    movieDiv.appendChild(anchorDiv);
    moviesContainer.appendChild(movieDiv);
  }
}

/**
 * Used as callback for dynamically
 * added event listener on cart buttons.
 * @param {Array<Object>.title} data - The title of the movie
 * gets added here (data) to show user what they added to cart
 * with a toast notification
 */
/*
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
*/
/**
 * Adds specific product to the cart and saves it in
 * localStorage on event listener in createMovieCards function
 * @param {Array<Object>} product - The full singular product
 * with all its separate values included
 */
/*
export function addToCart(product) {
  cart.push(product);
  const jsonCart = JSON.stringify(cart);
  localStorage.setItem("cart", jsonCart);
}
*/
/*
export function loadCart() {
  const filledCart = localStorage.getItem("cart");
  if (filledCart) {
    cart = JSON.parse(filledCart);
  }
}
*/

async function displayProducts() {
  // Get data from API
  await fetchProducts();
  // Creating the HTML for the movie cards
  const createdMovies = await createMovieCards(movieData);
}

// --- EVENT LISTENERS ---

// --- INITIAL LOAD ---
// This is where we will call the initial function to fetch the data
// and render the page for the first time.

imported.loadCart();
displayProducts();
