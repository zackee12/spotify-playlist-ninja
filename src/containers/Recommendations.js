import React from 'react';
import helpers from '../utils/helpers';
import Actions from '../actions';
import FlexContainer from '../components/FlexContainer';
import RecommendationSeeds from '../components/RecommendationSeeds';
import TunableAttributes from '../components/TunableAttributes';
import TrackTable from '../components/TrackTable';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import DoneAll from 'material-ui/svg-icons/action/done-all';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class Recommendations extends React.Component {
    static contextTypes = {
        muiTheme: React.PropTypes.object
    };

    static propTypes = {
        refreshAccessTokenAndProfile: React.PropTypes.func.isRequired,
    };

    state = {
        trackSeeds: null,
        artistSeeds: null,
        genreSeeds: null,
        tunables: null,
        playlistSize: 30,
        playlistPublic: true,
        playlistName: 'Playlist Ninja Recommendations',
        showCreatePlaylistDialog: true,
        showCompletePlaylistDialog: false,
        playlistUri: null,
    };

    componentWillMount() {
        if (!this.props.hasAccessToken) {
            helpers.redirectTo('/');
        }
    }

    componentDidMount() {
        this.props.refreshAccessTokenAndProfile()
            .then(() => {
                return this.props.dispatch(Actions.fetchGenreSeedsIfNeeded());
            });
    }

    onGenreSeedsChange = (trackSeeds, artistSeeds, genreSeeds) => {
        this.setState({trackSeeds, artistSeeds, genreSeeds});
    };

    onTunablesChange = (tunables) => {
        this.setState({tunables});
    };

    onGetRecommendationsClick = () => {
        return this.props.dispatch(Actions.setProgress({percent: 50}))
            .then(() => this.props.dispatch(Actions.clearRecommendations()))
            .then(() => {
                this.setState({showCreatePlaylistDialog: true});
                return this.props.dispatch(Actions.fetchRecommendationsIfNeeded(
                    this.state.trackSeeds,
                    this.state.artistSeeds,
                    this.state.genreSeeds,
                    this.state.tunables,
                    this.state.playlistSize));
            })
            .then(() => this.props.dispatch(Actions.clearProgress()));
    };

    onPlaylistSliderChange = (event, newValue) => {
        this.setState({playlistSize: newValue});
    };

    onPlaylistPublicToggle = (event, isToggled) => {
        this.setState({playlistPublic: isToggled});
    };

    onPlaylistNameChange = (event, newValue) => {
        this.setState({playlistName: newValue});
    };

    onCreatePlaylistsDialogCancelClick = () => {
        this.setState({showCreatePlaylistDialog: false});
        this.props.dispatch(Actions.clearRecommendations());
    };

    onCreatePlaylistsDialogOkClick = () => {
        this.setState({showCreatePlaylistDialog:false});

        this.props.dispatch(Actions.createPlaylist(this.state.playlistName, this.props.recommendations.tracks, this.state.playlistPublic))
            .then((response) => {
                if (response.external_urls.spotify) {
                    this.setState({playlistUri: response.external_urls.spotify, showCompletePlaylistDialog: true});
                } else {
                    this.setState({playlistUri: null, showCompletePlaylistDialog: true});
                }
                return this.props.dispatch(Actions.clearRecommendations());
            })
            .catch((err) => {
                console.log('Recommendations ', err);
            });
    };

    onCompletePlaylistsDialogCloseClick = () => {
        this.setState({playlistUri: null, showCompletePlaylistDialog: false});
    };

    getStyles() {
        return {
            header: {
                backgroundColor: this.context.muiTheme.palette.darkestBackground
            },
            sliderOuter: {
                height: 200,
                marginLeft: this.context.muiTheme.spacing.desktopGutterMini,
                marginRight: this.context.muiTheme.spacing.desktopGutterMini,
            },
            sliderInner: {
                marginTop: 0,
                marginBottom: 0,
            },
            floatingBtn: {
                position: 'fixed',
                right: '20px',
                bottom: '20px',
                //zIndex: '999',
            },
            headerTitle: {
                color: this.context.muiTheme.palette.textColor,
            },
            headerDescription: {
                color: this.context.muiTheme.palette.secondaryTextColor,
            },
            settingsHeader: {
                width: 300,
            },
            settingsTitle: {
                color: this.context.muiTheme.palette.textColor,
            },
            settingsDescription: {
                color: this.context.muiTheme.palette.secondaryTextColor,
            },
            settingsPrivaryToggle: {
                width: 300,
                marginLeft: this.context.muiTheme.spacing.desktopGutter,
            },
            settingsPlaylistName: {
                width: 300,
                marginLeft: this.context.muiTheme.spacing.desktopGutter,
            },
            settingsSliderOuter: {
                width: 300,
                marginLeft: this.context.muiTheme.spacing.desktopGutter,
            },
            settingsSliderInner: {
                marginTop: 20,
                marginBottom: 20,
            },
            settingsSliderLabel: {
                marginLeft: this.context.muiTheme.spacing.desktopGutter,
            },
            dialogContent: {
                marginTop: this.context.muiTheme.spacing.desktopGutterMini,
            }
        };
    }

    render() {
        const styles = this.getStyles();
        const actions = [
            <FlatButton
                label="Cancel"
                onTouchTap={this.onCreatePlaylistsDialogCancelClick}
            />,
            <FlatButton
                label="Create playlist"
                primary={true}
                onTouchTap={this.onCreatePlaylistsDialogOkClick}
                keyboardFocused={true}
            />,
        ];
        let actions2 = [];
        if (this.state.playlistUri) {
            actions2.push(<a href={this.state.playlistUri} target="_blank"><FlatButton label="Open in new tab" onTouchTap={this.onCompletePlaylistsDialogCloseClick} /></a>);
        }
        actions2.push(<FlatButton label="Close" primary={true} onTouchTap={this.onCompletePlaylistsDialogCloseClick} keyboardFocused={true}/>);
        return (
            <div>
                <FlexContainer
                    flexAlignContent="center"
                    flexAlignItems="center"
                    flexDirection="column"
                    flexJustifyContent="center"
                    flexWrap="nowrap"
                    style={styles.header}>

                    <h1 style={styles.headerTitle}>Create Recommendation Playlists</h1>
                    <p style={styles.headerDescription}>Create playlists using tunable features and genre seeds</p>
                </FlexContainer>
                <FlexContainer
                    flexAlignContent="center"
                    flexAlignItems="center"
                    flexDirection="row"
                    flexJustifyContent="flex-start"
                    flexWrap="wrap">
                    <div style={styles.settingsHeader}>
                        <h3 style={styles.settingsTitle}>Playlist Settings</h3>
                        <p style={styles.settingsDescription}>Choose a name, privacy, and size</p>
                    </div>
                    <div>
                        <TextField
                            floatingLabelText="Playlist name"
                            value={this.state.playlistName}
                            style={styles.settingsPlaylistName}
                            onChange={this.onPlaylistNameChange}/>
                        <Toggle
                            label={this.state.playlistPublic ? 'Public': 'Private'}
                            style={styles.settingsPrivaryToggle}
                            labelPosition="right"
                            toggled={this.state.playlistPublic}
                            onToggle={this.onPlaylistPublicToggle}/>
                        <Slider
                            style={styles.settingsSliderOuter}
                            sliderStyle={styles.settingsSliderInner}
                            min={1} max={100} step={1}
                            value={this.state.playlistSize}
                            onChange={this.onPlaylistSliderChange}/>
                        {this.state.playlistSize === 1 ?
                            (<label style={styles.settingsSliderLabel}>{this.state.playlistSize} track</label>) :
                            (<label style={styles.settingsSliderLabel}>{this.state.playlistSize} tracks</label>)}

                    </div>
                </FlexContainer>
                {this.props.recommendations &&
                <Dialog title="Save playlist to library?" open={this.state.showCreatePlaylistDialog} autoScrollBodyContent={true} actions={actions} onRequestClose={this.onCreatePlaylistsDialogCancelClick}>
                    <TrackTable tracks={this.props.recommendations.tracks}/>
                </Dialog>
                }
                {this.props.genreSeeds &&
                <div>
                    <Divider />
                    <RecommendationSeeds genreSeeds={this.props.genreSeeds} onChange={this.onGenreSeedsChange}/>
                    <Divider />
                    <TunableAttributes onChange={this.onTunablesChange}/>
                    {!this.props.isFetching && this.state.playlistName.length > 0 &&
                    <FloatingActionButton
                        onClick={this.onGetRecommendationsClick}
                        style={styles.floatingBtn}>
                        <DoneAll />
                    </FloatingActionButton>
                    }
                </div>
                }
                <Dialog title="Operation complete" open={this.state.showCompletePlaylistDialog} actions={actions2} onRequestClose={this.onCompletePlaylistsDialogCloseClick}>
                    Playlist created successfully.
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { genreSeeds, recommendations } = state;
    return {genreSeeds: genreSeeds.array, recommendations: recommendations.object, isFetching: recommendations.isFetching};
}

export default helpers.connectRedux(mapStateToProps, Recommendations);