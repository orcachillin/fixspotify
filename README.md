# FixSpotify

Got sick of Spotify embeds barely working on Discord/social platforms, so here's a fix.

## What It Does

Intercepts Spotify URLs and generates better embeds with actual metadata. Also lets you redirect to other music platforms (YouTube, Tidal, etc).

## Usage

Replace `open.spotify.com` with `open.fixspotify.com` or `spotify.link` with `fixspotify.link`. Done.

**Example:**
```
https://open.spotify.com/track/...
    ↓
https://open.fixspotify.com/track/...
```

## Development

### Quick Start

```bash
git clone https://github.com/gurrrrrrett3/fixspotify
cd fixspotify

# Setup environment
cp .env.example .env
# Edit .env and add your Spotify API credentials

# Install and run
npm install
npm run build
npm start
```

Server runs on `http://localhost:3000`

### Dev Mode (with hot reload)

```bash
npm run dev
```

Runs Vite (client), TypeScript compiler (server), and nodemon concurrently.

### Docker

**Development:**
```bash
export DOCKER_BUILDKIT=1
docker-compose up
```

**Development with Watch Mode** (auto-sync file changes):
```bash
docker compose watch
```

Combines volume mounts with Docker's watch feature:
- Initial files loaded via volume mounts
- Changes sync automatically via watch
- Config files trigger container restart
- package.json changes rebuild the container
- Note: Warning about "path also declared by volume" is expected and harmless

**Production:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Environment Variables

**Required:**
- `SPOTIFY_CLIENT_ID` - Your Spotify API client ID
- `SPOTIFY_CLIENT_SECRET` - Your Spotify API client secret

**Optional:**
- `PORT` - Server port (default: 3000)
- `TIDAL_CLIENT_ID` - Tidal API credentials (for Tidal provider)
- `TIDAL_CLIENT_SECRET`
- `ANALYTICS_ENABLED` - Enable custom analytics (default: false)
- `DEV_FORCE_OPEN` - Force open.fixspotify.com routing locally (dev only)

See the [Spotify API Setup Guide](docs/SPOTIFY_API_SETUP.md) for detailed instructions.

## Documentation

- **[Spotify API Setup](docs/SPOTIFY_API_SETUP.md)** - How to get your Spotify API credentials
- **[Health Check Guide](docs/HEALTHCHECK.md)** - How to verify the service is working correctly

## License

ISC
