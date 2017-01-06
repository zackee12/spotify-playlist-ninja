import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import Actions from '../actions';
import FlexContainer from '../components/FlexContainer';
import Slider from 'material-ui/Slider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

class Recommendations extends React.Component {
    static contextTypes = {
        muiTheme: React.PropTypes.object
    };

    static propTypes = {
        isLoggedIn: React.PropTypes.func.isRequired,
    };

    componentWillMount() {
        if (!this.props.isLoggedIn()) {
            hashHistory.push('/');
        }
        this.props.dispatch(Actions.fetchGenreSeedsIfNeeded());
    }

    getStyles() {
        return {
            header: {
                backgroundColor: '#111'
            },
            feature1: {
                backgroundColor: '#222',
            },
            feature2: {
                backgroundColor: '#333',
            },
            sliderOuter: {
                height: 300,
                marginLeft: this.context.muiTheme.spacing.desktopGutter,
                marginRight: this.context.muiTheme.spacing.desktopGutter,
            },
            sliderInner: {
                marginTop: 0,
                marginBottom: 0,
            }
        };
    }

    render() {
        const styles = this.getStyles();
        return (
            <div>
                <FlexContainer
                    flexAlignContent="center"
                    flexAlignItems="center"
                    flexDirection="column"
                    flexJustifyContent="center"
                    flexWrap="nowrap"
                    style={styles.header}>

                    <h1>Create Recommendation Playlists</h1>
                    <p>Create playlists using tunable features and genre seeds</p>
                </FlexContainer>
                <FlexContainer
                    flexAlignContent="center"
                    flexAlignItems="center"
                    flexDirection="row"
                    flexJustifyContent="center"
                    flexWrap="wrap"
                    style={styles.feature1}>
                    <div>
                        <h3>Playlist Seeds</h3>
                        <p>Choose up to 5 total seeds from genres, tracks, and artists</p>
                    </div>
                    <FlexContainer
                        flexAlignContent="center"
                        flexAlignItems="center"
                        flexDirection="column"
                        flexJustifyContent="center"
                        flexWrap="nowrap" style={styles.feature1}>
                        <SelectField
                            floatingLabelText="Genre Seed #1">
                            <MenuItem value={-1} primaryText="None" />
                            {this.props.genreSeeds && this.props.genreSeeds.map((genre, index) => <MenuItem value={index} primaryText={genre} />)}
                        </SelectField>
                        <SelectField
                            floatingLabelText="Genre Seed #2">
                            <MenuItem value={-1} primaryText="None" />
                            {this.props.genreSeeds && this.props.genreSeeds.map((genre, index) => <MenuItem value={index} primaryText={genre} />)}
                        </SelectField>
                        <SelectField
                            floatingLabelText="Genre Seed #3">
                            <MenuItem value={-1} primaryText="None" />
                            {this.props.genreSeeds && this.props.genreSeeds.map((genre, index) => <MenuItem value={index} primaryText={genre} />)}
                        </SelectField>
                        <SelectField
                            floatingLabelText="Genre Seed #4">
                            <MenuItem value={-1} primaryText="None" />
                            {this.props.genreSeeds && this.props.genreSeeds.map((genre, index) => <MenuItem value={index} primaryText={genre} />)}
                        </SelectField>
                        <SelectField
                            floatingLabelText="Genre Seed #5">
                            <MenuItem value={-1} primaryText="None" />
                            {this.props.genreSeeds && this.props.genreSeeds.map((genre, index) => <MenuItem value={index} primaryText={genre} />)}
                        </SelectField>
                    </FlexContainer>
                    <FlexContainer
                        flexAlignContent="center"
                        flexAlignItems="center"
                        flexDirection="column"
                        flexJustifyContent="center"
                        flexWrap="nowrap" style={styles.feature1}>
                        <TextField floatingLabelText="Track Id #1"/>
                        <TextField floatingLabelText="Track Id #2"/>
                        <TextField floatingLabelText="Track Id #3"/>
                        <TextField floatingLabelText="Track Id #4"/>
                        <TextField floatingLabelText="Track Id #5"/>
                    </FlexContainer>
                    <FlexContainer
                        flexAlignContent="center"
                        flexAlignItems="center"
                        flexDirection="column"
                        flexJustifyContent="center"
                        flexWrap="nowrap" style={styles.feature1}>
                        <TextField floatingLabelText="Artist Id #1"/>
                        <TextField floatingLabelText="Artist Id #2"/>
                        <TextField floatingLabelText="Artist Id #3"/>
                        <TextField floatingLabelText="Artist Id #4"/>
                        <TextField floatingLabelText="Artist Id #5"/>
                    </FlexContainer>
                </FlexContainer>
                <FlexContainer
                    flexAlignContent="center"
                    flexAlignItems="center"
                    flexDirection="row"
                    flexJustifyContent="center"
                    flexWrap="wrap"
                    style={styles.feature2}>
                    <div>
                        <h3>acousticness</h3>
                        <p>A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.</p>
                    </div>
                    <FlexContainer
                        flexAlignContent="center"
                        flexAlignItems="center"
                        flexDirection="row"
                        flexJustifyContent="center"
                        flexWrap="wrap" style={styles.feature2}>
                        <Slider style={styles.sliderOuter} sliderStyle={styles.sliderInner} axis="y" defaultValue={0.5} />
                        <Slider style={styles.sliderOuter} sliderStyle={styles.sliderInner} axis="y" defaultValue={0.5} />
                        <Slider style={styles.sliderOuter} sliderStyle={styles.sliderInner} axis="y" defaultValue={0.5} />
                    </FlexContainer>
                </FlexContainer>
                <FlexContainer
                    flexAlignContent="center"
                    flexAlignItems="center"
                    flexDirection="row"
                    flexJustifyContent="center"
                    flexWrap="wrap">
                    <Slider style={styles.sliderOuter} sliderStyle={styles.sliderInner} axis="y" defaultValue={0.5} />
                    <Slider style={styles.sliderOuter} sliderStyle={styles.sliderInner} axis="y" defaultValue={0.5} />
                    <Slider style={styles.sliderOuter} sliderStyle={styles.sliderInner} axis="y" defaultValue={0.5} />
                </FlexContainer>
                <FlexContainer
                    flexAlignContent="center"
                    flexAlignItems="center"
                    flexDirection="row"
                    flexJustifyContent="center"
                    flexWrap="wrap">
                    <Slider style={styles.sliderOuter} sliderStyle={styles.sliderInner} axis="y" defaultValue={0.5} />
                    <Slider style={styles.sliderOuter} sliderStyle={styles.sliderInner} axis="y" defaultValue={0.5} />
                    <Slider style={styles.sliderOuter} sliderStyle={styles.sliderInner} axis="y" defaultValue={0.5} />
                </FlexContainer>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { genreSeeds } = state;
    return {genreSeeds: genreSeeds.array};
}

export default connect(mapStateToProps)(Recommendations)