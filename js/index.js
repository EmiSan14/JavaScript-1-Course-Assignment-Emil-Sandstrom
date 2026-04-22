"use strict";

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

// --- FUNCTIONS ---

async function fetchProducts() {
  try {
    const response = await fetch(URL_ENDPOINT);
    if (!response.ok) {
      throw new Error();
    }
    const result = await response.json();
    movieData = result.data;
    console.log("movieData:", movieData);
  } catch (error) {
    // Add DOM-manipulation here later
    console.log("Error", error.message);
  }
}
fetchProducts();

function displayProducts() {
  // Get data from API
  fetchProducts();
  // Create HTML elements from API-data
  for (let i = 0; i < movieData.length; i++) {
    const imageUrlValue = movieData[i].image.url;
    const imageAltValue = movieData[i].image.alt;
    const titleValue = movieData[i].title;
    const descriptionValue = movieData[i].description;
    const ratingValue = movieData[i].rating;
    const releasedValue = movieData[i].released;
    if (movieData[i].onSale === true) {
      const priceValue = movieData[i].discountedPrice;
    } else {
      const priceValue = movieData[i].price;
    }
    const imageUrl;
    imageUrl.textContent = imageUrlValue;
    const imageAltValue;
    imageAlt.textContent = imageAltValue;
    const title;
    title.textContent = titleValue;
    const description;
    description.textContent = descriptionValue;
    const rating;
    rating.textContent = ratingValue;
    const released;
    released.textContent = releasedValue;
    const price;
    price.textContent = priceValue;
    // Append to moviesContainer
  }
}

// --- EVENT LISTENERS ---

// --- INITIAL LOAD ---
// This is where we will call the initial function to fetch the data
// and render the page for the first time.
