import React from 'react'
import helpers from '../utils/helpers';
import Actions from '../actions'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkTheme from '../utils/dark-theme';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import Dialog from 'material-ui/Dialog';
import Drawer from 'material-ui/Drawer';
import SpotifyApi from '../utils/spotify-api';
import Ninja from '../components/Ninja';
import packageJSON from '../../package.json';
import Profile from '../components/Profile';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import IconButton from 'material-ui/IconButton';
const muiTheme = getMuiTheme(darkTheme);

class App extends React.Component {

    state = {
        drawerOpen: false,
    };

    refreshAccessTokenAndProfile = () => {
        const csrfToken = SpotifyApi.generateCsrfToken();
        return this.props.dispatch(Actions.setCsrfToken(csrfToken))
            .then(() => {
                return SpotifyApi.refreshAccessToken(csrfToken);
            })
            .then((data) => {
                if (data.state !== csrfToken) {
                    return Promise.reject(new Error(`Spotify CSRF token does not match`));
                }
                return this.props.dispatch(Actions.setAccessToken(data.access_token));
            })
            .then(() => {
                return this.props.dispatch(Actions.fetchProfileIfNeeded());
            })
            .catch((err) => {
                return this.props.dispatch(Actions.clearTokens())
                    .then(() => Promise.reject(err));
            });
    };

    onLoginClick = () => {
        const csrfToken = SpotifyApi.generateCsrfToken();
        this.props.dispatch(Actions.setCsrfToken(csrfToken))
            .then(() => {
                return SpotifyApi.login(csrfToken);
            })
            .then((data) => {
                if (data.state !== csrfToken) {
                    return Promise.reject(new Error(`Spotify CSRF token does not match`));
                }
                return this.props.dispatch(Actions.setAccessToken(data.access_token));
            })
            .then(() => {
                return this.props.dispatch(Actions.fetchProfileIfNeeded());
            });
    };

    onLogoutClick = () => {
        this.props.dispatch(Actions.clearTokens())
            .then(() => this.props.dispatch(Actions.clearProfile()))
            .then(() => {
                if (this.props.location.pathname !== '/') {
                    helpers.redirectTo('/');
                }
            });
    };

    onTitleTouchTap = () => {
        helpers.redirectTo('/');
    };

    onDrawerToggleClick = () => {
        this.setState((state) => {
            return {drawerOpen: !state.drawerOpen};
        });
    };

    onDrawerRequestChange = (open, reason) => {
        this.setState({drawerOpen: open});
    };

    onErrorDialogClick = () => {
        this.props.dispatch(Actions.clearError());
    };

    getStyles() {
        // appbar height + linearprogress height
        let appBarHeight = muiTheme.appBar.height + 4;

        return {

            appbarTitle: {
                cursor: 'pointer'
            },
            childContainer: {
                backgroundColor: muiTheme.palette.darkestBackground,
                height: `calc(100vh - ${appBarHeight}px)`,
                width: '100vw',
                margin: `${appBarHeight}px 0 0 0`,
                padding: 0,
                overflow: 'auto',
            },
            navContainer: {
                position: 'fixed',
                top: 0,
                width: '100vw',
            },
            parentContainer: {
                height: '100vh',
                width: '100vw',
                overflow: 'hidden',
                margin: '0',
                padding: '0'
            },
            ninja: {
                lineHeight: 'initial',
                fontSize: '12px',
                display: 'inline-block',
                padding: 0,
                marginLeft: muiTheme.spacing.desktopGutter,
                marginRight: muiTheme.spacing.desktopGutter,
                flexGrow: 1,
                flexShrink: 1,
                flexBasis: 0,
                order: 2,
                alignSelf: 'center',
            },
            title: {
                flexGrow: 1,
                flexShrink: 1,
                flexBasis: 0,
                order: 1,
            },
            drawer: {
                padding: muiTheme.spacing.desktopGutter,
            },
            drawerIconButton: {
                top: -16,
                left: -16,
            }

        };
    }

    render() {
        const { profile, progress, error } = this.props;
        const styles = this.getStyles();
        const actions = [
            <FlatButton
                label="Close"
                secondary={true}
                onTouchTap={this.onErrorDialogClick}
            />,
        ];
        const title = (
            <span style={styles.appbarTitle}>Playlist Ninja <small>v{packageJSON.version}</small></span>

        );

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={styles.parentContainer}>
                    <div style={styles.navContainer}>
                        <AppBar
                            title={title}
                            onTitleTouchTap={this.onTitleTouchTap}
                            onLeftIconButtonTouchTap={this.onDrawerToggleClick}
                            titleStyle={styles.title}
                        ><Ninja interval={200} enabled={progress.percent !== 100.0} style={styles.ninja}/></AppBar>
                        <LinearProgress mode="determinate" value={progress.percent}/>
                    </div>
                    <div style={styles.childContainer}>
                        {React.cloneElement(this.props.children, {refreshAccessTokenAndProfile: this.refreshAccessTokenAndProfile,
                                                                  login: this.onLoginClick, logout: this.onLogoutClick})}
                    </div>
                    {error &&
                    <Dialog
                        title={error.name}
                        actions={actions}
                        modal={true}
                        open={true}>
                        {error.message}
                    </Dialog>}
                    <Drawer
                        docked={false}
                        width={300}
                        open={this.state.drawerOpen}
                        onRequestChange={this.onDrawerRequestChange}
                    >
                        <div style={styles.drawer}>
                        <IconButton onTouchTap={this.onDrawerToggleClick} style={styles.drawerIconButton}>
                            <NavigationMenu />
                        </IconButton>
                        {profile &&
                            <div>
                                <Profile profile={profile}/>
                                <RaisedButton label="Logout" onClick={this.onLogoutClick} />
                            </div>
                        }
                        {!profile &&
                            <div>
                                <Profile profile={{}}/>
                                <RaisedButton label="Login" onClick={this.onLoginClick} />
                            </div>
                        }
                        </div>
                    </Drawer>
                </div>
            </MuiThemeProvider>
        );
    }
}


function mapStateToProps(state) {
    const { accessToken, profile, progress, error } = state;
    return {accessToken, profile: profile.object, progress, error};
}

export default helpers.connectRedux(mapStateToProps, App);