import Actions from './actions';
import SpotifyApi from '../utils/spotify-api';
import helpers from '../utils/helpers';

function simpleCreatorPromiseFn(action) {
    return (arg) => (dispatch) => {
        dispatch(action(arg));
        return Promise.resolve();
    };
}

export const setProgress = simpleCreatorPromiseFn(Actions.setProgress);
export const clearProgress = simpleCreatorPromiseFn(Actions.clearProgress);
export const clearError = simpleCreatorPromiseFn(Actions.clearError);
export const setProfile = simpleCreatorPromiseFn(Actions.setProfile);
export const clearProfile = simpleCreatorPromiseFn(Actions.clearProfile);
export const requestProfile = simpleCreatorPromiseFn(Actions.requestProfile);
export const setPlaylists = simpleCreatorPromiseFn(Actions.setPlaylists);
export const clearPlaylists = simpleCreatorPromiseFn(Actions.clearPlaylists);
export const requestPlaylists = simpleCreatorPromiseFn(Actions.requestPlaylists);
export const selectPlaylists = simpleCreatorPromiseFn(Actions.selectPlaylists);
export const setGenres = simpleCreatorPromiseFn(Actions.setGenres);
export const clearGenres = simpleCreatorPromiseFn(Actions.clearGenres);
export const requestGenres = simpleCreatorPromiseFn(Actions.requestGenres);
export const selectGenres = simpleCreatorPromiseFn(Actions.selectGenres);
export const setGenreSeeds = simpleCreatorPromiseFn(Actions.setGenreSeeds);
export const clearGenreSeeds = simpleCreatorPromiseFn(Actions.clearGenreSeeds);
export const requestGenreSeeds = simpleCreatorPromiseFn(Actions.requestGenreSeeds);
export const setRecommendations = simpleCreatorPromiseFn(Actions.setRecommendations);
export const clearRecommendations = simpleCreatorPromiseFn(Actions.clearRecommendations);
export const requestRecommendations = simpleCreatorPromiseFn(Actions.requestRecommendations);

export function setAccessToken(accessToken) {
    return (dispatch, getState, api) => {
        api.accessToken = accessToken;
        sessionStorage.setItem('accessToken', accessToken);
        dispatch(Actions.setAccessToken(accessToken));
        return Promise.resolve();
    };
}

export function clearAccessToken() {
    return (dispatch, getState, api) => {
        api.accessToken = null;
        sessionStorage.removeItem('accessToken');
        dispatch(Actions.clearAccessToken());
        return Promise.resolve();
    };
}

export function setCsrfToken(csrfToken) {
    return (dispatch, getState, api) => {
        sessionStorage.setItem('csrfToken', csrfToken);
        dispatch(Actions.setCsrfToken(csrfToken));
        return Promise.resolve();
    };
}

export function clearCsrfToken() {
    return (dispatch, getState, api) => {
        api.accessToken = null;
        sessionStorage.removeItem('csrfToken');
        dispatch(Actions.clearCsrfToken());
        return Promise.resolve();
    };
}

export function clearTokens() {
    return (dispatch) => {
        return Promise.all([
            dispatch(clearAccessToken()),
            dispatch(clearCsrfToken())
        ]);
    };
}

export function setError(error) {
    return (dispatch) => {
        dispatch(Actions.setError(error));
        if (error && error.response && error.response.status === 401) {
            return dispatch(clearTokens());
        }
        return Promise.resolve();
    };
}

function fetchProfile() {
    return (dispatch, getState, api) => {
        return dispatch(requestProfile())
            .then(() => api.getMyProfile())
            .then((profile) => dispatch(setProfile(profile)))
            .catch((err) => {
                return dispatch(setError(err))
                    .then(() => {
                        return Promise.reject(err);
                    });
            });
    };
}

function fetchPlaylists(includeSpecialPlaylists=true) {
    return (dispatch, getState, api) => {
        const onProgress = (progress) => {
            progress.message = 'Fetching playlists...';
            return dispatch(setProgress(progress));
        };
        return dispatch(requestPlaylists())
            .then(() => api.getMyPlaylistsAll(onProgress))
            .then((playlists) => dispatch(setPlaylists(includeSpecialPlaylists ? [...helpers.getSpecialPlaylists(), ...playlists.items] : playlists.items)))
            .then(() => dispatch(clearProgress()))
            .catch((err) => {
                return dispatch(setError(err))
                    .then(() => dispatch(clearPlaylists()))
                    .then(() => dispatch(clearProgress()))
                    .then(() => Promise.reject(err));
            });
    };
}

function fetchGenres() {
    return (dispatch, getState, api) => {
        const onProgress1 = (progress) => {
            progress.message = `Fetching tracks from playlists (${progress.current} of ${progress.last})...`;
            progress.percent /= 3.0;
            return dispatch(setProgress(progress));
        };
        const onProgress2 = (progress) => {
            progress.message = `Fetching genres from artists (${progress.current} of ${progress.last})...`;
            progress.percent = progress.percent / 3.0 + 100.0 / 3.0;
            return dispatch(setProgress(progress));
        };
        const onProgress3 = (progress) => {
            progress.message = `Fetching genres from albums (${progress.current} of ${progress.last})...`;
            progress.percent = progress.percent / 3.0 + 200.0 / 3.0;
            return dispatch(setProgress(progress));
        };
        const state = getState();
        const market = state.profile.object.country;
        const ids = state.playlists.array.filter((playlist) => playlist.selected).map((playlist) => {
            return {userId: playlist.owner.id, playlistId: playlist.id};
        });
        return dispatch(requestGenres())
            .then(() => api.getSeveralPlaylistTracks(onProgress1, ids, {market}))
            .then((tracks) => {
                const {albumIds, artistIds} = SpotifyApi.getArtistAndAlbumIdsFromTracks(tracks);
                return api.getArtistsAll(onProgress2, artistIds)
                    .then((artists) => {
                        return api.getAlbumsAll(onProgress3, albumIds)
                            .then((albums) => {
                                const genres = SpotifyApi.getGenrePlaylists(tracks, artists.artists, albums.albums);
                                return dispatch(setGenres(genres));
                            });
                    });
            })
            .then(() => dispatch(clearProgress()))
            .catch((err) => {
                return dispatch(setError(err))
                    .then(() => dispatch(clearGenres()))
                    .then(() => dispatch(clearProgress()))
                    .then(() => Promise.reject(err));
            });
    };
}

function createGenrePlaylists() {
    return (dispatch, getState, api) => {
        const state = getState();
        const onProgress = (progress) => {
            progress.message = `Creating playlists (${progress.current} of ${progress.last})...`;
            return dispatch(setProgress(progress));
        };
        const genres = state.genres.array.filter((genre) => genre.selected).map((genre) => {
            return {name: genre.name, uris: genre.tracks.items};
        });
        return api.createSeveralPlaylistsAndAddTracks(onProgress, state.profile.object.id, genres)
            .then(() => dispatch(clearProgress()))
            .catch((err) => {
                return dispatch(setError(err))
                    .then(() => dispatch(clearProgress()))
                    .then(() => Promise.reject(err));
            });
    }
}

function fetchGenreSeeds() {
    return (dispatch, getState, api) => {
        return dispatch(requestGenreSeeds())
            .then(() => api.getGenreSeeds())
            .then((genres) => dispatch(setGenreSeeds(genres.genres)))
            .catch((err) => {
                return dispatch(setError(err))
                    .then(() => {
                        return Promise.reject(err);
                    });
            });
    };
}

function fetchRecommendations(seedTracks, seedArtists, seedGenres, tuneables, numTracks) {
    return (dispatch, getState, api) => {
        const state = getState();
        let options = {
            market: state.profile.object.country,
            limit: numTracks,
            ...tuneables
        };
        return dispatch(requestRecommendations())
            .then(() => api.getRecommendations(seedTracks, seedArtists, seedGenres, options))
            .then((recommendations) => {
                recommendations.tracks.sort((a, b) => {
                    if (a.artists[0].name < b.artists[0].name) return -1;
                    if (a.artists[0].name > b.artists[0].name) return 1;
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                });
                return dispatch(setRecommendations(recommendations))
            })
            .catch((err) => {
                return dispatch(setError(err))
                    .then(() => {
                        return Promise.reject(err);
                    });
            });
    };
}

function createPlaylist(name, tracks, isPublic) {
    return (dispatch, getState, api) => {

        const onProgress = (progress) => {
            progress.message = `Creating playlist and adding tracks (${progress.current} of ${progress.last})...`;
            return dispatch(setProgress(progress));
        };
        const state = getState();
        const uris = tracks.map((track) => track.uri);
        return api.createPlaylistAndAddTracks(onProgress, state.profile.object.id, name, uris, {public: isPublic})
            .then((response) => {
                return dispatch(clearProgress())
                    .then(() => response);
            })
            .catch((err) => {
                return dispatch(setError(err))
                    .then(() => dispatch(clearProgress()))
                    .then(() => Promise.reject(err));
            });
    };
}

function fetchIfNeeded(fn, stateName, thisArg=null) {
    return (...args) => (dispatch, getState) => {
        const state = getState();
        if (!state.accessToken || state[stateName].isFetching) {
            return Promise.resolve();
        }
        return dispatch(fn.apply(thisArg, args));
    };
}

export const fetchProfileIfNeeded = fetchIfNeeded(fetchProfile, 'profile');
export const fetchPlaylistsIfNeeded = fetchIfNeeded(fetchPlaylists, 'playlists');
export const fetchGenresIfNeeded = fetchIfNeeded(fetchGenres, 'genres');
export const fetchGenreSeedsIfNeeded = fetchIfNeeded(fetchGenreSeeds, 'genreSeeds');
export const fetchRecommendationsIfNeeded = fetchIfNeeded(fetchRecommendations, 'recommendations');

export default {
    setAccessToken,
    clearAccessToken,
    setCsrfToken,
    clearCsrfToken,
    clearTokens,
    setProgress,
    clearProgress,
    setError,
    clearError,
    setProfile,
    clearProfile,
    requestProfile,
    fetchProfileIfNeeded,
    setPlaylists,
    clearPlaylists,
    requestPlaylists,
    selectPlaylists,
    fetchPlaylistsIfNeeded,
    setGenres,
    clearGenres,
    requestGenres,
    selectGenres,
    fetchGenresIfNeeded,
    createGenrePlaylists,
    setGenreSeeds,
    clearGenreSeeds,
    requestGenreSeeds,
    fetchGenreSeedsIfNeeded,
    setRecommendations,
    clearRecommendations,
    requestRecommendations,
    fetchRecommendationsIfNeeded,
    createPlaylist,
};