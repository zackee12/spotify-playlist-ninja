import React from 'react';
import helpers from '../utils/helpers';

class Deduplicate extends React.Component {
    static contextTypes = {
        muiTheme: React.PropTypes.object
    };

    componentWillMount() {
        if (!this.props.hasAccessToken) {
            helpers.redirectTo('/');
        }
    }

    componentDidMount() {
        this.props.refreshAccessTokenAndProfile()
            .catch((err) => {
                helpers.redirectTo('/');
            });
    }

    getStyles() {
        return {
            root: {
                color: this.context.muiTheme.palette.textColor,
                padding: this.context.muiTheme.spacing.desktopGutter,
            }
        };
    }

    render() {
        const styles = this.getStyles();
        return (
            <div style={styles.root}>
                <h3>Deduplication coming soon...</h3>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { profile } = state;
    return {profile};
}

export default helpers.connectRedux(mapStateToProps, Deduplicate);