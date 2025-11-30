// disclaimer.ts

import "../styles/disclaimer.css";

export function initDisclaimer() {
  const disclaimer = `
    <section class="disclaimer">
      <span>This tool is not affiliated with Spotify.</span>
    </section>
  `;
  const disclaimerContainer = document.getElementById("disclaimer-container");
  if (disclaimerContainer) {
    disclaimerContainer.innerHTML = disclaimer;
  }
}
initDisclaimer();
