# How to Check if Service Works Fine

Quick guide to verify FixSpotify is running correctly.

## Basic Health Check

### 1. Service is Running

```shell
curl http://localhost:3000/health
```

Should return JSON with statistics. If it responds, the server is alive.

### 2. Test a Track Embed

```shell
curl http://localhost:3000/track/3n3Ppam7vgaVa1iaRUc9Lp
```

Should return HTML with OpenGraph meta tags. Look for:

- `<meta property="og:title"` - Track name
- `<meta property="og:description"` - Track info
- `<meta property="og:image"` - Album art URL

### 3. Test API Info Endpoint

```shell
curl http://localhost:3000/api/info/track/3n3Ppam7vgaVa1iaRUc9Lp
```

Should return JSON with track metadata:

```json
{
  "name": "Track Name",
  "artists": "Artist Name",
  "album": "Album Name",
  "albumArt": "/api/image/..."
}
```

### 4. Test Provider List

```shell
curl http://localhost:3000/api/providers
```

Should return available music providers (Spotify, YouTube, Tidal, etc).

## Visual Test (Browser)

1. **Main Page:**

   ```text
   http://localhost:3000/
   ```

   Should show the FixSpotify landing page.

2. **Config Page:**

   ```text
   http://localhost:3000/view
   ```

   Should show provider configuration interface.

3. **Track Embed:**

   ```text
   http://localhost:3000/track/3n3Ppam7vgaVa1iaRUc9Lp
   ```

   Should display track info with album art and redirect button.

## Docker Health Check

If running with Docker:

```shell
# Check container health status
docker ps

# Should show "healthy" in STATUS column after ~40 seconds
```

Or inspect health directly:

```shell
docker inspect <container-id> --format='{{json .State.Health}}'
```

## Common Issues

### Server Won't Start

**Check environment variables:**

```shell
# Required: Spotify API credentials
grep SPOTIFY_CLIENT_ID .env
grep SPOTIFY_CLIENT_SECRET .env
```

**Check port availability:**

```shell
lsof -i :3000
# Or
netstat -tuln | grep 3000
```

### API Returns 404

**Problem:** Track/album/artist not found in Spotify's database.

**Solution:** Try a different Spotify ID or verify the ID is correct.

### No Album Art

**Problem:** Spotify API returned no images.

**Solution:** Normal for some content. Check `/api/info/<type>/<id>` to verify data.

### Provider Redirect Fails

**Check provider availability:**

```shell
curl http://localhost:3000/api/providers
```

Verify the provider you're testing is not marked as `disabled: true`.

## Production Checks

### 1. Domain Resolution

```shell
# Check DNS
dig open.fixspotify.com
dig fixspotify.link

# Test HTTPS
curl -I https://open.fixspotify.com/health
```

### 2. Health Endpoint

```shell
curl https://open.fixspotify.com/health
```

Should return health JSON without errors.

### 3. Test Real Spotify Link

Pick any Spotify track URL and replace the domain:

```text
https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp
→
https://open.fixspotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp
```

Paste in Discord - should show rich embed with track info.

## Monitoring

### Check Logs

**Node.js:**

```shell
npm start
# Watch for startup message: "Server started on port 3000"
```

**Docker:**

```shell
docker-compose logs -f
```

**Look for:**

- ✅ "Server started on port 3000"
- ✅ "Loaded provider <name>"
- ✅ "ProviderManager" initialization logs
- ❌ Any error stack traces

### Performance Check

```shell
# Response time test
time curl -s http://localhost:3000/track/3n3Ppam7vgaVa1iaRUc9Lp > /dev/null
```

Should complete in < 1 second (first request may be slower due to Spotify API call).

## Quick Checklist

- [ ] Server responds on port 3000
- [ ] `/health` returns JSON
- [ ] Track embed returns HTML with meta tags
- [ ] API endpoints return valid JSON
- [ ] Provider list is not empty
- [ ] No errors in logs
- [ ] Docker container shows "healthy" (if using Docker)
- [ ] Spotify API credentials are set
- [ ] Real Spotify links work when domain is changed

If all checks pass, service is working fine.
