// stats.ts

import '../styles/stats.css'
import placeholder from "../assets/images/placeholder.svg"

interface StatsData {
  counts: {
    total?: number;
    track?: number;
    album?: number;
    artist?: number;
    playlist?: number;
  }
  lastRequests: {
    addedAt?: number,
    type: string,
    name: string,
    description: string
    image: string,
    url: string
  }[]
}

let previousValues: StatsData = {
  counts: {
    total: undefined,
    track: undefined,
    album: undefined,
    artist: undefined,
    playlist: undefined,
  },
  lastRequests: [{
    addedAt: undefined,
    type: '',
    name: '',
    description: '',
    image: '',
    url: ''
  }]
};

function formatNumber(number: number, decimalPlaces = 0): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimalPlaces,
    minimumFractionDigits: decimalPlaces,
    useGrouping: true,
    style: 'decimal'
  }).format(number).replace(/,/g, ' ');
}

function createAnimatedDigits(current: number, previous?: number): string {
  const currentStr = formatNumber(current);
  const previousStr = previous !== undefined ? formatNumber(previous) : currentStr;

  let container = '<section class="animated-number">';
  const maxLength = Math.max(currentStr.length, previousStr.length);
  const paddedCurrent = currentStr.padStart(maxLength, ' ');
  const paddedPrevious = previousStr.padStart(maxLength, ' ');

  const changedDigits = [];
  for (let i = 0; i < maxLength; i++) {
    if (paddedCurrent[i] !== paddedPrevious[i]) {
      changedDigits.push(i);
    }
  }

  for (let i = 0; i < maxLength; i++) {
    const currentDigit = paddedCurrent[i];
    const previousDigit = paddedPrevious[i];
    const hasChanged = currentDigit !== previousDigit;
    const staggerIndex = changedDigits.indexOf(i);
    const staggerDelay = staggerIndex >= 0 ? staggerIndex * 100 : 0;

    if (hasChanged) {
      if (currentDigit === ' ') {
        container += '<span class="digit-wrapper">&nbsp;</span>';
      } else {
        container += `
          <span class="digit-wrapper">
            <span class="digit item-exit" style="animation-delay: ${staggerDelay}ms;">${previousDigit === ' ' ? '&nbsp;' : previousDigit}</span>
            <span class="digit item-enter" style="animation-delay: ${staggerDelay}ms;">${currentDigit}</span>
          </span>
        `;
      }
    } else {
      container += `<span class="digit-wrapper"><span class="digit${currentDigit === ' ' ? ' digit-space' : ''}">${currentDigit === ' ' ? '&nbsp;' : currentDigit}</span></span>`;
    }
  }

  container += '</section>';
  return container;
}

function createAnimatedText(current: string | undefined, previous: string, delay: number): string {
  let container = '<section class="animated-text">';

  if (current !== previous) {
    container += `
      <span class="text-wrapper">
        <span class="text item-exit" style="animation-delay: ${delay}ms;">${previous}</span>
        <span class="text item-enter" style="animation-delay: ${delay}ms;">${current}</span>
      </span>
    `;
  } else {
    container += `<span class="text-wrapper"><span class="text">${current}</span></span>`;
  }

  container += '</section>';
  return container;
}

async function fetchStats(): Promise<StatsData> {
  const response = await fetch('https://fixspotify.com/stats');
  return await response.json();
}

function initializeStatsContainer() {
  const statsContainer = document.getElementById('stats-container');
  if (!statsContainer) return;

  statsContainer.innerHTML = `
    <section class="stats">
      <section class="stats-title">
        <h2>Stats</h2>
      </section>
      <section class="stats-panel">
        <section class="stats-total">
          <section class="animated-number"><span class="digit-wrapper"><span class="digit"></span></span></section>
          <span>Total Requests</span>
        </section>
        <section class="stats-track">
          <section class="animated-number"><span class="digit-wrapper"><span class="digit"></span></span></section>
          <span>Track Requests</span>
        </section>
        <section class="stats-album">
          <section class="animated-number"><span class="digit-wrapper"><span class="digit"></span></section>
          <span>Album Requests</span>
        </section>
        <section class="stats-last">
          <a href="#">
            <img src="" alt="No image" style="display: none"/>
            <section class="song-details">
              <span class="song-title">
                <section class="animated-text"><span class="text-wrapper"><span class="text"></span></section>
              </span>
              <span class="song-artist">
                <section class="animated-text"><span class="text-wrapper"><span class="text"></span></section>
              </span>
            </section>
            <span>Last Request</span>
          </a>
        </section>
      </section>
    </section>
  `;
}

async function updateStats() {
  try {
    const data = await fetchStats();
    const statsContainer = document.getElementById('stats-container');
    if (!statsContainer) return;

    const totalSection = statsContainer.querySelector('.stats-total .animated-number') as HTMLDivElement;
    if (totalSection) totalSection.outerHTML = createAnimatedDigits(data.counts.total!, previousValues.counts.total);

    const trackSection = statsContainer.querySelector('.stats-track .animated-number') as HTMLDivElement;
    if (trackSection) trackSection.outerHTML = createAnimatedDigits(data.counts.track!, previousValues.counts.track);

    const albumSection = statsContainer.querySelector('.stats-album .animated-number') as HTMLDivElement;
    if (albumSection) albumSection.outerHTML = createAnimatedDigits(data.counts.album!, previousValues.counts.album);

    if (data.lastRequests && data.lastRequests.length > 0) {
      const lastRequest = data.lastRequests[0];
      const lastRequestSection = statsContainer.querySelector('.stats-last a') as HTMLAnchorElement;
      const lastRequestImage = statsContainer.querySelector('.stats-last img') as HTMLImageElement;
      const lastRequestTitle = statsContainer.querySelector('.stats-last .song-details .song-title .animated-text') as HTMLDivElement;
      const lastRequestArtist = statsContainer.querySelector('.stats-last .song-details .song-artist .animated-text') as HTMLDivElement;

      lastRequestSection.title = `${data.lastRequests[0].name} by ${data.lastRequests[0].description}`;
      lastRequestSection.href = lastRequest.url;
      if (lastRequestTitle) lastRequestTitle.outerHTML = createAnimatedText(data.lastRequests[0].name, previousValues.lastRequests[0].name, 100);
      if (lastRequestArtist) lastRequestArtist.outerHTML = createAnimatedText(data.lastRequests[0].description, previousValues.lastRequests[0].description, 200);
      if (lastRequest.image) {
        const imageUrl = lastRequest.type === "album" ? lastRequest.image.slice(24) : lastRequest.image;

        if (imageUrl !== lastRequestImage.src && imageUrl !== previousValues.lastRequests[0].image) {
          lastRequestImage.alt = `Cover of ${lastRequest.name} by ${lastRequest.description}`;
          const tmpImg = new Image();
          tmpImg.onload = () => {
            lastRequestImage.src = imageUrl;
            lastRequestImage.style.display = 'block';
          };
          tmpImg.src = imageUrl;
        }
      }
    }

    previousValues = {
      counts: {
        total: data.counts.total,
        track: data.counts.track,
        album: data.counts.album,
        artist: data.counts.artist,
        playlist: data.counts.playlist
      },
      lastRequests: [...data.lastRequests]
    };
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
}

let intervalId: number | null = null;

export function initStats(refreshInterval = 30000) {
  if (intervalId) {
    clearInterval(intervalId);
  }
  initializeStatsContainer();
  updateStats();
  intervalId = window.setInterval(updateStats, refreshInterval);
}

export function cleanupStats() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
