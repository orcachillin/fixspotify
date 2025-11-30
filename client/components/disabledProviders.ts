// disabledProviders.ts

import "../styles/providers.css";
import { providers } from "../scripts/providers.ts";

export function initDisabledProviders() {
  const providersList = Object.entries(providers)
    .filter(([_, provider]) => provider.disabled)
    .map(([_, provider]) => {
      return `
      <li class="provider-item">
        <img src="${provider.icon}" alt="${provider.name} icon">
      </li>
    `;
    })
    .join("");

  const disabledProviders = `
    <section class="disabled-providers">
      <h2>Coming soon</h2>
      <ul class="providers-list">
        ${providersList}
      </ul>
    </section>
  `;
  const disabledProvidersContainer = document.getElementById("disabled-providers-container");
  if (disabledProvidersContainer) {
    disabledProvidersContainer.innerHTML = disabledProviders;
  }
}
initDisabledProviders();
