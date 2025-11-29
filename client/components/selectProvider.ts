// selectProvider.ts

import '../styles/providers.css'
import { providers } from '../scripts/providers.ts'

let selectedProvider = localStorage.getItem("provider") || "fixSpotify";

export function initSelectProvider() {
  const sectionElement = document.createElement('section');
  sectionElement.className = 'select-provider';
  const h2Element = document.createElement('h2');
  h2Element.textContent = 'Preferred platform';
  const ulElement = document.createElement('ul');
  ulElement.className = 'providers-list';

  const providersList = Object.entries(providers)
    .filter(([_, provider]) => !provider.disabled)
    .map(([providerId, provider]) => {
      const providerElement = document.createElement("li");
      providerElement.className = "provider-item";
      providerElement.setAttribute("style", `--providerColor: ${provider.color}`);

      if (selectedProvider === providerId) {
        providerElement.classList.add("selected");
      }

      if (!provider.disabled) {
        providerElement.onclick = () => {
          localStorage.setItem("provider", providerId);
          selectedProvider = providerId;
          initSelectProvider();
        }
      }

      providerElement.innerHTML = `
        <img src="${provider.icon}" alt="${provider.name} icon">
        <span>${provider.name}</span>
      `;

      return providerElement;
    });

  ulElement.append(...providersList);
  sectionElement.appendChild(h2Element);
  sectionElement.appendChild(ulElement);

  const selectProviderContainer = document.getElementById('select-provider-container');
  if (selectProviderContainer) {
    selectProviderContainer.innerHTML = '';
    selectProviderContainer.appendChild(sectionElement);
  }
}
initSelectProvider();
