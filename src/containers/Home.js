import React from 'react';
import { connect } from 'react-redux';
import Profile from '../components/Profile';
import FlexContainer from '../components/FlexContainer';
import ImageFeature from '../components/ImageFeature';
import Actions from '../actions';

class Home extends React.Component {
    componentWillMount() {
        this.props.dispatch(Actions.fetchProfileIfNeeded())
            .catch((err) => {
                console.log('Home Error', err);
            });
    }

    getStyles() {
        return {
            root: {},
            profile: {
                backgroundColor: '#121212'
            },
            features: {
                backgroundColor: '#222222'
            }
        };
    }

    render() {
        const profile = this.props.profile;
        const styles = this.getStyles();
        return (
            <div>
                {this.props.isLoggedIn() &&
                <div style={styles.root}>
                    <Profile profile={profile.object} style={styles.profile}/>
                    <FlexContainer
                        flexAlignContent="center"
                        flexAlignItems="center"
                        flexDirection="row"
                        flexJustifyContent="space-around"
                        flexWrap="wrap"
                        style={styles.features}>
                        <ImageFeature image="https://placehold.it/350x250" heading="Deduplicate" route="/deduplicate"/>
                        <ImageFeature image="https://placehold.it/350x250" heading="Genres" route="/genres"/>
                        <ImageFeature image="https://placehold.it/350x250" heading="Recommendations" route="/recommendations"/>
                    </FlexContainer>
                </div>
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { profile } = state;
    return {profile};
}

export default connect(mapStateToProps)(Home)