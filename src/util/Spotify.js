let userAccessToken;
const clientID = '35989027a2fe4c78b3949b892cd3b949';
const redirectUri = 'http://localhost:3000/'

const Spotify = {
    getAccessToken() {
        if (userAccessToken) {
            console.log('userAccessToken is true - this was called');
            return userAccessToken;
        }

        // check for access token
        const userAccessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (userAccessTokenMatch && expiresInMatch) {
            console.log('userAccessToken and expiresinMatch is true');
            userAccessToken = userAccessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            // Clears parameters, allowing us to grab a new access token when it expires
            window.setTimeout(() => userAccessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return userAccessToken;
        } else {
            console.log(`Spotify initial login request...`)
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },

    async search(searchString) {
        const accessToken = await Spotify.getAccessToken();
        const fetchUri = 'https://api.spotify.com/v1/search?type=track&q=' + searchString;
        let response = await fetch(
            fetchUri,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
        response = await response.json()
        if (!response.tracks) {
            return [];
        }
        let tracks = [];
        response.tracks.items.map(track => {
            return tracks.push({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            })
        })
        return tracks;

    },

    savePlaylist(playlistName, trackUris) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/me/`, { headers: { Authorization: `Bearer ${accessToken}` } })
            .then(uidResponse => {
                // const userID = getUserIDResponse.json()
                const user = uidResponse.json();
                return user
                // console.log(uid);
            }).then(user => {
                return (user.id);
                // console.log(uid)
            }).then(uid => {
                return fetch(`https://api.spotify.com/v1/users/${uid}/playlists`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                    method: 'POST',
                    body: JSON.stringify({ name: playlistName })
                })
            }).then(newPlID => {
                return newPlID.json();
            }).then(newPlIDjson => {
                // console.log(`new playlist: ${JSON.stringify(newPlIDjson.id)}`)
                return newPlIDjson.id
            }).then(plID => {
                // console.log(`trackuris: ${JSON.stringify(trackUris)}`)
                // console.log(`https://api.spotify.com/v1/playlists/${plID}/tracks`)
                return fetch(`https://api.spotify.com/v1/playlists/${plID}/tracks`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(trackUris)
                })
            })

    }


};

export default Spotify;