import fetch from 'isomorphic-fetch';
import PromiseLimiter from './promise-limiter';
import helpers from './helpers';

// const SCOPES_ALL = 'playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private streaming user-follow-modify user-follow-read user-library-read user-library-modify user-read-private user-read-birthdate user-read-email user-top-read';


function sliceIntoChunks(array, chunkSize) {
    let chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

function buildUri(uri, params) {
    const query = Object.keys(params)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
        .join('&');
    return `${uri}?${query}`;
}

function joinUris(...uris) {
    return uris.map((uri) => {
        if (uri.startsWith('/')) {
            uri = uri.substring(1, uri.length);
        }
        if (uri.endsWith('/')) {
            uri = uri.substring(0, uri.length - 1);
        }
        return uri;
    }).join('/');
}

function request(uri, options) {
    return fetch(uri, options)
        .then((response) => {
            return response.json()
                .then((data) => {
                    if (response.ok) {
                        return Promise.resolve(data);
                    } else {
                        let error;
                        if (data && data.error && data.error.message) {
                            error = new Error(`HTTP ${response.status} - ${response.statusText} - ${data.error.message}`);
                        } else {
                            error = new Error(`HTTP ${response.status} - ${response.statusText}`);
                        }
                        error.response = response;
                        return Promise.reject(error);
                    }
                })
                .catch((err) => {
                    // catch JSON.parse errors and add response object
                    if (!err.response) {
                        err.response = response;
                    }
                    return Promise.reject(err);
                });
        });
}

function pagingObjectToProgress(data, rootName=null) {
    let offset, limit, total;
    if (rootName) {
        offset = data[rootName].offset;
        limit = data[rootName].limit;
        total = data[rootName].total;
    } else {
        offset = data.offset;
        limit = data.limit;
        total = data.total;
    }

    let current = Math.floor(offset / limit) + 1;
    let last =  Math.ceil(total / limit);
    let percent = current / last * 100.0;
    return {current, last, percent};
}

function chunkToProgress(index, array, last) {
    let current = Math.min((index+1) * array[0].length, last);
    let percent = current / last * 100.0;
    return {current, last, percent};
}

export default class SpotifyApi {
    static AUTH_URI = 'https://accounts.spotify.com/authorize';
    static API_URI = 'https://api.spotify.com/v1';

    constructor(options) {
        this._accessToken = null;
        this.limiter = new PromiseLimiter();
    }

    static generateCsrfToken() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 20; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    static getImplicitGrantUriParameters(csrfToken) {
        const params = {
            client_id: 'a3092219dbb94bae90eab20bbb46d67c',
            response_type: 'token',
            redirect_uri: 'https://zackee12.github.io/spotify-playlist-ninja/auth.html',
            state: csrfToken,
            scope: 'playlist-read-private playlist-read-collaborative user-follow-read user-library-read user-read-private user-read-email user-top-read playlist-modify-public playlist-modify-private',
            show_dialog: 'false'
        };
        if (helpers.isDevelopmentSite()) {
            params.redirect_uri = 'http://localhost:3000/auth.html';
        }
        return params;

    }

    static login(csrfToken) {
        return new Promise((resolve, reject) => {
            const params = SpotifyApi.getImplicitGrantUriParameters(csrfToken);
            const uri = buildUri(SpotifyApi.AUTH_URI, params);
            const messageListener = (event) => {
                if (!params.redirect_uri.startsWith(event.origin)) {
                    return reject(new Error(`incorrect origin '${event.origin}'`));
                }
                window.removeEventListener('message', messageListener);
                console.log(event);
                resolve(event.data);
                event.source.close();
            };
            window.addEventListener('message', messageListener);

            helpers.openPopup(uri, 'Spotity - Authorize', 400, 600)
                .then(() => reject(new Error('dialog closed without signing in')));
        });
    }

    static refreshAccessToken(csrfToken) {
        return new Promise((resolve, reject) => {
            const params = SpotifyApi.getImplicitGrantUriParameters(csrfToken);
            const uri = buildUri(SpotifyApi.AUTH_URI, params);
            const messageListener = (event) => {
                if (!params.redirect_uri.startsWith(event.origin)) {
                    return reject(new Error(`incorrect origin '${event.origin}'`));
                }
                window.removeEventListener('message', messageListener);
                console.log(event);
                resolve(event.data);
                event.source.close();
            };
            window.addEventListener('message', messageListener);
            setTimeout(() => {
                reject(new Error('refresh access token timeout'));
            }, 500);
            document.getElementById('refresh-access-token-iframe').src = uri;
        });
    }

    set accessToken(value) {
        value = value ? value : null;
        this._accessToken = value;
    }

    /**
     * Make a request to the Spotify Api
     * @param {String}      uri                  fetch url
     * @param {Object|null} params               URI query parameters
     * @param {Object|null} options              fetch options
     * @param {String}      options.method       HTTP request method. Default: "GET"
     * @param {Object}      options.headers      HTTP request headers
     * @param {Object}      options.body         HTTP request body
     * @param {Object}      options.credentials  Authentication credentials mode.
     * @returns {Promise.<Object>}
     */
    request(uri, params=null, options=null) {
        if (!uri.startsWith('http')) {
            uri = joinUris(SpotifyApi.API_URI, uri);
        }

        if (params) {
            uri = buildUri(uri, params);
        }

        options = Object.assign({}, {method: 'GET', headers: {}}, options);
        options.headers = Object.assign({}, {'Accept': 'application/json', 'Accept-Charset': 'utf-8'}, options.headers);

        if (options.body) {
            options.body = JSON.stringify(options.body);
        }

        if (this._accessToken) {
            options.headers['Authorization'] = `Bearer ${this._accessToken}`;
        }

        return this.limiter.add(request, null, [uri, options]);
    }

    /**
     * Fetch all pages from the Spotify API
     * @param {Function} fn          Function that fetches single page
     * @param {Array}    args        Function arguments
     * @param {Function} onProgress  Callback with progress on each page
     * @param {String}   rootName    Optional. Root name of the paging object in the response
     * @param {Object}   response    Null for initial call
     * @returns {Promise.<Object>}
     * @private
     */
    _getAllPages(fn, args, onProgress=null, rootName=null, response=null) {
        if (response === null) {
            return fn.apply(this, args)
                .then((data) => {
                    if (onProgress) {
                        onProgress(pagingObjectToProgress(data, rootName));
                    }
                    return this._getAllPages(fn, args, onProgress, rootName, data);
                });
        }

        let promise;
        let next = rootName ? response[rootName].next : response.next;
        if (next) {
            promise = this.request(next)
                .then((response2) => {
                    if (onProgress) {
                        onProgress(pagingObjectToProgress(response2, rootName));
                    }
                    if (rootName) {
                        response2[rootName].items = response[rootName].items.concat(response2[rootName].items);
                    } else {
                        response2.items = response.items.concat(response2.items);
                    }
                    return this._getAllPages(fn, args, onProgress, rootName, response2);
                });
        } else {
            promise = Promise.resolve(response);
        }
        return promise;
    }

    /**
     * Get detailed profile information about the current user (including the current user’s username).
     * @returns {Promise.<Object>}
     */
    getMyProfile() {
        return this.request('me');
    }

    /**
     * Get public profile information about a Spotify user.
     * @param {String} userId
     * @returns {Promise.<Object>}
     */
    getUserProfile(userId) {
        return this.request(`users/${userId}`);
    }

    /**
     * Get a list of the songs saved in the current Spotify user’s “Your Music” library.
     * @param {Object} options
     * @param {Number} options.limit   Optional. The maximum number of objects to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number} options.offset  Optional. The index of the first object to return. Default: 0 (i.e., the first object). Use with limit to get the next set of objects.
     * @param {String} options.market  Optional. An ISO 3166-1 alpha-2 country code. Provide this parameter if you want to apply Track Relinking.
     * @returns {Promise.<Object>}
     */
    getMySavedTracks(options) {
        return this.request('me/tracks', options);
    }

    /**
     * Get a list of ALL the songs saved in the current Spotify user’s “Your Music” library.
     * @param {Function} onProgress      Function called with progress object after each page is received.
     * @param {Object}   options
     * @param {Number}   options.limit   Optional. The maximum number of objects to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {String}   options.market  Optional. An ISO 3166-1 alpha-2 country code. Provide this parameter if you want to apply Track Relinking.
     * @returns {Promise.<Object>}
     */
    getMySavedTracksAll(onProgress, options) {
        options = Object.assign({}, options, {limit: 50});
        return this._getAllPages(this.getMySavedTracks, [options], )
    }

    /**
     * Get a list of the playlists owned or followed by the current Spotify user.
     * @param {Object} options
     * @param {Number} options.limit   Optional. The maximum number of playlists to return. Default: 20. Minimum: 1. Maximum: 50.
     * @param {Number} options.offset  Optional. The index of the first playlist to return. Default: 0 (the first object). Maximum offset: 100.000. Use with limit to get the next set of playlists.
     * @returns {Promise.<Object>}
     */
    getMyPlaylists(options) {
        return this.request('me/playlists', options);
    }

    /**
     * Get a list of ALL the playlists owned or followed by the current Spotify user.
     * @param {Function} onProgress      Function called with progress object after each page is received.
     * @returns {Promise.<Object>}
     */
    getMyPlaylistsAll(onProgress) {
        return this._getAllPages(this.getMyPlaylists, [{limit: 50}], onProgress)
    }

    /**
     * Get the current user’s top tracks based on calculated affinity.
     * @param {Object} options
     * @param {Number} options.limit       Optional. The number of entities to return. Default: 20. Minimum: 1. Maximum: 50. For example: limit=2
     * @param {Number} options.offset      Optional. The index of the first entity to return. Default: 0 (i.e., the first track). Use with limit to get the next set of entities.
     * @param {String} options.time_range  Optional. Over what time frame the affinities are computed. Valid values: long_term (calculated from several years of data and including all new data as it becomes available), medium_term (approximately last 6 months), short_term (approximately last 4 weeks). Default: medium_term.
     * @returns {Promise.<Object>}
     */
    getMyTopTracks(options) {
        return this.request('me/top/tracks', options);
    }

    /**
     * Get ALL the current user’s top tracks based on calculated affinity.
     * @param {Function} onProgress          Function called with progress object after each page is received.
     * @param {Object}   options
     * @param {String}   options.time_range  Optional. Over what time frame the affinities are computed. Valid values: long_term (calculated from several years of data and including all new data as it becomes available), medium_term (approximately last 6 months), short_term (approximately last 4 weeks). Default: medium_term.
     * @returns {Promise.<Object>}
     */
    getMyTopTracksAll(onProgress, options) {
        options = Object.assign({}, options, {limit: 50});
        return this._getAllPages(this.getMyTopTracks, [options], onProgress);
    }

    /**
     * Get full details of the tracks of a playlist owned by a Spotify user.
     * @param {String} userId          The user's Spotify user ID.
     * @param {String} playlistId      The Spotify ID for the playlist.
     * @param {Object} options
     * @param {Number} options.limit   Optional. The number of entities to return. Default: 20. Minimum: 1. Maximum: 50. For example: limit=2
     * @param {Number} options.offset  Optional. The index of the first entity to return. Default: 0 (i.e., the first track). Use with limit to get the next set of entities.
     * @param {String} options.fields  Optional. Filters for the query: a comma-separated list of the fields to return.
     * @param {String} options.market  Optional. An ISO 3166-1 alpha-2 country code. Provide this parameter if you want to apply Track Relinking.
     * @returns {Promise.<Object>}
     */
    getPlaylistTracks(userId, playlistId, options) {
        return this.request(`users/${userId}/playlists/${playlistId}/tracks`, options);
    }

    /**
     * Get full details of ALL the tracks of a playlist owned by a Spotify user.
     * @param {Function} onProgress      Function called with progress object after each page is received.
     * @param {String}   userId          The user's Spotify user ID.
     * @param {String}   playlistId      The Spotify ID for the playlist.
     * @param {Object}   options
     * @param {String}   options.fields  Optional. Filters for the query: a comma-separated list of the fields to return.
     * @param {String}   options.market  Optional. An ISO 3166-1 alpha-2 country code. Provide this parameter if you want to apply Track Relinking.
     * @returns {Promise.<Object>}
     */
    getPlaylistTracksAll(onProgress, userId, playlistId, options) {
        options = Object.assign({}, options, {limit: 50});
        return this._getAllPages(this.getPlaylistTracks, [userId, playlistId, options], onProgress);
    }

    /**
     * Get Spotify catalog information for multiple albums identified by their Spotify IDs.
     * @param {String[]} ids             A comma-separated list of the Spotify IDs for the albums. Maximum: 20 IDs.
     * @param {Object}   options
     * @param {String}   options.market  Optional. An ISO 3166-1 alpha-2 country code. Provide this parameter if you want to apply Track Relinking.
     * @returns {Promise.<Object>}
     */
    getAlbums(ids, options) {
        const params = Object.assign({}, options, {ids: ids.join(',')});
        return this.request('albums', params);
    }

    /**
     * Get Spotify catalog information for multiple albums identified by their Spotify IDs.
     * This function handles breaking ids into chunks of 20.
     * @param {Function} onProgress      Function called with progress object after each page is received.
     * @param {String[]} ids             A comma-separated list of the Spotify IDs for the albums. Maximum: 20 IDs.
     * @param {Object}   options
     * @param {String}   options.market  Optional. An ISO 3166-1 alpha-2 country code. Provide this parameter if you want to apply Track Relinking.
     * @returns {Promise.<Object>}
     */
    getAlbumsAll(onProgress, ids, options) {
        const chunks = sliceIntoChunks(ids, 20);
        let promise = Promise.resolve({albums: []});
        chunks.forEach((chunk, index, array) => {
            promise = promise.then((response) => {
                return this.getAlbums(chunk, options)
                    .then((response2) => {
                        if (onProgress) {
                            onProgress(chunkToProgress(index, array, ids.length))
                        }
                        response2.albums = response.albums.concat(response2.albums);
                        return response2;
                    });
            });
        });
        return promise;
    }

    /**
     * Get Spotify catalog information for several artists based on their Spotify IDs.
     * @param {String[]} ids  A comma-separated list of the Spotify IDs for the artists. Maximum: 50 IDs.
     * @returns {Promise.<Object>}
     */
    getArtists(ids) {
        const params = {ids: ids.join(',')};
        return this.request('artists', params);
    }

    /**
     * Get Spotify catalog information for several artists based on their Spotify IDs.
     * This function handles breaking ids into chunks of 50.
     * @param {Function} onProgress      Function called with progress object after each page is received.
     * @param {String[]} ids             A comma-separated list of the Spotify IDs for the artists. Maximum: 50 IDs.
     * @returns {Promise.<Object>}
     */
    getArtistsAll(onProgress, ids) {
        const chunks = sliceIntoChunks(ids, 50);
        let promise = Promise.resolve({artists: []});
        chunks.forEach((chunk, index, array) => {
            promise = promise.then((response) => {
                return this.getArtists(chunk)
                    .then((response2) => {
                        if (onProgress) {
                            onProgress(chunkToProgress(index, array, ids.length))
                        }
                        response2.artists = response.artists.concat(response2.artists);
                        return response2;
                    });
            });
        });
        return promise;
    }

    /**
     * Get tracks for several playlists. May request multiple times if array is larger than maximum allowed. Also accepts
     * special playlists (e.g. Saved Tracks and Top Tracks)
     * @param {Function} onProgress      Function called with progress object after each page is received.
     * @param {Object[]} ids
     * @param {String}   ids.userId          The user's Spotify user ID.
     * @param {String}   ids.playlistId      The Spotify ID for the playlist or keywords playlist_saved_tracks, playlist_top_tracks_short_term, playlist_top_tracks_medium_term, or playlist_top_tracks_long_term.
     * @param {Object}   options
     * @param {String}   options.fields  Optional. Filters for the query: a comma-separated list of the fields to return.
     * @param {String}   options.market  Optional. An ISO 3166-1 alpha-2 country code. Provide this parameter if you want to apply Track Relinking.
     * @returns {Promise.<Object>}
     */
    getSeveralPlaylistTracks(onProgress, ids, options) {
        let promise = Promise.resolve([]);
        let onProgressInternal = (index) => (progress) => {
            if (onProgress) {
                let current = index+1;
                let last =  ids.length;
                let step = 100.0 / ids.length;
                let percent = step * progress.percent / 100.0 + index * step;
                onProgress({current, last, percent});
            }
        };
        ids.forEach((id, index) => {
            promise = promise
                .then((tracks) => {
                    let promise;
                    switch (id.playlistId) {
                        case 'playlist_saved_tracks':
                            promise = this.getMySavedTracksAll(onProgressInternal(index), options);
                            break;
                        case 'playlist_top_tracks_short_term':
                            promise = this.getMyTopTracksAll(onProgressInternal(index), {time_range: 'short_term'});
                            break;
                        case 'playlist_top_tracks_medium_term':
                            promise = this.getMyTopTracksAll(onProgressInternal(index), {time_range: 'medium_term'});
                            break;
                        case 'playlist_top_tracks_long_term':
                            promise = this.getMyTopTracksAll(onProgressInternal(index), {time_range: 'medium_term'});
                            break;
                        default:
                            promise = this.getPlaylistTracksAll(onProgressInternal(index), id.userId, id.playlistId, options);
                    }
                    return promise.then((response) => {
                        const newTracks = response.items.filter((track) => {
                            return track && track.track && track.added_at;
                        }).map((track => track.track));

                        const newTracks2 = response.items.filter((track) => {
                            return track && !track.track && !track.added_at;
                        });

                        tracks = tracks.concat(newTracks);
                        tracks = tracks.concat(newTracks2);
                        return tracks;
                    });
                });
        });

        promise = promise.then((tracks) => SpotifyApi.filterTracks(tracks, {removeNotPlayable: true}));
        return promise;
    }

    getGenreSeeds() {
        return this.request('recommendations/available-genre-seeds');
    }

    /**
     *
     * @param {String[]} seedTracks
     * @param {String[]} seedArtists
     * @param {String[]} seedGenres
     * @param options
     * @param {String}   options.market  Optional. An ISO 3166-1 alpha-2 country code. Provide this parameter if you want to apply Track Relinking. Because min_*, max_* and target_* are applied to pools before relinking, the generated results may not precisely match the filters applied. Original, non-relinked tracks are available via the linked_from attribute of the relinked track response.
     * @param {String}   options.limit  Optional. The target size of the list of recommended tracks. For seeds with unusually small pools or when highly restrictive filtering is applied, it may be impossible to generate the requested number of recommended tracks. Debugging information for such cases is available in the response. Default: 20. Minimum: 1. Maximum: 100.
     * @param {Number}   options.max_*
     * @param {Number}   options.min_*
     * @param {Number}   options.target_*
     * @returns {Promise.<Object>}
     */
    getRecommendations(seedTracks, seedArtists, seedGenres, options) {
        options = Object.assign({}, options);
        if (seedTracks && seedTracks.length > 0) {
            options.seed_tracks = seedTracks.join(',');
        }
        if (seedArtists && seedArtists.length > 0) {
            options.seed_artists = seedArtists.join(',');
        }
        if (seedGenres && seedGenres.length > 0) {
            options.seed_genres = seedGenres.join(',');
        }
        return this.request('recommendations', options);
    }

    /**
     * Create a playlist for a Spotify user. (The playlist will be empty until you add tracks.)
     * @param {String} userId                 The user's Spotify user ID.
     * @param {String} name                   Required. The name for the new playlist, for example "Your Coolest Playlist". This name does not need to be unique; a user may have several playlists with the same name.
     * @param {Object} options
     * @param {Boolean} options.public        Optional, default true. If true the playlist will be public, if false it will be private. To be able to create private playlists, the user must have granted the playlist-modify-private scope.
     * @param {String} options.collaborative  Optional, default false. If true the playlist will be collaborative. Note that to create a collaborative playlist you must also set public to false. To create collaborative playlists you must have granted playlist-modify-private and playlist-modify-public scopes.
     * @returns {Promise.<Object>}
     */
    createPlaylist(userId, name, options) {
        const init = {method: 'POST', body: Object.assign({}, {name}, options)};
        return this.request(`users/${userId}/playlists`, null, init);
    }

    /**
     * Add tracks to an existing playlist
     * @param {String}   userId           The user's Spotify user ID.
     * @param {String}   playlistId       The Spotify ID for the playlist.
     * @param {String[]} uris             A JSON array of the Spotify track URIs to add. A maximum of 100 tracks can be added in one request.
     * @param options
     * @param {Boolean} options.position  Optional. The position to insert the tracks, a zero-based index. For example, to insert the tracks in the first position: position=0; to insert the tracks in the third position: position=2. If omitted, the tracks will be appended to the playlist. Tracks are added in the order they are listed in the query string or request body.
     * @returns {Promise.<Object>}
     */
    addTracksToPlaylist(userId, playlistId, uris, options) {
        const init = {method: 'POST', body: {uris}};
        return this.request(`users/${userId}/playlists/${playlistId}/tracks`, options, init);
    }

    /**
     * Add tracks to an existing playlist. May request multiple times if array is larger than maximum allowed.
     * @param {Function} onProgress        Function called with progress object after each page is received.
     * @param {String}   userId            The user's Spotify user ID.
     * @param {String}   playlistId        The Spotify ID for the playlist.
     * @param {String[]} uris              A JSON array of the Spotify track URIs to add. A maximum of 100 tracks can be added in one request.
     * @param options
     * @param {Boolean}  options.position  Optional. The position to insert the tracks, a zero-based index. For example, to insert the tracks in the first position: position=0; to insert the tracks in the third position: position=2. If omitted, the tracks will be appended to the playlist. Tracks are added in the order they are listed in the query string or request body.
     * @returns {Promise.<Object>}
     */
    addTracksToPlaylistAll(onProgress, userId, playlistId, uris, options) {
        const chunks = sliceIntoChunks(uris, 100);
        let promise = Promise.resolve();
        chunks.forEach((chunk, index, array) => {
            promise = promise.then((response) => {
                return this.addTracksToPlaylist(userId, playlistId, chunk, options)
                    .then((response2) => {
                        if (onProgress) {
                            onProgress(chunkToProgress(index, array, uris.length))
                        }
                        return response2;
                    });
            });
        });
        return promise;
    }

    /**
     * Create a playlist and add tracks
     * @param {Function} onProgress                     Function called with progress object after each page is received.
     * @param {String}   userId                         The user's Spotify user ID.
     * @param {String}   name                           Required. The name for the new playlist, for example "Your Coolest Playlist". This name does not need to be unique; a user may have several playlists with the same name.
     * @param {String[]} uris                           A JSON array of the Spotify track URIs to add. A maximum of 100 tracks can be added in one request.
     * @param createPlaylistOptions
     * @param {Boolean} createPlaylistOptions.public        Optional, default true. If true the playlist will be public, if false it will be private. To be able to create private playlists, the user must have granted the playlist-modify-private scope.
     * @param {String} createPlaylistOptions.collaborative  Optional, default false. If true the playlist will be collaborative. Note that to create a collaborative playlist you must also set public to false. To create collaborative playlists you must have granted playlist-modify-private and playlist-modify-public scopes.
     * @param addTracksOptions
     * @param {Boolean}  addTracksOptions.position      Optional. The position to insert the tracks, a zero-based index. For example, to insert the tracks in the first position: position=0; to insert the tracks in the third position: position=2. If omitted, the tracks will be appended to the playlist. Tracks are added in the order they are listed in the query string or request body.
     * @returns {Promise}
     */
    createPlaylistAndAddTracks(onProgress, userId, name, uris, createPlaylistOptions, addTracksOptions) {
        return this.createPlaylist(userId, name, createPlaylistOptions)
            .then((response) => {
                const playlistId = response.id;
                return this.addTracksToPlaylistAll(onProgress, userId, playlistId, uris, addTracksOptions)
                    .then(() => response);
            });
    }

    /**
     * Create multiple playlists and add tracks
     * @param {Function} onProgress                     Function called with progress object after each page is received.
     * @param {String}   userId                         The user's Spotify user ID.
     * @param {Object[]} playlists
     * @param {String}   playlists.name
     * @param {String[]} playlists.uris
     * @param {Object}   playlists.createPlaylistOptions
     * @param {Object}   playlists.addTracksOptions
     * @returns {Promise}
     */
    createSeveralPlaylistsAndAddTracks(onProgress, userId, playlists) {
        let onProgressInternal = (index) => (progress) => {
            if (onProgress) {
                let current = index+1;
                let last =  playlists.length;
                let step = 100.0 / playlists.length;
                let percent = step * progress.percent / 100.0 + index * step;
                onProgress({current, last, percent});
            }
        };
        let promise = Promise.resolve();
        playlists.forEach((playlist, index) => {
            promise = promise.then(() => {
                return this.createPlaylistAndAddTracks(onProgressInternal(index),
                    userId, playlist.name, playlist.uris, playlist.createPlaylistOptions, playlist.addTracksOptions);
            })
        });
        return promise;
    }

    /**
     * Filter and deduplicate tracks array. Two passes of deduplication are made using the Spotify ID and
     * track name, artist names, and track duration
     * @param {Object[]} tracks
     * @param {Object} options
     * @param {String} options.market                          Remove any not matching track
     * @param {Number} options.duplicateMaxDurationDifference  Maximum difference in duration between tracks. Defaults to 1000ms
     * @param {Boolean} options.removeNoAvailableMarkets       Remove any tracks with no available markets
     * @param {Boolean} options.removeNotPlayable              Remove any tracks that are not playable
     * @returns {Object[]}
     */
    static filterTracks(tracks, options) {
        options = Object.assign({}, {
            market: null,
            duplicateMaxDurationDifference: 1000,
            removeNoAvailableMarkets: false,
            removeNotPlayable: false,
        }, options);

        let trackCountStats = {
            original: tracks.length,
            final: 0,
            noId: 0,
            noAvailableMarkets: 0,
            noCurrentMarkets: 0,
            notPlayable: 0,
            duplicateIds: 0,
            duplicateOther: 0,
            possibleDuplicates: 0,
        };

        // remove duplicates using id
        let seenSpotifyIds = new Set();
        tracks = tracks.filter((track) => {
            if (!track.id || !track.uri) {
                trackCountStats.noId += 1;
                return false;
            } else if (options.removeNotPlayable && track.is_playable === false) {
                trackCountStats.notPlayable += 1;
                return false;
            } else if (options.removeNoAvailableMarkets && (!track.available_markets || track.available_markets.length === 0)) {
                trackCountStats.noAvailableMarkets += 1;
                return false;
            } else if (options.market && (!track.available_markets || track.available_markets.indexOf(options.market) === -1)) {
                trackCountStats.noCurrentMarkets += 1;
                return false;
            }

            if (seenSpotifyIds.has(track.id)) {
                trackCountStats.duplicateIds += 1;
                return false;
            } else {
                seenSpotifyIds.add(track.id);
                return true;
            }
        });

        let duplicateLookup = {};
        let spotifyIdsToRemove = new Set();

        tracks.forEach((track) => {
            let artistNames = track.artists.map((artist) => artist.name.toLowerCase());
            artistNames.sort();
            artistNames = artistNames.join('_');
            const key = `${track.name}_${artistNames}`;
            if (duplicateLookup[key]) {
                trackCountStats.possibleDuplicates += 1;
                let otherTrack = duplicateLookup[key];
                let absdiff = Math.abs(otherTrack.duration_ms - track.duration_ms);
                if (absdiff < options.duplicateMaxDurationDifference) {
                    // choose the more popular track
                    if (track.popularity > otherTrack.popularity) {
                        spotifyIdsToRemove.add(otherTrack.id);
                        duplicateLookup[key] = track;
                    } else {
                        spotifyIdsToRemove.add(track.id);
                    }
                }
            } else {
                duplicateLookup[key] = track;
            }
        });

        const len1 = tracks.length;
        tracks = tracks.filter((track) => !spotifyIdsToRemove.has(track.id));
        trackCountStats.duplicateOther = len1 - tracks.length;
        trackCountStats.final = tracks.length;
        //console.log(trackCountStats);
        //console.log(spotifyIdsToRemove);
        //console.log(duplicateLookup);
        return tracks;
    }

    /**
     * Get ids
     * @param {Object[]} tracks
     * @returns {{artistIds: [*], albumIds: [*]}}
     */
    static getArtistAndAlbumIdsFromTracks(tracks) {
        let artists = new Set();
        let albums = new Set();
        tracks.forEach((track) => {
            albums.add(track.album.id);
            track.artists.forEach((artist) => {
                artists.add(artist.id);
            });
        });

        return {artistIds: [...artists], albumIds: [...albums]};
    }

    /**
     * Get a list of genre playlists using artists and albums as genre sources
     * @param {Object[]} tracks
     * @param {Object[]} artists
     * @param {Object[]} albums
     * @param {Number}   minTracks - minimum number of tracks per genre
     * @returns {Array}
     */
    static getGenrePlaylists(tracks, artists, albums, minTracks=5) {
        let artistGenresById = {};
        let albumGenresById = {};
        let tracksByGenre = {};
        artists.forEach((artist) => {
            artistGenresById[artist.id] = artist.genres;
            artist.genres.forEach((genre) => {
                tracksByGenre[genre] = [];
            });
        });
        albums.forEach((album) => {
            albumGenresById[album.id] = album.genres;
            album.genres.forEach((genre) => {
                tracksByGenre[genre] = [];
            });
        });

        tracks.forEach((track) => {
            let trackGenres = new Set();
            albumGenresById[track.album.id].forEach((genre) => {
                trackGenres.add(genre);
            });
            track.artists.forEach((artist) => {
                artistGenresById[artist.id].forEach((genre) => {
                    trackGenres.add(genre);
                });
            });
            trackGenres.forEach((genre) => {
                tracksByGenre[genre].push(track.uri);
            });
        });
        let genres = Object.keys(tracksByGenre).map((genre) => {
            const trackUris = tracksByGenre[genre];
            return {name: genre, id: genre, tracks: {total: trackUris.length, items: trackUris}};
        });
        genres = genres.filter((genre) => genre.tracks.total >= minTracks);
        genres.sort((a, b) => {
            if (a.tracks.total < b.tracks.total) return 1;
            if (a.tracks.total > b.tracks.total) return -1;
            if (a.id < b.id) return -1;
            if (a.id > b.id) return 1;
            return 0;
        });
        return genres;
    }
}


