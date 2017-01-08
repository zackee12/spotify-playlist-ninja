import React from 'react';
import {Link} from 'react-router';
import Paper from 'material-ui/Paper';
import transitions from 'material-ui/styles/transitions';
import typography from 'material-ui/styles/typography';
import withWidth, {SMALL} from 'material-ui/utils/withWidth';

class TextFeature extends React.Component {
    static contextTypes = {
        muiTheme: React.PropTypes.object
    };

    static propTypes = {
        heading: React.PropTypes.string,
        text: React.PropTypes.string,
        route: React.PropTypes.string,
    };

    state = {
        zDepth: 0
    };

    onMouseEnter = () => {
        this.setState({zDepth: 4});
    };

    onMouseLeave = () => {
        this.setState({zDepth: 0});
    };

    getStyles() {
        return {
            root: {
                //minWidth: this.props.width === SMALL ? window.innerWidth : 300,
                width: this.props.width === SMALL ? '100%' : 300,
                backgroundColor: this.context.muiTheme.palette.darkBackground,
                transition: transitions.easeOut(),
                marginTop: this.context.muiTheme.spacing.desktopGutterMini,
                marginBottom: this.context.muiTheme.spacing.desktopGutterMini,
                marginLeft: this.props.width === SMALL ? 0 : this.context.muiTheme.spacing.desktopGutterMini,
                marginRight: this.props.width === SMALL ? 0 : this.context.muiTheme.spacing.desktopGutterMini,
            },
            heading: {
                color: this.context.muiTheme.palette.textColor,
                backgroundColor: this.context.muiTheme.palette.darkBackgroundAlternate2,
                padding: this.context.muiTheme.spacing.desktopGutter,
                margin: 0,
                textAlign: 'center',
                fontWeight: typography.fontWeightMedium,
            },
            text: {
                width: '100%',
                display: 'block',
                margin: 0,
                padding: 20,
                color: this.context.muiTheme.palette.textColor,
                minHeight: 100,
            },
            link: {
                textDecoration: 'none',
            },
        };
    }

    render() {
        const styles = this.getStyles();
        const { route, text, heading } = this.props;
        return (
            <Paper
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                zDepth={this.state.zDepth}
                style={styles.root}>
                <Link to={route} style={styles.link}>
                    <h3 style={styles.heading}>{heading}</h3>
                    <p style={styles.text}>{text}</p>
                </Link>
            </Paper>
        );
    }
}

export default withWidth({mediumWidth: 400})(TextFeature);