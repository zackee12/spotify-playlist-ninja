import React from 'react';
import helpers from '../utils/helpers';

class Deduplicate extends React.Component {

    componentWillMount() {
        if (!this.props.hasAccessToken) {
            helpers.redirectTo('/');
        }
    }

    render() {
        return (
            <div>
                <h1>Dedup</h1>

            </div>
        );
    }
}

function mapStateToProps(state) {
    const { profile } = state;
    return {profile};
}

export default helpers.connectRedux(mapStateToProps, Deduplicate);