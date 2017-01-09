import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import configureStore from '../utils/configure-store';
import App from './App';
import AuthCallback from './AuthCallback';
import Home from './Home';
import Genres from './Genres';
import Recommendations from './Recommendations';
import Deduplicate from './Deduplicate';

const store = configureStore({
    accessToken: window.localStorage.getItem('accessToken'),
    csrfToken: window.localStorage.getItem('csrfToken'),
});

export default class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router history={hashHistory}>
                    <Route path="/" component={App}>
                        <IndexRoute component={Home}/>
                        <Route path="/genres" components={Genres}/>
                        <Route path="/deduplicate" components={Deduplicate}/>
                        <Route path="/recommendations" components={Recommendations}/>
                    </Route>
                </Router>
            </Provider>
        );
    }
}