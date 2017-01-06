import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

class Deduplicate extends React.Component {

    static propTypes = {
        isLoggedIn: React.PropTypes.func.isRequired,
    };

    componentWillMount() {
        if (!this.props.isLoggedIn()) {
            hashHistory.push('/');
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

export default connect(mapStateToProps)(Deduplicate)