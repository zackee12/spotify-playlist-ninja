import React from 'react';

export default class FlexContainer extends React.Component {
    static contextTypes = {
        muiTheme: React.PropTypes.object
    };

    static propTypes = {
        children: React.PropTypes.node,
        contentStyle: React.PropTypes.object,
        style: React.PropTypes.object,
        flexAlignItems: React.PropTypes.string,
        flexAlignContent: React.PropTypes.string,
        flexDirection: React.PropTypes.string,
        flexWrap: React.PropTypes.string,
        flexJustifyContent: React.PropTypes.string,
    };

    getStyles() {
        let styles = {
            root: {
                boxSizing: 'border-box',
                backgroundColor: this.context.muiTheme.palette.canvasColor,
                color: this.context.muiTheme.palette.textColor,
                padding: this.context.muiTheme.spacing.desktopGutter,
                margin: 0,
            },
            content: {
                maxWidth: 1200,
                margin: '0 auto',
                display: 'flex',
            },
        };
        if (this.props.flexAlignContent) styles.content.alignContent = this.props.flexAlignContent;
        if (this.props.flexAlignItems) styles.content.alignItems = this.props.flexAlignItems;
        if (this.props.flexDirection) styles.content.flexDirection = this.props.flexDirection;
        if (this.props.flexJustifyContent) styles.content.justifyContent = this.props.flexJustifyContent;
        if (this.props.flexWrap) styles.content.flexWrap = this.props.flexWrap;
        return styles;
    }

    render() {
        const { style, contentStyle } = this.props;
        const styles = this.getStyles();
        styles.root = Object.assign(styles.root, style);
        styles.content = Object.assign(styles.content, contentStyle);
        return (
            <div style={Object.assign(styles.root, style)}>
                <div style={Object.assign(styles.content, contentStyle)}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
