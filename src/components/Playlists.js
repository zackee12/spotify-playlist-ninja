import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import CheckboxPartial from 'material-ui/svg-icons/toggle/indeterminate-check-box';
import CheckboxCheck from 'material-ui/svg-icons/toggle/check-box';
import CheckboxBlank from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import {observer} from 'mobx-react';

const PlaylistItem = observer(class PlaylistItem extends React.Component {
    static propTypes = {
        playlist: React.PropTypes.object.isRequired,
        checked: React.PropTypes.bool.isRequired,
        onItemChecked: React.PropTypes.func.isRequired,
        showNumTracks: React.PropTypes.bool,
        style: React.PropTypes.object,
    };

    render() {
        const playlist = this.props.playlist;
        let image = playlist.images && playlist.images.length > 0 ? playlist.images[playlist.images.length-1].url : null;
        let owner = playlist.owner && playlist.owner.id ? playlist.owner.id : 'spotify';
        let numTracks = playlist.tracks && playlist.tracks.total ? playlist.tracks.total : '???';
        return <ListItem
            leftCheckbox={<Checkbox checked={this.props.checked} onCheck={this.props.onItemChecked}/>}
            primaryText={playlist.name}
            secondaryText={this.props.showNumTracks ? `with ${numTracks} tracks` : `by ${owner}`}
            rightAvatar={<Avatar src={image} />}
            key={playlist.id}
            style={this.props.style}/>;
    }
});

export default class Playlists extends React.Component {
    static contextTypes = {
        muiTheme: React.PropTypes.object
    };

    static propTypes = {
        playlists: React.PropTypes.array.isRequired,
        onItemChecked: React.PropTypes.func.isRequired,
        showNumTracks: React.PropTypes.bool,
        initialCheckedState: React.PropTypes.array,
    };

    state = {
        checked: null
    };

    componentWillMount() {
        this.onCheckedFns = [];
        this.props.playlists.forEach((playlist, index) => {
            this.onCheckedFns.push(this.onListItemSelected(index));
        });
        this.setState({checked: this.props.initialCheckedState ? [...this.props.initialCheckedState] : new Array(this.props.playlists.length).fill(false),})
    }

    getCheckedStatus() {
        const numChecked = this.state.checked.reduce((prev, value) => {
            return value ? prev + 1 : prev;
        }, 0);

        return {numChecked, allChecked: numChecked === this.state.checked.length, noneChecked: numChecked === 0};
    }

    uncheckAll = () => {
        this.onListItemSelected('none')(null, false);
    };

    checkAll = () => {
        this.onListItemSelected('all')(null, true);
    };

    getCheckbox(checkStatus) {
        if (checkStatus.allChecked) {
            return <Checkbox
                checkedIcon={<CheckboxCheck/>}
                uncheckedIcon={<CheckboxBlank/>}
                checked={true}
                onCheck={this.uncheckAll} />;
        } else if (checkStatus.noneChecked) {
            return <Checkbox
                checkedIcon={<CheckboxCheck/>}
                uncheckedIcon={<CheckboxBlank/>}
                checked={false}
                onCheck={this.checkAll} />;
        } else {
            return <Checkbox
                checkedIcon={<CheckboxCheck/>}
                uncheckedIcon={<CheckboxPartial/>}
                checked={false}
                onCheck={this.checkAll} />;
        }
    }

    onListItemSelected(index) {
        return (event, isInputChecked) => {
            this.setState((state, props) => {
                let checked;
                if (index === 'all') {
                    checked = new Array(this.props.playlists.length).fill(true);
                } else if (index === 'none') {
                    checked = new Array(this.props.playlists.length).fill(false);
                } else {
                    checked = [...state.checked];
                    checked[index] = isInputChecked;
                }
                props.onItemChecked([...checked], index, isInputChecked);
                return {checked};
            });
        };
    }

    getStyles() {
        return {
            root: {

            },
        };
    }

    render() {
        const styles = this.getStyles();
        const checkStatus = this.getCheckedStatus();
        const checkbox = this.getCheckbox(checkStatus);
        return (
            <List style={styles.root}>
                {checkStatus.numChecked === 1 ? <Subheader>{checkStatus.numChecked} Playlist Selected</Subheader> : <Subheader>{checkStatus.numChecked} Playlists Selected</Subheader>}

                <ListItem leftCheckbox={checkbox}
                          primaryText=" "
                          secondaryText=" "/>
                {this.props.playlists.map((playlist, index) => {
                    return <PlaylistItem
                        key={playlist.id}
                        playlist={playlist}
                        checked={this.state.checked[index]}
                        onItemChecked={this.onCheckedFns[index]}
                        showNumTracks={this.props.showNumTracks}/>;
                })
                }
            </List>
        );
    }
}
