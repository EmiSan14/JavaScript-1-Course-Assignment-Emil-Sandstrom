"use strict";

import * as imported from "./exports.js";

let cart = [];
const confirmationContainer = document.getElementById("confirmation-container");

/**
 * Takes whatever was in the cart and creates
 * simulated confirmation message with details
 * about purchase and items.
 */
function purchaseConfirmationScreen() {
  const paidItems = imported.loadCart();

  // Details about the order before the items
  const successMessage = document.createElement("h3");
  successMessage.textContent = "Successful purchase!";

  const detailsBelow = document.createElement("p");
  detailsBelow.textContent =
    "Below are the details of your purchase. We hope you are satisfied with your haul. You are welcome back in the future whenever you crave some more cinematic experiences of the highest quality.";

  const orderId = document.createElement("p");
  orderId.textContent = "Order ID: 6209843118";

  const deliveryDate = document.createElement("p");
  deliveryDate.textContent = "Expected delivery: 2 business days";

  const summary = document.createElement("h3");
  summary.textContent = "Summary:";

  confirmationContainer.appendChild(successMessage);
  confirmationContainer.appendChild(detailsBelow);
  confirmationContainer.appendChild(orderId);
  confirmationContainer.appendChild(deliveryDate);
  confirmationContainer.appendChild(summary);

  const successMovies = document.createElement("div");
  successMovies.classList.add("success-movies");

  for (let i = 0; i < paidItems.length; i++) {
    if (paidItems[i] === null) {
      continue;
    }
    const imageUrlValue = paidItems[i].item.image.url;
    const imageAltValue = paidItems[i].item.image.alt;
    const titleValue = paidItems[i].item.title;
    const priceValue = paidItems[i].item.discountedPrice;
    const quantityValue = paidItems[i].quantity;
    // creating the HTML elements and adding the values to them
    const movieDiv = document.createElement("div");
    movieDiv.classList.add("purchase-confirmation-movie-card");
    const image = document.createElement("img");
    const movieInformationDiv = document.createElement("div");
    movieInformationDiv.classList.add("movie-info-div-success");

    // Set src and alt for the image created
    image.setAttribute("src", imageUrlValue);
    image.setAttribute("alt", imageAltValue);
    const title = document.createElement("h4");
    title.textContent = titleValue;

    const priceDiscounted = document.createElement("p");
    const priceTotal = document.createElement("p");
    const priceTimesQuantity = parseFloat(priceValue * quantityValue);
    priceDiscounted.textContent = `Price: ${priceValue} NOK `;
    priceTotal.textContent = `Total price: ${priceTimesQuantity.toFixed(2)} NOK `;

    const quantity = document.createElement("p");
    quantity.textContent = `Quantity: ${quantityValue}`;

    movieDiv.appendChild(image);

    movieInformationDiv.appendChild(title);
    movieDiv.appendChild(movieInformationDiv);

    // Make into function
    // Prices will both be shown if there is a discounted price
    if (paidItems[i].onSale === true) {
      const priceNormalValue = paidItems[i].price;
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
    movieInformationDiv.appendChild(priceDiscounted);
    movieInformationDiv.appendChild(quantity);
    movieInformationDiv.appendChild(priceTotal);
    successMovies.appendChild(movieDiv);
    confirmationContainer.appendChild(successMovies);
  }

  // Total price for the items
  const totalConfirmationPrice = imported.calculatePrice(paidItems);
  const confirmationPrice = document.createElement("p");
  confirmationPrice.textContent = `Total Price: ${totalConfirmationPrice} NOK`;
  confirmationContainer.appendChild(confirmationPrice);

  // Continue shopping-anchor
  const continueShoppingAnchor = document.createElement("a");
  continueShoppingAnchor.textContent = "continue shopping";
  continueShoppingAnchor.setAttribute("href", "../../index.html");
  confirmationContainer.appendChild(continueShoppingAnchor);

  // Clear the cart for immersion
  continueShoppingAnchor.addEventListener("click", () => {
    imported.clearCart();
  });
}

purchaseConfirmationScreen();
