import React from 'react';
import {Link} from 'react-router';
import Paper from 'material-ui/Paper';
import transitions from 'material-ui/styles/transitions';
import typography from 'material-ui/styles/typography';

export default class Feature extends React.Component {
    static contextTypes = {
        muiTheme: React.PropTypes.object
    };

    static propTypes = {
        heading: React.PropTypes.string,
        image: React.PropTypes.string,
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
                maxWidth: '300px',
                transition: transitions.easeOut(),
            },
            heading: {
                color: this.context.muiTheme.palette.textColor,
                backgroundColor: this.context.muiTheme.palette.primary1Color,
                padding: this.context.muiTheme.spacing.desktopGutter,
                margin: 0,
                textAlign: 'center',
                fontWeight: typography.fontWeightMedium,
            },
            image: {
                width: '100%',
                display: 'block'
            },
            link: {
                textDecoration: 'none',
            },
        };
    }

    render() {
        const styles = this.getStyles();
        const { route, image, heading } = this.props;
        return (
            <Paper
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                zDepth={this.state.zDepth}
                style={styles.root}>
                <Link to={route} style={styles.link}>
                    <h3 style={styles.heading}>{heading}</h3>
                    <img style={styles.image} src={image} alt={heading} />
                </Link>
            </Paper>
        );
    }
}