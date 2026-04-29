"use strict";

import * as imported from "./exports.js";

// DON'T FORGET!!!!
// REMOVE ALL CONSOLE LOGS BEFORE SUBMITTING

// --- STATE ---
// This is where we will store the application's data, like the list of all games
// and the current state of pagination and filters.

const URL_ENDPOINT = "https://v2.api.noroff.dev/square-eyes";
let movieData = [];

// --- DOM ELEMENTS ---
// This is where we will select the elements from the HTML that we need to
// interact with, like containers and buttons.

const moviesContainer = document.getElementById("movies-container");
const buttonsDiv = document.getElementById("buttons-div");

// --- FUNCTIONS ---

async function fetchProduct() {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
      moviesContainer.textContent = "Something went wrong with the id";
      return;
    }

    const response = await fetch(`${URL_ENDPOINT}/${id}`);
    const result = await response.json();
    movieData = result.data;
  } catch (error) {
    // Add DOM-manipulation here later
    console.log("Error", error.message);
  }
}

async function createMovieCard(apiData) {
  console.log("apiData:", apiData);

  // Create constants for the values in the data
  const imageUrlValue = apiData.image.url;
  const imageAltValue = apiData.image.alt;
  const titleValue = apiData.title;
  const descriptionValue = apiData.description;
  const genreValue = apiData.genre;
  const ratingValue = apiData.rating;
  const releasedValue = apiData.released;
  const priceValue = apiData.discountedPrice;

  // creating the HTML elements and adding the values to them
  const movieDiv = document.createElement("div");
  movieDiv.classList.add("movie-card");
  const image = document.createElement("img");

  // Set src and alt for the image created
  image.setAttribute("src", imageUrlValue);
  image.setAttribute("alt", imageAltValue);
  const title = document.createElement("h3");
  title.textContent = titleValue;
  const description = document.createElement("p");
  description.textContent = descriptionValue;
  const genre = document.createElement("p");
  genre.textContent = `Genre: ${genreValue}`;
  const rating = document.createElement("p");
  rating.textContent = `Rating: ${ratingValue}`;
  const released = document.createElement("p");
  released.textContent = `Released: ${releasedValue}`;
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
    imported.loadCart();
    imported.addToCartToast(titleValue);
    imported.addToCart(apiData);
  });

  // Append to moviesContainer
  movieDiv.appendChild(image);
  movieDiv.appendChild(title);
  movieDiv.appendChild(description);
  movieDiv.appendChild(genre);
  movieDiv.appendChild(rating);
  movieDiv.appendChild(released);

  // Prices will both be shown if there is a discounted price
  if (apiData.onSale === true) {
    const priceNormalValue = apiData.price;
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
  movieDiv.appendChild(anchorDiv);
  moviesContainer.appendChild(movieDiv);
}

async function displayProduct() {
  // Get data from API
  await fetchProduct();
  // Creating the HTML for the movie cards
  const createdMovie = await createMovieCard(movieData);
}

// --- EVENT LISTENERS ---

// Add product-data to localStorage since it's being so annoying
// buttonsDiv.addEventListener("click", addToCart(event));

// --- INITIAL LOAD ---
// This is where we will call the initial function to fetch the data
// and render the page for the first time.

displayProduct();
