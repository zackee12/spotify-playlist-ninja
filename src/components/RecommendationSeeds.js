import React from 'react';
import FlexContainer from './FlexContainer';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

const SEED_TYPE_GENRE = 0;
const SEED_TYPE_TRACK = 1;
const SEED_TYPE_ARTIST = 2;

export default class RecommendationSeeds extends React.Component {

    static contextTypes = {
        muiTheme: React.PropTypes.object
    };

    static propTypes = {
        style: React.PropTypes.object,
        genreSeeds: React.PropTypes.array.isRequired,
        onChange: React.PropTypes.func.isRequired,
    };

    state = {
        seeds: [{type: SEED_TYPE_GENRE, value: 0}]
    };

    componentDidMount() {
        this.broadcast(this.state.seeds);
    }

    broadcast = (seeds) => {
        const trackSeeds = seeds.filter((seed) => seed.type === SEED_TYPE_TRACK).map((seed) => seed.value);
        const artistSeeds = seeds.filter((seed) => seed.type === SEED_TYPE_ARTIST).map((seed) => seed.value);
        const genreSeeds = seeds.filter((seed) => seed.type === SEED_TYPE_GENRE).map((seed) => this.props.genreSeeds[seed.value]);
        this.props.onChange(trackSeeds, artistSeeds, genreSeeds);
    };

    onAddSeedBtnClick = () => {
        this.setState((state) => {
            let seeds = [...state.seeds];
            if (seeds.length > 0) {
                let lastSeed = seeds[seeds.length-1];
                seeds.push({type: lastSeed.type, value: lastSeed.value});
            } else {
                seeds.push({type: SEED_TYPE_GENRE, value: 0});
            }
            this.broadcast(seeds);
            return {seeds};
        });
    };

    onRemoveSeedBtnClick = () => {
        this.setState((state) => {
            let seeds = [...state.seeds];
            seeds.pop();
            this.broadcast(seeds);
            return {seeds};
        });
    };

    onChangeSelectSeedType = (index) => (event, key, payload) => {
        this.setState((state) => {
            let seeds = [...state.seeds];
            if (payload === SEED_TYPE_GENRE) {
                seeds[index].value = 0;
            } else {
                seeds[index].value = '';
            }
            seeds[index].type = payload;
            this.broadcast(seeds);
            return {seeds};
        });
    };

    onChangeSelectGenre = (index) => (event, key, payload) => {
        this.setState((state) => {
            let seeds = [...state.seeds];
            seeds[index].value = payload;
            this.broadcast(seeds);
            return {seeds};
        });
    };

    onChangeArtistOrTrackId = (index) => (event, newValue) => {
        this.setState((state) => {
            let seeds = [...state.seeds];
            seeds[index].value = newValue;
            this.broadcast(seeds);
            return {seeds};
        });
    };

    getStyles() {
        return {
            root: {

            },

            content: {},
            seeds: {
                display: 'flex',
                justifyContent: 'flex-start',
                flexWrap: 'wrap',
            },
            seedType: {
                width: 100,
                marginLeft: this.context.muiTheme.spacing.desktopGutter,
            },
            seedValue: {
                width: 200,
                marginLeft: this.context.muiTheme.spacing.desktopGutter,
            },
            seedControls: {
                marginLeft: this.context.muiTheme.spacing.desktopGutter,
            },
            header: {
                width: 300
            },
            headerTitle: {
                color: this.context.muiTheme.palette.textColor,
            },
            headerDescription: {
                color: this.context.muiTheme.palette.secondaryTextColor,
            }
        };
    }

    render() {
        const styles = this.getStyles();
        styles.root = Object.assign(styles.root, this.props.style);
        return (
            <FlexContainer style={styles.root}
                           flexAlignContent="center"
                           flexAlignItems="center"
                           flexDirection="row"
                           flexJustifyContent="flex-start"
                           flexWrap="wrap">
                <div style={styles.header}>
                    <h3 style={styles.headerTitle}>Recommendation Seeds</h3>
                    <p style={styles.headerDescription}>Choose up to 5 genres, tracks, or artists</p>
                </div>
                <div
                    style={styles.content}>
                    <div style={styles.seedControls}>
                        <RaisedButton label="Add" onClick={this.onAddSeedBtnClick} disabled={this.state.seeds.length >= 5}/>
                        <RaisedButton label="Remove" onClick={this.onRemoveSeedBtnClick} disabled={this.state.seeds.length <= 1}/>
                    </div>
                    {this.state.seeds.map((seed, index) => {
                        return <div key={`seed_container_${index}`} style={styles.seeds}>
                                <SelectField
                                    floatingLabelText="Seed Type"
                                    value={seed.type}
                                    onChange={this.onChangeSelectSeedType(index)}
                                    style={styles.seedType}>
                                    <MenuItem value={SEED_TYPE_GENRE} primaryText="Genre" />
                                    <MenuItem value={SEED_TYPE_TRACK} primaryText="Track" />
                                    <MenuItem value={SEED_TYPE_ARTIST} primaryText="Artist" />
                                </SelectField>
                                {seed.type === SEED_TYPE_GENRE &&
                                    <SelectField
                                        floatingLabelText="Genre Seed"
                                        value={seed.value}
                                        onChange={this.onChangeSelectGenre(index)}
                                        style={styles.seedValue}>
                                        {this.props.genreSeeds &&
                                        this.props.genreSeeds.map((genre, index2) => <MenuItem
                                            value={index2}
                                            primaryText={genre}
                                            key={`seed_container_${index}_genre_${index2}`} />)
                                        }
                                    </SelectField>
                                }

                                {seed.type === SEED_TYPE_ARTIST &&
                                <TextField
                                    floatingLabelText="Spotify Artist Id"
                                    value={seed.value}
                                    onChange={this.onChangeArtistOrTrackId(index)}
                                    style={styles.seedValue}/>
                                }

                                {seed.type === SEED_TYPE_TRACK &&
                                <TextField
                                    floatingLabelText="Spotify Track Id"
                                    value={seed.value}
                                    onChange={this.onChangeArtistOrTrackId(index)}
                                    style={styles.seedValue} />
                                }
                            </div>
                    })}
                </div>
            </FlexContainer>
        );
    }
}