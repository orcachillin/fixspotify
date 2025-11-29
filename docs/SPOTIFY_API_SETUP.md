# Getting Spotify API Credentials

This guide shows you how to get the required Spotify API credentials for FixSpotify.

## Steps

### 1. Login to Developer Dashboard

Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) and log in with your Spotify account (or create a free account if needed).

### 2. Create an App

1. Click "Create an App"
2. Enter a name (e.g., "FixSpotify")
3. Enter a description (e.g., "Personal Spotify embed fix")
4. Accept the Developer Terms of Service
5. Leave Redirect URIs blank (or use `http://localhost` if required)

### 3. Get Your Credentials

Once the app is created, you'll see your credentials:

- **Client ID** - Copy this value
- **Client Secret** - Click "View client secret" and copy this value

Keep the Client Secret secure (treat it like a password).

### 4. Add to Environment Variables

Add these values to your `.env` file:

```bash
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

Done! The app will automatically handle token generation using these credentials.

## Notes

- Access tokens expire after 1 hour, but the app handles renewal automatically
- You don't need to manually generate tokens
- Keep your Client Secret private (don't commit it to git)
- The Client ID is not sensitive and can be shared with your team

## Troubleshooting

**Server won't start:**
- Verify both variables are set in `.env`
- Check for typos in variable names
- Ensure no extra spaces around the values

**API returns 401 Unauthorized:**
- Your credentials may be incorrect
- Regenerate the Client Secret in the dashboard
- Update your `.env` file with the new secret
