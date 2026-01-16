export function initDownPage() {
window.addEventListener("DOMContentLoaded", () => {
        const openOnSpotify = document.getElementById("open-on-spotify") as HTMLAnchorElement

    if (!openOnSpotify || !window.location.hash) return

    const hash = decodeURIComponent(window.location.hash)
    const parts = hash.split("/").slice(-2)

    console.log(parts)

    const [ type, id ] = parts

    openOnSpotify.href = `https://open.spotify.com/${type}/${id}`
})
}