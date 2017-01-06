import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';
import SpotifyApi from './spotify-api';

const loggerMiddleware = createLogger();
const spotifyApi = new SpotifyApi();

export default function configureStore(preloadedState) {
    spotifyApi.accessToken = preloadedState.accessToken;
    spotifyApi.limiter.minElapsedTime = 100;

    return createStore(
        rootReducer,
        preloadedState,
        applyMiddleware(
            thunkMiddleware.withExtraArgument(spotifyApi),
            loggerMiddleware
        )
    );
}