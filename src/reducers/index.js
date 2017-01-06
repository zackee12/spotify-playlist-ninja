import { combineReducers } from 'redux';
import { ACTIONS } from '../actions';

function accessToken(state=null, action) {
    switch (action.type) {
        case ACTIONS.SET_ACCESS_TOKEN:
            return action.accessToken;
        case ACTIONS.CLEAR_ACCESS_TOKEN:
            return null;
        default:
            return state;
    }
}

function csrfToken(state=null, action) {
    switch (action.type) {
        case ACTIONS.SET_CSRF_TOKEN:
            return action.csrfToken;
        case ACTIONS.CLEAR_CSRF_TOKEN:
            return null;
        default:
            return state;
    }
}

function progress(state={current: 1, last: 1, percent: 100.0, message: ''}, action) {
    switch (action.type) {
        case ACTIONS.SET_PROGRESS:
            return action.progress;
        case ACTIONS.CLEAR_PROGRESS:
            return {current: 1, last: 1, percent: 100.0, message: ''};
        default:
            return state;
    }
}

function error(state=null, action) {
    switch (action.type) {
        case ACTIONS.SET_ERROR:
            return action.error;
        case ACTIONS.CLEAR_ERROR:
            return null;
        default:
            return state;
    }
}

function profile(state={isFetching: false, object: null}, action) {
    switch (action.type) {
        case ACTIONS.REQUEST_PROFILE:
            return Object.assign({}, state, {isFetching: true});
        case ACTIONS.SET_PROFILE:
            return Object.assign({}, state, {isFetching: false, object: action.profile});
        case ACTIONS.CLEAR_PROFILE:
            return {isFetching: false, object: null};
        default:
            return state;
    }
}

function playlists(state={isFetching: false, array: null}, action) {
    switch (action.type) {
        case ACTIONS.REQUEST_PLAYLISTS:
            return Object.assign({}, state, {isFetching: true});
        case ACTIONS.SET_PLAYLISTS:
            return Object.assign({}, state, {isFetching: false, array: action.playlists});
        case ACTIONS.SELECT_PLAYLISTS:
            return Object.assign({}, state, {array: state.array.map((item, index) => {
                item.selected = action.selected[index];
                return item;
            })});
        case ACTIONS.CLEAR_PLAYLISTS:
            return {isFetching: false, array: null};
        default:
            return state;
    }
}

function genres(state={isFetching: false, array: null}, action) {
    switch (action.type) {
        case ACTIONS.REQUEST_GENRES:
            return Object.assign({}, state, {isFetching: true});
        case ACTIONS.SET_GENRES:
            return Object.assign({}, state, {isFetching: false, array: action.genres});
        case ACTIONS.SELECT_GENRES:
            return Object.assign({}, state, {array: state.array.map((item, index) => {
                item.selected = action.selected[index];
                return item;
            })});
        case ACTIONS.CLEAR_GENRES:
            return {isFetching: false, array: null};
        default:
            return state;
    }
}

function genreSeeds(state={isFetching: false, array: null}, action) {
    switch (action.type) {
        case ACTIONS.REQUEST_GENRE_SEEDS:
            return Object.assign({}, state, {isFetching: true});
        case ACTIONS.SET_GENRE_SEEDS:
            return Object.assign({}, state, {isFetching: false, array: action.genres});
        case ACTIONS.CLEAR_GENRE_SEEDS:
            return {isFetching: false, array: null};
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    accessToken,
    csrfToken,
    progress,
    error,
    profile,
    playlists,
    genres,
    genreSeeds,
});

export default rootReducer;