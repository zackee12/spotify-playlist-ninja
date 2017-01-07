import React from 'react';
import helpers from '../utils/helpers';
import Actions from '../actions';

class AuthCallback extends React.Component {
    componentWillMount() {
        const {dispatch, params, csrfToken} = this.props;
        if (csrfToken && params.csrfToken && csrfToken === params.csrfToken) {
            dispatch(Actions.setAccessToken(params.accessToken));
        } else {
            dispatch(Actions.clearAccessToken());
            dispatch(Actions.clearCsrfToken());
        }
        helpers.redirectTo('/');
    }

    render() {
        return <div>Auth callback</div>;
    }
}

function mapStateToProps(state) {
    const { csrfToken } = state;
    return {csrfToken};
}

export default helpers.connectRedux(mapStateToProps, AuthCallback);