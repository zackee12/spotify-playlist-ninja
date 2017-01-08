import React from 'react';
import helpers from '../utils/helpers';
import FlexContainer from '../components/FlexContainer';
import TextFeature from '../components/TextFeature';
import Ninja from '../components/Ninja';
import RaisedButton from 'material-ui/RaisedButton';
import withWidth, {SMALL} from 'material-ui/utils/withWidth';

class Home extends React.Component {
    static contextTypes = {
        muiTheme: React.PropTypes.object
    };

    static propTypes = {
        refreshAccessTokenAndProfile: React.PropTypes.func.isRequired,
        login: React.PropTypes.func.isRequired,
        logout: React.PropTypes.func.isRequired,
    };

    componentWillMount() {
        this.props.refreshAccessTokenAndProfile()
            .catch((err) => {});
    }

    getStyles() {
        return {
            root: {},
            headerContainer: {
                backgroundColor: this.context.muiTheme.palette.darkestBackground,
                padding: this.context.muiTheme.spacing.desktopGutter * 2,
                minHeight: 250,
            },
            headerTitle: {
                fontSize: 56,
                margin: 0,
            },
            headerDescription: {
                fontSize: 18,
                marginTop: this.context.muiTheme.spacing.desktopGutter,
                marginBottom: this.context.muiTheme.spacing.desktopGutter,
                marginLeft: 0,
                marginRight: 0,
            },
            ninja: {
                fontSize: 24,
            },
            profile: {
                backgroundColor: this.context.muiTheme.palette.darkestBackground
            },
            features: {
                backgroundColor: this.context.muiTheme.palette.darkerBackground,
                paddingLeft: this.props.width === SMALL ? 0 : this.context.muiTheme.spacing.desktopGutter * 2,
                paddingRight: this.props.width === SMALL ? 0 : this.context.muiTheme.spacing.desktopGutter * 2,
                paddingTop: this.context.muiTheme.spacing.desktopGutter * 2,
                paddingBottom: this.context.muiTheme.spacing.desktopGutter * 2,
            },
            footer: {
                backgroundColor: this.context.muiTheme.palette.darkestBackground,
                padding: this.context.muiTheme.spacing.desktopGutter * 2,
            }
        };
    }

    render() {
        const profile = this.props.profile;
        const styles = this.getStyles();
        return (
            <div>
                <div style={styles.root}>
                    <FlexContainer flexAlignContent="center"
                                   flexAlignItems="center"
                                   flexDirection="column"
                                   flexJustifyContent="flex-end"
                                   flexWrap="wrap"
                                   style={styles.headerContainer}
                                   contentStyle={{minHeight: styles.headerContainer.minHeight}}>
                        <Ninja interval={200} enabled={true} style={styles.ninja}/>
                        <h1 style={styles.headerTitle}>Spotify Playlist Ninja</h1>
                        <p style={styles.headerDescription}>A set of tools to create and cleanup Spotify playlists</p>
                        {!this.props.hasAccessToken || profile.isFetching || !profile.object ?
                            (<RaisedButton label="Sign in to Spotify" primary={true} onClick={this.props.login} />) :
                            (<RaisedButton label="Sign out of Spotify" primary={true} onClick={this.props.logout} />)}

                    </FlexContainer>
                    <FlexContainer
                        flexAlignContent="center"
                        flexAlignItems="center"
                        flexDirection="row"
                        flexJustifyContent="space-around"
                        flexWrap="wrap"
                        style={styles.features}>
                        <TextFeature text="Remove duplicates from playlists" heading="Deduplicate" route="/deduplicate"/>
                        <TextFeature text="Sort playlists, saved music, and top tracks into genre playlists" heading="Genres" route="/genres"/>
                        <TextFeature text="Generate recommendation playlists based on tunable attributes" heading="Recommendations" route="/recommendations"/>
                    </FlexContainer>
                    <FlexContainer flexAlignContent="center"
                                   flexAlignItems="center"
                                   flexDirection="column"
                                   flexJustifyContent="flex-end"
                                   flexWrap="wrap"
                                   style={styles.footer}>
                        <p>This project is open-source. Check out the code.</p>
                        <a href="https://github.com/zackee12/spotify-playlist-ninja"><RaisedButton label="Github" /></a>
                    </FlexContainer>
                </div>

            </div>
        );
    }
}
/**
 * <Profile profile={profile.object} style={styles.profile}/>
 * @param state
 * @returns {{profile: *}}
 */
function mapStateToProps(state) {
    const { profile } = state;
    return {profile};
}

export default helpers.connectRedux(mapStateToProps, withWidth({mediumWidth: 400})(Home));