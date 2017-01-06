import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
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
        hashHistory.push('/');
    }

    render() {
        return <div>Auth callback</div>;
    }
}

function mapStateToProps(state) {
    const { csrfToken } = state;
    return {csrfToken};
}

export default connect(mapStateToProps)(AuthCallback)