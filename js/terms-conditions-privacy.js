import * as imported from "./exports.js";

const termsAndConditionsContainer = document.getElementById(
  "terms-and-conditions-container",
);
const placeholderText = document.getElementById("placeholder-text");

/**
 * Placeholder function for if the data for the terms and conditions was fetched from an API
 * @param {Array} apiData - Data from an API that holds terms and conditions text.
 */
async function addContentAndHeader(apiData) {
  termsAndConditionsContainer.innerHTML = '<div class="spinner"></div>';
  console.log(apiData);

  try {
    placeholderText.classList.add("hidden");

    for (i = 0; i < apiData.length; i++) {
      const div = document.createElement("div");
      const header = document.createElement("h3");
      const content = document.createElement("p");
      header.textContent = apiData[i].header; // .header is a placeholder for whatever the real apiDAta would be
      content.textContent = apiData[i].content; // .content = placeholder
      div.appendChild(header);
      div.appendChild(content);
      termsAndConditionsContainer.appendChild(div);
    }
  } catch (error) {
    const errorP = document.createElement("p");
    errorP.textContent =
      "Something went wrong when fetching data. Try again later.";
    termsAndConditionsContainer.appendChild(errorP);
  } finally {
    const spinner = document.querySelector(".spinner");
    spinner.classList.add("hidden");
  }
}
