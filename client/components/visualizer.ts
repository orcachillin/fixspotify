// visualizer.ts

import '../styles/visualizer.css'
import '../styles/providers.css'
import { providers } from "../scripts/providers.ts"
import placeholder from "../assets/images/placeholder.svg"
import ColorThief from 'colorthief';

interface ItemData {
  album: string;
  albumArt: string;
  artists: string;
  name: string;
  tracks: { id: string; name: string; artists: string; duration: number }[];
  genres: string;
  images: string[];
}

const url = new URL(location.href)
const type = url.searchParams.get("type")
const id = url.searchParams.get("id")
if (!type || !id) {
    document.body.innerHTML = "Invalid parameters"
    throw new Error("Invalid parameters")
}

function getColors(image: HTMLImageElement): Promise<{ac: string, bg: string}> {
  return new Promise((resolve, reject) => {
    const colorThief = new ColorThief();

    if (!image.complete) {
      image.onload = () => {
        const color = colorThief.getColor(image);
        const ac = correctColor(color);
        const bg = correctColor(color, 8);
        resolve({
          ac: `rgb(${ac[0]}, ${ac[1]}, ${ac[2]})`,
          bg: `rgb(${bg[0]}, ${bg[1]}, ${bg[2]})`
        });
      }
    } else {
        const color = colorThief.getColor(image);
        const ac = correctColor(color);
        const bg = correctColor(color, 8);
        resolve({
          ac: `rgb(${ac[0]}, ${ac[1]}, ${ac[2]})`,
          bg: `rgb(${bg[0]}, ${bg[1]}, ${bg[2]})`
        });
    }
  })
}

function correctColor(color: number[], targetLuma = 128): number[] {
  const [r, g, b] = color;
  let currentLuma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  if (currentLuma > targetLuma) {
    const ratio = (currentLuma + 0.05) / (targetLuma + 0.05);
    return [r / ratio, g / ratio, b / ratio];
  } else {
    const ratio = (targetLuma + 0.05) / (currentLuma + 0.05);
    return [r * ratio, g * ratio, b * ratio];
  }
}

function addTrack(options: {
  number: number,
  id: string,
  name: string,
  artists: string,
  duration: number
}) {
  const tracksContainer = document.getElementById("tracks") as HTMLDivElement;
  const trackTemplate = document.getElementById("track-template") as HTMLAnchorElement;
  const track = trackTemplate.cloneNode(true) as HTMLAnchorElement;

  const idEl = track.querySelector("[id='track-id']") as HTMLSpanElement;
  const nameEl = track.querySelector("[id='track-title']") as HTMLSpanElement;
  const artistEl = track.querySelector("[id='track-artist']") as HTMLSpanElement;
  const durationEl = track.querySelector("[id='track-duration']") as HTMLSpanElement;

  const uniqueId = `track-${options.number}`;
  idEl.id = `${uniqueId}-id`;
  nameEl.id = `${uniqueId}-title`;
  artistEl.id = `${uniqueId}-artist`;
  durationEl.id = `${uniqueId}-duration`;

  idEl.textContent = options.number.toString();
  nameEl.textContent = options.name;
  artistEl.textContent = options.artists;
  durationEl.textContent = options.duration.toString();

  track.removeAttribute("hidden");
  track.href = `/view?type=track&id=${options.id}`;
  track.title = `${options.name} by ${options.artists}`
  // track.href = `https://open.fixspotify.com/intl-fr/track/${options.id}`;
  // console.log(options);
  track.style.display = 'flex';
  tracksContainer.style.display = 'grid';
  tracksContainer.appendChild(track);
}

async function fetchData(): Promise<ItemData>  {
  const response = await fetch(`https://open.fixspotify.com/api/info/${type}/${id}`);
  return await response.json();
}

export async function initVisualizer() {
  const data = await fetchData();

  const container = document.getElementById("visualizer-container") as HTMLDivElement;
  const typeEl = document.getElementById("type") as HTMLSpanElement;
  typeEl.textContent = type!.charAt(0).toUpperCase() + type!.slice(1);

  const coverEl = document.getElementById("cover") as HTMLImageElement;
  const titleEl = document.getElementById("title") as HTMLSpanElement;
  const albumEl = document.getElementById("album") as HTMLSpanElement;
  const artistEl = document.getElementById("artist") as HTMLSpanElement;

  switch (type) {
    case 'track':
      if (coverEl) coverEl.src = data.albumArt ? data.albumArt : placeholder;
      if (titleEl) titleEl.textContent = data.name;
      if (albumEl && data.name != data.album) albumEl.textContent = data.album;
      if (artistEl) artistEl.textContent = data.artists;
      break;
    case 'album':
      if (coverEl) coverEl.src = data.images[0] ? data.images[0] : placeholder;
      if (titleEl) titleEl.textContent = data.name;
      if (albumEl) albumEl.textContent = data.album;
      if (artistEl) artistEl.textContent = data.artists;
      data.tracks!.forEach((track, index) => {
          addTrack({
              number: index + 1,
              id: track.id,
              name: track.name,
              artists: track.artists,
              duration: track.duration
          })
      })
      break;
    case 'artist':
      if (coverEl) coverEl.src = data.images[0] ? data.images[0] : placeholder;
      if (titleEl) titleEl.textContent = data.name;
      if (albumEl) albumEl.textContent = data.genres;
      if (artistEl) artistEl.textContent = data.artists;
      break;
    default:
      break;
  }

  const coverColor = await getColors(coverEl);
  container.setAttribute("style", `--coverColor: ${coverColor.ac}; --bgCoverColor: ${coverColor.bg}`);
}

export function initProvidersRedirect() {
  const types = ["track", "album", "artist"];

  if (types.includes(type!)) {
    const providersList = Object.entries(providers)
    .filter(([_, provider]) => !provider.disabled)
    .map(([_, provider]) => {
      return `
        <li class="provider-item" style="--providerColor: ${provider.color}">
          <a href="/redirect/${_}/${type}/${id}" class="provider">
            <img src="${provider.icon}" alt="${provider.name} icon">
            <span>${provider.name}</span>
          </a>
        </li>
      `;
    }).join('');

    const availableProviders = `
      <section class="select-provider">
        <h2>Open with</h2>
        <ul class="providers-list">
          ${providersList}
        </ul>
      </section>
    `;
    const availableProvidersContainer = document.getElementById('providers-redirect-container');
    if (availableProvidersContainer) {
      availableProvidersContainer.innerHTML = availableProviders;
    }
  }
}
initProvidersRedirect();
initVisualizer();
