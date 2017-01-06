import React from 'react';
import Avatar from 'material-ui/Avatar';
import FlexContainer from './FlexContainer';

export default class Profile extends React.Component {

    static contextTypes = {
        muiTheme: React.PropTypes.object
    };

    static propTypes = {
        style: React.PropTypes.object,
        profile: React.PropTypes.object.isRequired,
    };

    getStyles() {
        return {
            root: {

            },
            content: {
                paddingLeft: this.context.muiTheme.spacing.desktopGutter,
            },
            label: {
                color: this.context.muiTheme.palette.secondaryTextColor,
            },
            value: {
                color: this.context.muiTheme.palette.textColor,
                marginTop: 0,
            },
            img: {
                marginBottom: this.context.muiTheme.spacing.desktopGutter,
            }
        };
    }

    render() {
        const styles = this.getStyles();
        styles.root = Object.assign(styles.root, this.props.style);
        const profile = this.props.profile;
        const image = profile.images && profile.images.length > 0 ? profile.images[profile.images.length - 1].url : null;
        return (
            <FlexContainer style={styles.root}
                           flexAlignContent="center"
                           flexAlignItems="center"
                           flexDirection="row"
                           flexJustifyContent="center"
                           flexWrap="wrap">
                <Avatar src={image} size={200} style={styles.p} />
                <div style={styles.content}>
                    <label style={styles.label}>Display Name</label>
                    <p style={styles.value}>{profile.display_name}</p>
                    <label style={styles.label}>Email</label>
                    <p style={styles.value}>{profile.email}</p>
                    <label style={styles.label}>Spotify User ID</label>
                    <p style={styles.value}>{profile.id}</p>
                    <label style={styles.label}>Spotify Uri</label>
                    <p style={styles.value}>{profile.uri}</p>
                    <label style={styles.label}>Country</label>
                    <p style={styles.value}>{profile.country}</p>
                    <label style={styles.label}>Product</label>
                    <p style={styles.value}>{profile.product}</p>
                    <label style={styles.label}>Followers</label>
                    <p style={styles.value}>{profile.followers.total}</p>
                </div>
            </FlexContainer>
        );
    }
}