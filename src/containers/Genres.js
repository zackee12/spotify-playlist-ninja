import React from 'react';
import helpers from '../utils/helpers';
import Actions from '../actions';
import RaisedButton from 'material-ui/RaisedButton';
import FlexContainer from '../components/FlexContainer';
import Playlists from '../components/Playlists';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import DoneAll from 'material-ui/svg-icons/action/done-all';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';


const STEP_LOAD_PLAYLISTS = 0;
const STEP_SELECT_PLAYLISTS = 1;
const STEP_LOAD_GENRES = 2;
const STEP_SELECT_GENRES = 3;
const STEP_CREATE_PLAYLISTS = 4;
const STEP_DONE = 5;

class Genres extends React.Component {
    static contextTypes = {
        muiTheme: React.PropTypes.object
    };

    static propTypes = {
        refreshAccessTokenAndProfile: React.PropTypes.func.isRequired,
    };

    state = {
        step: STEP_LOAD_PLAYLISTS,
        checkedPlaylists: null,
        checkedGenres: null,
        showCreatePlaylistDialog: false,
        showCompletePlaylistDialog: false,
    };

    componentWillMount() {
        if (!this.props.hasAccessToken) {
            helpers.redirectTo('/');
        }
    }

    componentDidMount() {
        this.fetchPlaylists();
    }

    fetchPlaylists = () => {
        this.setState({step: STEP_LOAD_PLAYLISTS}, () => {
            return this.props.refreshAccessTokenAndProfile()
                .catch((err) => {
                    helpers.redirectTo('/');
                    return Promise.reject(err);
                })
                .then(() => {
                    return this.props.dispatch(Actions.clearPlaylists());
                })
                .then(() => {
                    return this.props.dispatch(Actions.fetchPlaylistsIfNeeded());
                })
                .then(() => {
                    this.setState({
                        checkedPlaylists: new Array(this.props.playlists.length).fill(true),
                        step: STEP_SELECT_PLAYLISTS,
                        showCreatePlaylistDialog: false,
                        showCompletePlaylistDialog: false,});
                });
        });
    };

    onSourcePlaylistItemChecked = (checkedPlaylists) => {
        this.setState({checkedPlaylists});
    };

    onGenrePlaylistItemChecked = (checkedGenres) => {
        this.setState({checkedGenres})
    };

    onSelectSourcePlaylistDoneBtnClick = () => {
        if (this.getCheckedPlaylistCount() > 0) {
            this.props.dispatch(Actions.selectPlaylists(this.state.checkedPlaylists))
                .then(() => {
                    this.setState({step: STEP_LOAD_GENRES});
                    return this.props.dispatch(Actions.fetchGenresIfNeeded());
                })
                .then(() => {
                    this.setState({step: STEP_SELECT_GENRES, checkedGenres: new Array(this.props.genres.length).fill(false)});
                });
        }
    };

    onCreatePlaylistsDialogCancelClick = () => {
        this.setState({showCreatePlaylistDialog: false});
    };

    onCreatePlaylistsDialogOkClick = () => {
        this.props.dispatch(Actions.selectGenres(this.state.checkedGenres))
            .then(() => {
                this.setState({step: STEP_CREATE_PLAYLISTS});
                return this.props.dispatch(Actions.createGenrePlaylists());
            })
            .then(() => {
                this.setState({step: STEP_DONE, showCompletePlaylistDialog: true});
            })
            .catch((err) => {
                console.log('Genres ', err);
            });
    };

    onSelectGenrePlaylistsDoneBtnClick = () => {
        if (this.getCheckedGenreCount() > 0) {
            this.setState({showCreatePlaylistDialog: true});
        }
    };

    onCompletePlaylistsDialogCloseClick = () => {
        this.setState({showCompletePlaylistDialog: false});
    };

    getCheckedGenreCount() {
        return this.state.checkedGenres.reduce((prev, value) => {
            return value ? prev + 1 : prev;
        }, 0);
    }

    getCheckedPlaylistCount() {
        return this.state.checkedPlaylists.reduce((prev, value) => {
            return value ? prev + 1 : prev;
        }, 0);
    }

    getStyles() {
        return {
            root: {},
            header: {
                backgroundColor: this.context.muiTheme.palette.darkestBackground
            },
            message: {
                backgroundColor: this.context.muiTheme.palette.darkBackground
            },
            messageText: {
                margin: 0,
            },
            workspace: {
                //backgroundColor: '#333'
            },
            floatingBtn: {
                position: 'fixed',
                right: '20px',
                bottom: '20px',
                //zIndex: '999',
            },
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
                label="Create playlists"
                primary={true}
                onTouchTap={this.onCreatePlaylistsDialogOkClick}
            />,
        ];
        const actions2 = [
            <FlatButton
                label="Close"
                primary={true}
                onTouchTap={this.onCompletePlaylistsDialogCloseClick}
                keyboardFocused={true}/>
        ];
        let userDisplayNames;
        if (this.props.profile && this.props.profile.id) {
            userDisplayNames = {
                [this.props.profile.id]: this.props.profile.display_name
            };
        } else {
            userDisplayNames = {};
        }
        return (
            <div style={styles.root}>
                <FlexContainer
                    flexAlignContent="center"
                    flexAlignItems="center"
                    flexDirection="column"
                    flexJustifyContent="center"
                    flexWrap="nowrap"
                    style={styles.header}>

                    <h1>Create Genre Playlists</h1>
                    <p>Create playlists organized by genre from your playlists, saved tracks, and top tracks</p>
                    {this.state.step === STEP_DONE &&
                    <RaisedButton onClick={this.fetchPlaylists} label="Start Over" primary={true}/>
                    }
                </FlexContainer>
                <FlexContainer
                    flexAlignContent="center"
                    flexAlignItems="center"
                    flexDirection="column"
                    flexJustifyContent="center"
                    flexWrap="nowrap"
                    style={styles.message}>

                    {this.props.progress.message &&
                    <h3 style={styles.messageText}>{this.props.progress.message}</h3>
                    }
                    {this.state.step === STEP_SELECT_PLAYLISTS &&
                    <h3 style={styles.messageText}>Select source playlists</h3>
                    }
                    {this.state.step === STEP_SELECT_GENRES &&
                    <h3 style={styles.messageText}>Select genre playlists to save</h3>
                    }
                </FlexContainer>
                {this.state.step === STEP_SELECT_PLAYLISTS &&
                    <FlexContainer
                        flexAlignContent="center"
                        flexAlignItems="center"
                        flexDirection="column"
                        flexJustifyContent="center"
                        flexWrap="nowrap"
                        style={styles.workspace}>
                        <Playlists
                            initialCheckedState={this.state.checkedPlaylists}
                            showNumTracks={false}
                            playlists={this.props.playlists}
                            onItemChecked={this.onSourcePlaylistItemChecked}
                            userDisplayNames={userDisplayNames}/>

                        <FloatingActionButton
                            onClick={this.onSelectSourcePlaylistDoneBtnClick}
                            style={styles.floatingBtn}>
                            <DoneAll />
                        </FloatingActionButton>
                    </FlexContainer>
                }
                {this.state.step === STEP_SELECT_GENRES &&
                    <FlexContainer
                        flexAlignContent="center"
                        flexAlignItems="center"
                        flexDirection="column"
                        flexJustifyContent="center"
                        flexWrap="nowrap"
                        style={styles.workspace}>

                        <Playlists
                            initialCheckedState={this.state.checkedGenres}
                            showNumTracks={true}
                            playlists={this.props.genres}
                            onItemChecked={this.onGenrePlaylistItemChecked}/>

                        <FloatingActionButton
                            onClick={this.onSelectGenrePlaylistsDoneBtnClick}
                            style={styles.floatingBtn}>
                            <DoneAll />
                        </FloatingActionButton>
                        <Dialog
                            open={this.state.showCreatePlaylistDialog}
                            title="Create playlists"
                            actions={actions}>
                            Do you want to create {this.getCheckedGenreCount()} playlists?
                        </Dialog>

                    </FlexContainer>
                }
                <Dialog title="Operation complete" open={this.state.showCompletePlaylistDialog} actions={actions2} onRequestClose={this.onCompletePlaylistsDialogCloseClick}>
                    Playlist created successfully.
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { progress, playlists, genres, profile } = state;
    return {progress, playlists: playlists.array, genres: genres.array, profile: profile.object};
}

export default helpers.connectRedux(mapStateToProps, Genres);