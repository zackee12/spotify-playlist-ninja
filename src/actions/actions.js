
export const ACTIONS = {
    SET_ACCESS_TOKEN: 'SET_ACCESS_TOKEN',
    CLEAR_ACCESS_TOKEN: 'CLEAR_ACCESS_TOKEN',
    SET_CSRF_TOKEN: 'SET_CSRF_TOKEN',
    CLEAR_CSRF_TOKEN: 'CLEAR_CSRF_TOKEN',
    SET_PROGRESS: 'SET_PROGRESS',
    CLEAR_PROGRESS: 'CLEAR_PROGRESS',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
    SET_PROFILE: 'SET_PROFILE',
    CLEAR_PROFILE: 'CLEAR_PROFILE',
    REQUEST_PROFILE: 'REQUEST_PROFILE',
    SET_PLAYLISTS: 'SET_PLAYLISTS',
    CLEAR_PLAYLISTS: 'CLEAR_PLAYLISTS',
    REQUEST_PLAYLISTS: 'REQUEST_PLAYLISTS',
    SELECT_PLAYLISTS: 'SELECT_PLAYLISTS',
    SET_GENRES: 'SET_GENRES',
    CLEAR_GENRES: 'CLEAR_GENRES',
    REQUEST_GENRES: 'REQUEST_GENRES',
    SELECT_GENRES: 'SELECT_GENRES',
    SET_GENRE_SEEDS: 'SET_GENRE_SEEDS',
    CLEAR_GENRE_SEEDS: 'CLEAR_GENRE_SEEDS',
    REQUEST_GENRE_SEEDS: 'REQUEST_GENRE_SEEDS',
    SET_RECOMMENDATIONS: 'SET_RECOMMENDATIONS',
    CLEAR_RECOMMENDATIONS: 'CLEAR_RECOMMENDATIONS',
    REQUEST_RECOMMENDATIONS: 'REQUEST_RECOMMENDATIONS',
};

export function setAccessToken(accessToken) {
    return {type: ACTIONS.SET_ACCESS_TOKEN, accessToken};
}

export function clearAccessToken() {
    return {type: ACTIONS.CLEAR_ACCESS_TOKEN};
}

export function setCsrfToken(csrfToken) {
    return {type: ACTIONS.SET_CSRF_TOKEN, csrfToken};
}

export function clearCsrfToken() {
    return {type: ACTIONS.CLEAR_CSRF_TOKEN};
}

export function setProgress(progress) {
    return {type: ACTIONS.SET_PROGRESS, progress};
}

export function clearProgress() {
    return {type: ACTIONS.CLEAR_PROGRESS};
}

export function setError(error) {
    return {type: ACTIONS.SET_ERROR, error};
}

export function clearError() {
    return {type: ACTIONS.CLEAR_ERROR};
}

export function setProfile(profile) {
    return {type: ACTIONS.SET_PROFILE, profile};
}

export function clearProfile() {
    return {type: ACTIONS.CLEAR_PROFILE};
}

export function requestProfile() {
    return {type: ACTIONS.REQUEST_PROFILE}
}

export function setPlaylists(playlists) {
    return {type: ACTIONS.SET_PLAYLISTS, playlists};
}

export function clearPlaylists() {
    return {type: ACTIONS.CLEAR_PLAYLISTS};
}

export function requestPlaylists() {
    return {type: ACTIONS.REQUEST_PLAYLISTS}
}

export function selectPlaylists(selected) {
    return {type: ACTIONS.SELECT_PLAYLISTS, selected};
}

export function setGenres(genres) {
    return {type: ACTIONS.SET_GENRES, genres};
}

export function clearGenres() {
    return {type: ACTIONS.CLEAR_GENRES};
}

export function requestGenres() {
    return {type: ACTIONS.REQUEST_GENRES}
}

export function selectGenres(selected) {
    return {type: ACTIONS.SELECT_GENRES, selected};
}

export function setGenreSeeds(genres) {
    return {type: ACTIONS.SET_GENRE_SEEDS, genres};
}

export function clearGenreSeeds() {
    return {type: ACTIONS.CLEAR_GENRE_SEEDS};
}

export function requestGenreSeeds() {
    return {type: ACTIONS.REQUEST_GENRE_SEEDS}
}

export function setRecommendations(recommendations) {
    return {type: ACTIONS.SET_RECOMMENDATIONS, recommendations};
}

export function clearRecommendations() {
    return {type: ACTIONS.CLEAR_RECOMMENDATIONS};
}

export function requestRecommendations() {
    return {type: ACTIONS.REQUEST_RECOMMENDATIONS}
}


export default {
    ACTIONS,
    setAccessToken,
    clearAccessToken,
    setCsrfToken,
    clearCsrfToken,
    setProgress,
    clearProgress,
    setError,
    clearError,
    setProfile,
    clearProfile,
    requestProfile,
    setPlaylists,
    clearPlaylists,
    requestPlaylists,
    selectPlaylists,
    setGenres,
    clearGenres,
    requestGenres,
    selectGenres,
    setGenreSeeds,
    clearGenreSeeds,
    requestGenreSeeds,
    setRecommendations,
    clearRecommendations,
    requestRecommendations,
};