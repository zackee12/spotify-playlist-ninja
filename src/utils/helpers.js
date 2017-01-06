import SpotifyIconGreen from '../images/Spotify_Icon_RGB_Green.png';

export function isDevelopmentSite() {
    return window.location.host === 'localhost:3000';
}

export function getSpecialPlaylists() {
    return [
        {
            id: 'playlist_saved_tracks',
            name: 'Saved Tracks',
            tracks: {total: '-'},
            owner: {id: 'spotify'},
            images: [{url: SpotifyIconGreen}],
        },
        {
            id: 'playlist_top_tracks_short_term',
            name: 'Top Tracks - Short Term',
            tracks: {total: '-'},
            owner: {id: 'spotify'},
            images: [{url: SpotifyIconGreen}],
        },
        {
            id: 'playlist_top_tracks_medium_term',
            name: 'Top Tracks - Medium Term',
            tracks: {total: '-'},
            owner: {id: 'spotify'},
            images: [{url: SpotifyIconGreen}],
        },
        {
            id: 'playlist_top_tracks_long_term',
            name: 'Top Tracks - Long Term',
            tracks: {total: '-'},
            owner: {id: 'spotify'},
            images: [{url: SpotifyIconGreen}],
        },
    ];
}

export default {
    isDevelopmentSite,
    getSpecialPlaylists,
};