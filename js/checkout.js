"use strict";

import * as imported from "./exports.js";

let cart = [];
const cartContainer = document.getElementById("cart-container");
const PAYMENT_CONFIRM_ENDPOINT = "../checkout/confirmation/index.html";

function createCart() {
  const storedCart = imported.loadCart();
  const cartText = document.createElement("p");

  imported.inCaseOfEmptyCart(storedCart, cartContainer);
  /*
  if (storedCart.length === 0) {
    cartText.textContent = "Your cart is empty";
    cartContainer.appendChild(cartText);
  }
  */

  // Deduct null values from cart length to give actual length
  // Then add length of cart to DOM
  let cartCounter = 0;
  for (let i = 0; i < storedCart.length; i++) {
    if (storedCart[i] === null) {
      cartCounter = +1;
    } else {
      continue;
    }
  }

  const finalCartLength = storedCart.length - cartCounter;
  const cartLength = document.createElement("p");
  if (finalCartLength === 0) {
    imported.hideItem(cartLength);
  }
  cartLength.textContent = `You have ${finalCartLength} item(s) in your cart`;
  cartContainer.appendChild(cartLength);

  for (let i = 0; i < storedCart.length; i++) {
    if (storedCart[i] === null) {
      continue;
    }
    const imageUrlValue = storedCart[i].image.url;
    const imageAltValue = storedCart[i].image.alt;
    const titleValue = storedCart[i].title;
    const priceValue = storedCart[i].discountedPrice;

    // creating the HTML elements and adding the values to them
    const movieDiv = document.createElement("div");
    movieDiv.classList.add("in-cart-movie-card");
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
    const removeFromCartButton = document.createElement("button");
    removeFromCartButton.textContent = "remove from cart";

    // Removing an item from the cart
    const cartProductIndex = storedCart[i];
    removeFromCartButton.addEventListener("click", () => {
      console.log("cartProductIndex:", cartProductIndex);
      imported.removeFromCartToast(titleValue);
      const newCart = imported.removeFromCart(cartProductIndex);
      imported.loadCart();
      imported.hideItem(movieDiv);
      imported.hideItem(cartLength);
      imported.inCaseOfEmptyCart(newCart, cartContainer);
    });

    // Anchor for detailed product-page
    const detailsAnchor = document.createElement("a");
    detailsAnchor.textContent = "details";
    detailsAnchor.setAttribute(
      "href",
      `../product/index.html?id=${storedCart[i].id}`,
    );

    // Append to moviesContainer
    movieDiv.appendChild(image);
    movieDiv.appendChild(title);

    // Prices will both be shown if there is a discounted price
    if (storedCart[i].onSale === true) {
      const priceNormalValue = storedCart[i].price;
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
    anchorDiv.appendChild(removeFromCartButton);
    anchorDiv.appendChild(detailsAnchor);
    movieDiv.appendChild(anchorDiv);
    cartContainer.appendChild(movieDiv);
  }

  // Total price for the cart
  const totalCartPrice = imported.calculatePrice(storedCart);
  const cartPrice = document.createElement("p");
  cartPrice.textContent = `Total Price: ${totalCartPrice} NOK`;

  cartContainer.appendChild(cartPrice);

  imported.confirmPurchase(cartContainer, PAYMENT_CONFIRM_ENDPOINT);
}

function updatePage() {
  createCart();
}

const createdCart = createCart();
