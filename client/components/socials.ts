// socials.ts

import "../styles/socials.css";
import githubIcon from "../assets/icons/github.svg";
import emailIcon from "../assets/icons/email.svg";

export function initSocials() {
  const socials = `
    <ul class="socials">
      <li>
        <a href="https://gart.sh/l/fixspotify" target="_blank">
          <img src="${githubIcon}"/>
          <span>GitHub</span>
        </a>
      </li>
      <li>
        <a href="mailto:contact@gart.sh" target="_blank">
        <img src="${emailIcon}"/>
        <span>Email</span>
        </a>
      </li>
    </ul>
  `;
  const socialsContainer = document.getElementById("socials-container");
  if (socialsContainer) {
    socialsContainer.innerHTML = socials;
  }
}
initSocials();
