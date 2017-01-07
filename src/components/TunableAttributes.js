import React from 'react';
import FlexContainer from './FlexContainer';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Slider from 'material-ui/Slider';
import helpers from '../utils/helpers';
import Divider from 'material-ui/Divider';

const KEYS = [
    'C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'
];

const GENERIC_TOLABEL = (value) => `${value.toFixed(2)}`;

const ATTRIBUTES = [
    {
        name: 'acousticness',
        id: 'acousticness',
        value: 0,
        min: 0.0, max: 1.0, step: 0.01,
        description: 'A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.',
        toLabel: GENERIC_TOLABEL,
    },
    {
        name: 'danceability',
        id: 'danceability',
        value: 1,
        min: 0.0, max: 1.0, step: 0.01,
        description: 'Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.',
        toLabel: GENERIC_TOLABEL,
    },
    {
        name: 'duration (ms)',
        id: 'duration_ms',
        value: 2,
        min: 0, max: 1000*60*60*2, step: 100,
        description: 'The duration of the track in milliseconds.',
        toLabel: (value) => `${helpers.formatMilliseconds(value)}`,
    },
    {
        name: 'energy',
        id: 'energy',
        value: 3, min: 0.0, max: 1.0, step: 0.01,
        description: 'Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.',
        toLabel: GENERIC_TOLABEL,
    },
    {
        name: 'instrumentalness',
        id: 'instrumentalness',
        value: 4,
        min: 0.0, max: 1.0, step: 0.01,
        description: 'Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly "vocal". The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0.',
        toLabel: GENERIC_TOLABEL,
    },
    {
        name: 'key',
        id: 'key',
        value: 5,
        min: 0, max: 11, step: 1,
        description: 'The key the track is in. Integers map to pitches using standard Pitch Class notation. E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on.',
        toLabel: (value) => `${KEYS[value]}`
    },
    {
        name: 'liveness',
        id: 'liveness',
        value: 6,
        min: 0.0, max: 1.0, step: 0.01,
        description: 'Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live.',
        toLabel: GENERIC_TOLABEL,
    },
    {
        name: 'loudness',
        id: 'loudness',
        value: 7,
        min: 0.0, max: 200, step: 1.0,
        description: 'The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typical range between -60 and 0 db.',
        toLabel: (value) => `${-value}dB`
    },
    {
        name: 'mode',
        id: 'mode',
        value: 8,
        min: 0, max: 1, step: 1,
        description: 'Mode indicates the modality (major or minor) of a track, the type of scale from which its melodic content is derived. Major is represented by 1 and minor is 0.',
        toLabel: (value) => value === 1 ? `major` : `minor`
    },
    {
        name: 'popularity',
        id: 'popularity',
        value: 9,
        min: 0, max: 100, step: 1,
        description: 'The popularity of the track. The value will be between 0 and 100, with 100 being the most popular. The popularity is calculated by algorithm and is based, in the most part, on the total number of plays the track has had and how recent those plays are.',
        toLabel: GENERIC_TOLABEL,
    },
    {
        name: 'speechiness',
        id: 'speechiness',
        value: 10,
        min: 0.0, max: 1.0, step: 0.01,
        description: 'Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks.',
        toLabel: GENERIC_TOLABEL,
    },
    {
        name: 'tempo',
        id: 'tempo',
        value: 11,
        min: 1.0, max: 300.0, step: 1.0,
        description: 'The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.',
        toLabel: (value) => `${value.toFixed(2)} BPMs`
    },
    {
        name: 'time signature',
        id: 'time_signature',
        value: 12,
        min: 1, max: 64, step: 1,
        description: 'An estimated overall time signature of a track. The time signature (meter) is a notational convention to specify how many beats are in each bar (or measure).',
        toLabel: (value) => `${value} beats per measure`
    },
    {
        name: 'valence',
        id: 'valence',
        value: 13,
        min: 0.0, max: 1.0, step: 0.01,
        description: 'A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).',
        toLabel: GENERIC_TOLABEL,
    },
];

const TUNABLE_TYPE_MIN = 0;
const TUNABLE_TYPE_MAX = 1;
const TUNABLE_TYPE_TARGET = 2;


export default class TunableAttributes extends React.Component {

    static contextTypes = {
        muiTheme: React.PropTypes.object
    };

    static propTypes = {
        style: React.PropTypes.object,
        onChange: React.PropTypes.func.isRequired,
    };

    state = {
        tunables: [{type: TUNABLE_TYPE_TARGET, value: 0, attribute: ATTRIBUTES[0]}]
    };

    componentDidMount() {
        this.broadcast(this.state.tunables);
    }
    
    broadcast = (tunables) => {
        let obj = {};
        tunables.forEach((tuneable) => {
            let prefix;
            if (tuneable.type === TUNABLE_TYPE_MAX) {
                prefix = 'max_';
            } else if (tuneable.type === TUNABLE_TYPE_MIN) {
                prefix = 'min_';
            } else if (tuneable.type === TUNABLE_TYPE_TARGET) {
                prefix = 'target_';
            }
            let value;
            if (Number.isInteger(tuneable.value)) {
                value = tuneable.value.toString();
            } else {
                value = tuneable.value.toFixed(2);
            }
            obj[`${prefix}${tuneable.attribute.id}`] = value;
        });
        this.props.onChange(obj);
    };

    onAddTuneableBtnClick = () => {
        this.setState((state) => {
            let tunables = [...state.tunables];
            if (tunables.length > 0) {
                let lastTuneable = tunables[tunables.length-1];
                tunables.push({type: lastTuneable.type, attribute: lastTuneable.attribute, value: lastTuneable.value});
            } else {
                tunables.push({type: TUNABLE_TYPE_TARGET, attribute: ATTRIBUTES[0], value: ATTRIBUTES[0].min});
            }
            this.broadcast(tunables);
            return {tunables};
        });
    };

    onRemoveTuneableBtnClick = () => {
        this.setState((state) => {
            let tunables = [...state.tunables];
            tunables.pop();
            this.broadcast(tunables);
            return {tunables};
        });
    };

    onChangeSelectTuneableType = (index) => (event, key, payload) => {
        this.setState((state) => {
            let tunables = [...state.tunables];
            tunables[index].type = payload;
            this.broadcast(tunables);
            return {tunables};
        });
    };

    onChangeSelectTuneableAttribute = (index) => (event, key, payload) => {
        this.setState((state) => {
            let tunables = [...state.tunables];
            tunables[index].attribute = ATTRIBUTES[payload];
            tunables[index].value = ATTRIBUTES[payload].min;
            this.broadcast(tunables);
            return {tunables};
        });
    };

    onSliderChange = (index) => (event, newValue) => {
        this.setState((state) => {
            let tunables = [...state.tunables];
            tunables[index].value = newValue;
            this.broadcast(tunables);
            return {tunables};
        });
    };

    getStyles() {
        return {
            root: {

            },
            content: {},
            tunables: {
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexWrap: 'wrap',

            },
            tunableType: {
                width: 100,
                marginLeft: this.context.muiTheme.spacing.desktopGutter,
            },
            tunableName: {
                width: 200,
                marginLeft: this.context.muiTheme.spacing.desktopGutter,
            },
            tunableControls: {
                marginLeft: this.context.muiTheme.spacing.desktopGutter,
            },
            sliderOuter: {
                width: 300,
            },
            sliderInner: {
                marginTop: 20,
                marginBottom: 20,
                //margin: this.context.muiTheme.spacing.desktopGutterMini,
            },
            sliderLabel: {
                height: 22,
                lineHeight: '22px',
            },
            sliderContainer: {
                marginLeft: this.context.muiTheme.spacing.desktopGutter,
            },
            descriptionContainer: {
                maxWidth: 1200,
                margin: '0 auto',
                color: this.context.muiTheme.palette.textColor,
                padding: this.context.muiTheme.spacing.desktopGutter,
            },
            description: {
                color: this.context.muiTheme.palette.secondaryTextColor,
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
        <div>
            <FlexContainer style={styles.root}
                           flexAlignContent="center"
                           flexAlignItems="center"
                           flexDirection="row"
                           flexJustifyContent="flex-start"
                           flexWrap="wrap">
                <div style={styles.header}>
                    <h3 style={styles.headerTitle}>Tunable Attributes</h3>
                    <p style={styles.headerDescription}>Choose target, min, and max attributes</p>
                </div>
                <div
                    style={styles.content}>
                    <div style={styles.tunableControls}>
                        <RaisedButton label="Add" onClick={this.onAddTuneableBtnClick} disabled={this.state.tunables.length >= 42}/>
                        <RaisedButton label="Remove" onClick={this.onRemoveTuneableBtnClick} disabled={this.state.tunables.length <= 0}/>
                    </div>
                    {this.state.tunables.map((tuneable, index) => {
                        return <div key={`tuneable_container_${index}`} style={styles.tunables}>
                            <SelectField
                                floatingLabelText="Type"
                                value={tuneable.type}
                                onChange={this.onChangeSelectTuneableType(index)}
                                style={styles.tunableType}>
                                <MenuItem value={TUNABLE_TYPE_TARGET} primaryText="Target" />
                                <MenuItem value={TUNABLE_TYPE_MIN} primaryText="Min" />
                                <MenuItem value={TUNABLE_TYPE_MAX} primaryText="Max" />
                            </SelectField>
                            <SelectField
                                floatingLabelText="Name"
                                value={tuneable.attribute.value}
                                onChange={this.onChangeSelectTuneableAttribute(index)}
                                style={styles.tunableName}>
                                {ATTRIBUTES.map((attribute, index2) => <MenuItem
                                    value={attribute.value}
                                    primaryText={attribute.name}
                                    key={`tuneable_container_${index}_name_${index2}`} />)
                                }
                            </SelectField>
                            <div style={styles.sliderContainer}>

                                <Slider
                                    style={styles.sliderOuter}
                                    sliderStyle={styles.sliderInner}
                                    min={tuneable.attribute.min}
                                    max={tuneable.attribute.max}
                                    step={tuneable.attribute.step}
                                    value={tuneable.value}
                                    onChange={this.onSliderChange(index)}/>
                                {tuneable.attribute.toLabel ? <label style={styles.sliderLabel}>{tuneable.attribute.toLabel(tuneable.value)}</label> : <label style={styles.sliderLabel}>{tuneable.value}</label>}
                            </div>
                        </div>
                    })}
                </div>
            </FlexContainer>
            <Divider />
            <div style={styles.descriptionContainer}>
                <h1>Tunable Attributes</h1>
            </div>
            <div style={styles.descriptionContainer}>
                <h3>Types</h3>
                <h4>Target</h4>
                <p style={styles.description}>For each of the tunable track attributes (below) a target value may be provided. Tracks with the attribute values nearest to the target values will be preferred. For example, you might request target_energy=0.6 and target_danceability=0.8. All target values will be weighed equally in ranking results.</p>
                <h4>Max</h4>
                <p style={styles.description}>For each tunable track attribute, a hard ceiling on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, max_instrumentalness=0.35 would filter out most tracks that are likely to be instrumental.</p>
                <h4>Min </h4>
                <p style={styles.description}>For each tunable track attribute, a hard floor on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, min_tempo=140 would restrict results to only those tracks with a tempo of greater than 140 beats per minute.</p>
            </div>
            <Divider />
            <div style={styles.descriptionContainer}>
                <h3>Descriptions</h3>
                {ATTRIBUTES.map((attribute, index) =>
                    <div key={`tuneables_description_${index}`}>
                        <h4>{attribute.name}</h4>
                        <p style={styles.description}>{attribute.description}</p>
                    </div>
                )}
            </div>

        </div>
        );
    }
}