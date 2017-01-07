import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Root from './containers/Root';
import './index.css';

injectTapEventPlugin();

ReactDOM.render(
    <Root />,
    document.getElementById('root')
);


/**
 TODO
 1. Add saved tracks deduplicator and automatically relink any that are no longer available
 2. Add audio analysis to generate playlists from things like danceability
 3. Hide the fetch button
 4. Add toggle to create genre playlists for public/private playlists
 5. Fetch user names for playlists
 6. Clean up Are you sure??? dialog
 7. Handle playlist completed action - maybe redirect to spotify?
 8. Allow number of tracks for recommendations
 9. Remove tracks from unsorted playlist if they are in users other playlist
 10. show number of tracks found and stats and show what tracks have no genres and show number of genres per track
 11. Refresh token if old
 12. Remove fetch playlist button and just launch
 13. Fix redirecting if logged out and look into openning a new window
 **/