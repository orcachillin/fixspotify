import fixspotify from '../assets/icons/fixspotify.svg';
import spotify from '../assets/icons/spotify.svg';
import youtube from '../assets/icons/youtube.svg';
import youtubemusic from '../assets/icons/youtubemusic.svg';
import tidal from '../assets/icons/tidal.svg';
import soundcloud from '../assets/icons/soundcloud.svg';
import applemusic from '../assets/icons/applemusic.svg';
import amazonmusic from '../assets/icons/amazonmusic.svg';
import pandora from '../assets/icons/pandora.svg';
import musicbrainz from '../assets/icons/musicbrainz.svg';

export const providers = {
    fixSpotify: {
        name: "FixSpotify",
        color: "#1DB954",
        icon: fixspotify,
    },
    spotify: {
        name: "Spotify",
        color: "#1DB954",
        icon: spotify,
    },
    spotifyapp: {
        name: "Spotify (App)",
        color: "#1DB954",
        icon: spotify,
        hideOnList: true,
    },
    youtube: {
        name: "YouTube",
        color: "#FF0000",
        icon: youtube,
    },
    youtubeMusic: {
        name: "YouTube Music",
        color: "#FF0000",
        icon: youtubemusic,
    },
    tidal: {
        name: "Tidal",
        color: "#000000",
        icon: tidal,
    },

    // [gart] not sure how this will be handled, considering how soundcloud works 

    // soundcloud: {    
    //     name: "SoundCloud",
    //     color: "#FF5500",
    //     icon: soundcloud,
    //     disabled: true,
    // },
    appleMusic: {
        name: "Apple Music",
        color: "#FA243C",
        icon: applemusic,
        disabled: true,
    },
    amazonMusic: {
        name: "Amazon Music",
        color: "#46C3D0",
        icon: amazonmusic,
        disabled: true,
    },
    pandora: {
        name: "Pandora",
        color: "#005483",
        icon: pandora,
        disabled: true,
    },

    // [gart] i dont know enough about musicbrainz to know if this is a good idea

    // musicbrainz: {
    //     name: "MusicBrainz",
    //     color: "#BA478F",
    //     icon: musicbrainz,
    //     disabled: true,
    // },

    // i want to add last.fm, but soon tm

} as Record<string, { name: string, color: string, icon: string, disabled?: true, hideOnList?: true }>;
