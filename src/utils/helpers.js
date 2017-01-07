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

function formatMilliseconds(duration) {
    let ms = parseInt((duration%1000), 10);
    let s = parseInt((duration/1000)%60, 10);
    let m = parseInt((duration/(1000*60))%60, 10);
    let h = parseInt((duration/(1000*60*60))%24, 10);

    let h0 = (h < 10) ? '0' : '';
    let m0 = (m < 10) ? '0' : '';
    let s0 = (s < 10) ? '0' : '';
    let ms0 = (ms < 10) ? '00': ((ms < 100) ? '0' : '');

    return `${h0}${h}:${m0}${m}:${s0}${s}.${ms0}${ms}`
}

function clipNumber(value, min, max) {
    return Math.max(Math.min(value, max), min);
}

export default {
    isDevelopmentSite,
    getSpecialPlaylists,
    formatMilliseconds,
    clipNumber,
};