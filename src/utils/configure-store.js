import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';
import SpotifyApi from './spotify-api';

const spotifyApi = new SpotifyApi();

let middleware = [
    thunk.withExtraArgument(spotifyApi),
];

if (window.location.host === 'localhost:3000') {
    middleware.push(createLogger());
}

export default function configureStore(preloadedState) {
    spotifyApi.accessToken = preloadedState.accessToken;
    spotifyApi.limiter.minElapsedTime = 100;

    return createStore(
        rootReducer,
        preloadedState,
        applyMiddleware(...middleware)
    );
}