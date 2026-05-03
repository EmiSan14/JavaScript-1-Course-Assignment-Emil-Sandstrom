"use strict";

import * as imported from "./exports.js";

// --- STATE ---

const URL_ENDPOINT = "https://v2.api.noroff.dev/square-eyes";
let movieData = [];
const fetchedData = await imported.fetchProducts();
let cart = [];
let currentPage = 1;
const itemsPerPage = 4;

// --- DOM ELEMENTS ---

const moviesContainer = document.getElementById("movies-container");
const anchorDiv = document.querySelector("anchor-div");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const numberedPagesContainer = document.getElementById(
  "numbered-pages-container",
);
const searchInput = document.getElementById("search-input");
const checkboxForm = document.getElementById("filter-form");

// --- FUNCTIONS ---

/**
 *
 * @param {Array} arrayOfMovies - The full API-data that
 * will be sliced for creating pages
 * @param {number} currentPage - Number that will change
 * depending on event listeners adding or subtracting from it
 * by help of prev or next-buttons
 */
async function pagePagination(arrayOfMovies, currentPage) {
  moviesContainer.innerHTML = '<div class="spinner"></div>';
  try {
    moviesContainer.innerHTML = "";
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = arrayOfMovies.slice(startIndex, endIndex);
    const totalPages = Math.ceil(arrayOfMovies.length / itemsPerPage);

    await createMovieCards(pageItems);

    renderNumberedButtons(totalPages, currentPage);

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages || totalPages < 1;
  } catch {
    const errorP = document.createElement("p");
    errorP.textContent =
      "Something went wrong when fetching data. Try again later.";
    moviesContainer.appendChild(errorP);
  }
}

/**
 * Creates numbered buttons for however many total
 * pages there will be.
 * @param {number} numberOfPages - The total amount of pages
 * that will be necessary for the pagination
 * @param {number} currentPage - Needed for adding
 * active-class to current page.
 */
function renderNumberedButtons(numberOfPages, currentPage) {
  numberedPagesContainer.innerHTML = "";
  for (let i = 1; i <= numberOfPages; i++) {
    const newButton = document.createElement("button");
    newButton.textContent = i;
    newButton.dataset.page = i;
    if (i === currentPage) {
      newButton.classList.add("active-button");
    }
    numberedPagesContainer.appendChild(newButton);
  }
}

/**
 * Takes fetched API-data and creates cards for the
 * movies with its basic info to the DOM
 * @param {Array} apiData
 */
async function createMovieCards(apiData) {
  moviesContainer.innerHTML = '<div class="spinner"></div>';
  try {
    // Create constants for the values in the data
    for (let i = 0; i < apiData.length; i++) {
      const imageUrlValue = apiData[i].image.url;
      const imageAltValue = apiData[i].image.alt;
      const titleValue = apiData[i].title;
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

      // Append to moviesContainer
      movieDiv.appendChild(image);
      movieDiv.appendChild(title);

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
  } catch (error) {
    const errorP = document.createElement("p");
    errorP.textContent =
      "Something went wrong when fetching data. Try again later.";
    moviesContainer.appendChild(errorP);
  } finally {
    const spinner = document.querySelector(".spinner");
    spinner.classList.add("hidden");
  }
}

/**
 *
 * @param {Array} apiData - The fetched data from the API
 * @returns New array with single instance of every
 * unique genre found
 */
function createGenreArray(apiData) {
  const genreArray = [];
  for (let i = 0; i < apiData.length; i++) {
    if (!genreArray.includes(apiData[i].genre)) {
      genreArray.push(apiData[i].genre);
    }
  }
  return genreArray;
}

/**
 * Filter array of movies on if they match a given genre and
 * therefore will be seen on the page based on the filter.
 * @param {Array} apiData - Array of movies that will be
 * added to page later based on if they match the
 * given genre or not.
 * @param {*} genre - The genre that the movies will be
 * checked whether they fit into or not
 * @returns The newly filtered array to be used
 * for building the HTML
 */
function filterMovieByGenre(apiData, genre) {
  const filteredData = apiData.filter((movie) => {
    return movie.genre.includes(`${genre}`);
  });
  return filteredData;
}

/**
 * For every genre, there is an input created and
 * appended to the DOM, to act as filters on the homepage.
 * Event listeners are also created for each from the
 * genreCheckboxEventListener function.
 * It also adds the filterMovieByGenre function as it is needed
 * for the Event listener on the radio-buttons to create
 * the new page of items
 * @param {Array} filteredApiData - An array of only the
 * genres provided from the API gets put in.
 */
function movieFilters(filteredApiData) {
  const radioFieldset = document.createElement("fieldset");
  const radioLegend = document.createElement("legend");
  radioLegend.textContent = "Filter by genre:";
  radioFieldset.appendChild(radioLegend);
  checkboxForm.appendChild(radioFieldset);

  filteredApiData.forEach((genre) => {
    const lowercaseGenre = genre.toLowerCase();

    const newRadioButton = document.createElement("input");
    newRadioButton.setAttribute("type", "radio");
    const idNameAndLabel = `${lowercaseGenre}-radio`;
    newRadioButton.setAttribute("id", idNameAndLabel);
    newRadioButton.setAttribute("name", "genre");
    newRadioButton.setAttribute("value", genre);

    const newRadioLabel = document.createElement("label");
    newRadioLabel.setAttribute("for", idNameAndLabel);
    newRadioLabel.textContent = genre;

    radioFieldset.appendChild(newRadioLabel);
    radioFieldset.appendChild(newRadioButton);

    const filteredArray = filterMovieByGenre(fetchedData, genre);

    genreCheckboxEventListener(newRadioButton, filteredArray);
    return filteredArray;
  });
  // Temporary solution in lieu of better alternative
  const clearButton = document.createElement("button");
  clearButton.textContent = "Clear filters";
  clearButton.addEventListener("click", () => {
    displayProducts();
  });
  radioFieldset.appendChild(clearButton);
}

/**
 * Creates new page of movie cards based on the filter applied
 * by the user.
 * @param {DOM element, Array} radio - The created radio-buttons
 * from the movieFilters function
 * @param {Array} movieArray - Takes the array created from the
 * movies that match the particular genre in the loop of movieFilters
 * and then creates a new page with said items
 */
function genreCheckboxEventListener(radio, movieArray) {
  checkboxForm.addEventListener("change", (event) => {
    if (event.target === radio) {
      moviesContainer.innerHTML = "";
      createMovieCards(movieArray);
      numberedPagesContainer.classList.add("hidden");
      nextButton.classList.add("hidden");
      prevButton.classList.add("hidden");
    }
  });
}

/**
 *
 * @param {input.value} searchTerm - Whatever gets put
 * into the search-input on the home-page.
 * @returns - The filtered list of items to be read elsewhere
 * and used for updating the HTML.
 */
function filterMovies(searchTerm) {
  if (!searchTerm) {
    return fetchedData;
  }
  const trimmedSearchTerm = searchTerm.toLowerCase().trim();

  const filteredList = fetchedData.filter((movie) => {
    const nameMatch = movie.title.toLowerCase().includes(trimmedSearchTerm);
    const descriptionMatch = movie.description
      .toLowerCase()
      .includes(trimmedSearchTerm);
    const genreMatch = movie.genre.toLowerCase().includes(trimmedSearchTerm);
    return nameMatch || descriptionMatch || genreMatch;
  });

  return filteredList;
}

/**
 * Used to combine previous functions and populate
 * DOM with items
 */
async function renderMovieFilters() {
  moviesContainer.innerHTML = '<div class="spinner"></div>';
  try {
    const newGenreArray = createGenreArray(fetchedData);
    const filteredArray = movieFilters(newGenreArray);
  } catch {
    const errorP = document.createElement("p");
    errorP.textContent =
      "Something went wrong when fetching data. Try again later.";
    moviesContainer.appendChild(errorP);
  } finally {
    const spinner = document.querySelector(".spinner");
    spinner.classList.add("hidden");
  }
}

/**
 * Fetches data from API and puts that into
 * pagePagination that creates the page numbers and
 * their functionality
 */
async function displayProducts() {
  moviesContainer.innerHTML = '<div class="spinner"></div>';
  try {
    searchInput.value = "";
    // Get data from API
    const fullMovieList = await imported.fetchProducts();
    await pagePagination(fullMovieList, currentPage);
  } catch (error) {
    const errorP = document.createElement("p");
    errorP.textContent =
      "Something went wrong when fetching data. Try again later.";
    moviesContainer.appendChild(errorP);
  } finally {
    const spinner = document.querySelector(".spinner");
    spinner.classList.add("hidden");
  }
}

/**
 * Takes the value from search-input and uses that for the
 * function that filters movies into a new list, and then
 * creates the pages and numbered buttons with that data
 */
async function updatePage() {
  moviesContainer.innerHTML = '<div class="spinner"></div>';
  try {
    moviesContainer.innerHTML = "";
    const searchTerm = searchInput.value;
    const filteredMovies = await filterMovies(searchTerm);
    const paginatedMovies = pagePagination(filteredMovies, currentPage);
    renderNumberedButtons(filteredMovies);
  } catch {
    const errorP = document.createElement("p");
    errorP.textContent =
      "Something went wrong when fetching data. Try again later.";
    moviesContainer.appendChild(errorP);
  } finally {
    const spinner = document.querySelector(".spinner");
    spinner.classList.add("hidden");
  }
}

// --- EVENT LISTENERS ---

/**
 * Next and Previous buttons for pagination
 */
nextButton.addEventListener("click", () => {
  if (!nextButton.disabled) {
    currentPage++;
    updatePage();
  }
});
prevButton.addEventListener("click", () => {
  if (!prevButton.disabled) {
    currentPage--;
    updatePage();
  }
});

/**
 * Numbered buttons for pagination
 */
numberedPagesContainer.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    const pageNumber = Number(event.target.dataset.page);
    currentPage = pageNumber;
    updatePage();
  }
});

searchInput.addEventListener("input", (event) => {
  currentPage = 1;
  event.preventDefault();
  const searchTerm = event.target.value;
  const filteredMovies = filterMovies(searchTerm);
  const paginatedMovies = pagePagination(filteredMovies, currentPage);
});

// --- INITIAL LOAD ---
// This is where we will call the initial function to fetch the data
// and render the page for the first time.

imported.loadCart();
renderMovieFilters();
displayProducts();
