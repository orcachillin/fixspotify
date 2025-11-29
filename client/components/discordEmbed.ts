// discordEmbed.ts

import '../styles/discordEmbed.css'
import cover from '../assets/images/starfall.webp'
import profile from '../assets/images/profile.webp'

export function initDiscordEmbed() {
  const discordEmbed = `
    <section class="discord-embed">
      <h2>Before</h2>
      <section class="embed">
        <img class="profile-picture" src=${profile}></img>
        <section class="content">
          <section class="infos">
            <span class="username">max</span>
            <span>Today at 7:21 PM</span>
          </section>
          <p>https://open.spotify.com/track/05FpQ41MVtDd1Ft63DZNuv</p>
        </section>
      </section>
      <h2>After</h2>
      <section class="embed">
          <img class="profile-picture" src=${profile}></img>
        <section class="content">
          <section class="infos">
            <span class="username">max</span>
            <span>Today at 7:21 PM</span>
          </section>
          <p>https://open.fixspotify.com/track/05FpQ41MVtDd1Ft63DZNuv</p>
          <section class="fixspotify-embed">
            <section class="infos">
              <span>FixSpotify</span>
              <span class="track-name">Starfall</span>
              <section class="details">
                <span>By SALEM • 2:48</span>
                <span>Track 5 of 11 on Fires in Heaven</span>
                <span>Released October 30, 2020</span>
              </section>
            </section>
            <img src="${cover}" alt="Cover of Fires in Heaven by SALEM" />
        </section>
      </section>
    </section>
  `;
  const discordEmbedContainer = document.getElementById('discord-embed-container');
  if (discordEmbedContainer) {
    discordEmbedContainer.innerHTML = discordEmbed;
  }
}
initDiscordEmbed();
