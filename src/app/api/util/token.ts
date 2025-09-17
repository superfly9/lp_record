// https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow
interface SpotifyAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}


async function getSpotifyAccessToken(): Promise<string | null> {
try {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Spotify API 인증 정보가 없습니다.');
    return null;
  }

  // https://github.com/spotify/web-api-examples/blob/master/authorization/client_credentials/app.js
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      'grant_type': 'client_credentials',
    }),
  });

  if (!response.ok) {
    throw new Error(`Spotify auth error: ${response.status}`);
  }

  const data: SpotifyAuthResponse = await response.json();
  return data.access_token;
} catch (error) {
  console.error('Spotify 인증 오류:', error);
  return null;
}
}

export default getSpotifyAccessToken;