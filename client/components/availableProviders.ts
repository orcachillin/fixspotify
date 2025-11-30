// availableProviders.ts

import "../styles/providers.css";
import { providers } from "../scripts/providers.ts";

export function initAvailableProviders() {
  const providersList = Object.entries(providers)
    .filter(([_, provider]) => !provider.disabled)
    .filter(([_, provider]) => !provider.hideOnList)
    .map(([_, provider]) => {
      return `
      <li class="provider-item">
        <img src="${provider.icon}" alt="${provider.name} icon">
        <span>${provider.name}</span>
      </li>
    `;
    })
    .join("");

  const availableProviders = `
    <section class="available-providers">
      <h2>Available platforms</h2>
      <ul class="providers-list">
        ${providersList}
      </ul>
    </section>
  `;
  const availableProvidersContainer = document.getElementById("available-providers-container");
  if (availableProvidersContainer) {
    availableProvidersContainer.innerHTML = availableProviders;
  }
}
initAvailableProviders();
