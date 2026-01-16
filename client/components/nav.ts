import '../styles/nav.css'
import fixspotify from '../assets/icons/fixspotify.svg';

export function initNav() {
  const nav = `
    <nav>
      <a href="https://fixspotify.com" class="logo">
        <h1>fixSpotify</h1>
        <img src="${fixspotify}" alt="fixSpotify SVG Logo" />
      </a>
      <ul class="nav-menu">
        <li><a href="https://open.fixspotify.com" class="nav-link">Config</a></li>
        <li><a href="https://gart.sh/l/fixspotify" class="nav-link" target="_blank">Source</a></li>
        <li><a href="https://ko-fi.com/orcachillin" class="nav-link" target="_blank">Ko-Fi</a></li>
        <li><a href="https://github.com/gurrrrrrett3/fixspotify/graphs/contributors" class="nav-link" target="_blank">Contributors</a></li>
      </ul>
      <div class="ticker">
        spotify.link is now supported!
      </div>
    </nav>
  `;
  const navContainer = document.getElementById('nav-container');
  if (navContainer) {
    navContainer.innerHTML = nav;
    const currentPath = window.location.pathname;
    const links = navContainer.querySelectorAll('.nav-link');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.endsWith(currentPath)) {
        link.classList.add('active');
      }
    });
  }

}
initNav();