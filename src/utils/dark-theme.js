import {fade, lighten, darken} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

const spotifyWhite = '#ffffff';
const spotifyBlack = '#191414';

const spotifyGreen = '#1db954';
const spotifyGreenLight = '#1bd85e';

const spotifyRed = '#cd1a2b';
const spotifyRedLight = '#eb182c';

const spotifyBlue = '#4687d6';
const spotifyBlueDark = darken(spotifyBlue, 0.125);
const spotifyBlueLight = lighten(spotifyBlue, 0.125);

const darkestBackground = '#121212';
const darkerBackground = '#181818';
const darkBackground = '#282828';
const darkBackgroundAlternate1 = '#333333';
const darkBackgroundAlternate2 = '#404040';

const border = '#282828';

const textAccent = spotifyWhite;
const textNormal = '#a0a0a0';

const raisedButtonBackground = '#1f1f1f';
const raisedButtonDisabledBackground = darken(raisedButtonBackground, 0.1);
const raisedButtonText = textAccent;
const raisedButtonDisabledText = fade(raisedButtonText, 0.3);

const avatarBackground = '#282828';

const toggleThumbOff = textNormal;
const toggleThumbOn = spotifyWhite;
const toggleTrackOff = darkBackgroundAlternate2;
const toggleTrackOn = spotifyGreen;

const sliderTrack = darkBackgroundAlternate2;

export default {
    spacing: spacing,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: spotifyGreen,
        primary2Color: spotifyGreen,
        primary3Color: spotifyBlack,
        accent1Color: spotifyBlue,
        accent2Color: spotifyBlueDark,
        accent3Color: spotifyBlueLight,
        textColor: textAccent,
        secondaryTextColor: textNormal,
        alternateTextColor: textNormal,
        canvasColor: darkerBackground,
        borderColor: border,
        disabledColor: fade(spotifyWhite, 0.3),

        darkestBackground, darkerBackground, darkBackground, darkBackgroundAlternate1, darkBackgroundAlternate2,
        spotifyGreen, spotifyGreenLight,
        spotifyBlack,
        spotifyWhite,
        spotifyBlue, spotifyBlueLight, spotifyBlueDark,
        spotifyRed, spotifyRedLight,
    },
    appBar: {
        color: darkBackground,
        textColor: textAccent,
    },
    avatar: {
        backgroundColor:avatarBackground,
    },
    floatingActionButton: {
        iconColor: textAccent,
        secondaryIconColor: textAccent,
    },
    raisedButton: {
        color: raisedButtonBackground,
        disabledColor: raisedButtonDisabledBackground,
        textColor: raisedButtonText,
        primaryTextColor: raisedButtonText,
        secondaryTextColor: raisedButtonText,
        disabledTextColor: raisedButtonDisabledText,
    },
    slider: {
        trackColor: sliderTrack,
        trackColorSelected: sliderTrack,
    },
    tableHeaderColumn: {
        textColor: textNormal,
    },
    toggle: {
        thumbOnColor: toggleThumbOn,
        thumbOffColor: toggleThumbOff,
        trackOnColor: toggleTrackOn,
        trackOffColor: toggleTrackOff,
        labelColor: textNormal,
    },
};