import React from 'react';
import transitions from 'material-ui/styles/transitions';

const NINJA_STATES = [

    ['  o                     ', ' /|\\                   ', ' / \\                   ', ],
    ['\\ o /                   ', '  |                    ', ' / \\                   ', ],
    ['   _ o                  ', '    /\\                 ', '   | \\                 ', ],
    ['                        ', '      ___\\o            ', '     /)  |             ', ],
    ['        __|             ', '          \\o           ', '          ( \\          ', ],
    ['           \\ /          ', '            |          ', '           /o\\         ', ],
    ['               |__      ', '             o/        ', '            / )        ', ],
    ['                        ', '               o/__    ', '               |  (\\   ', ],
    ['                  o _   ', '                  /\\   ', '                  / |  ', ],
    ['                  \\ o / ', '                    |  ', '                   / \\ ', ],
    ['                  \\ o / ', '                    |  ', '                   / \\ ', ],
    ['                    o   ', '                   /|\\ ', '                   / \\ ', ],
    ['                    o   ', '                   /|\\ ', '                   / \\ ', ],

    ['                    o/  ', '                    |  ', '                    |\\ ', ],
    ['                    o/  ', '                    |__', '                    |  ', ],
    ['                   |    ', '                  o\\ / ', '                    |  ', ],
    ['                        ', '                  __|  ', '                 /o |  ', ],
    ['                  \\     ', '                  /\\   ', '                 |o    ', ],
    ['               __ __    ', '                 |o    ', '                 |     ', ],
    ['                /       ', '              / \\o     ', '                 \\     ', ],
    ['                        ', '             \\ __o     ', '              |  \\     ', ],
    ['               o__      ', '             \\/        ', '              |        ', ],
    ['              o/        ', '            __|        ', '              |        ', ],
    ['              o/        ', '              |        ', '             /|        ', ],
    ['              o/        ', '            __|        ', '              |        ', ],
    ['               o__      ', '             \\/        ', '              |        ', ],
    ['                        ', '             \\ __o     ', '              |  \\     ', ],
    ['                /       ', '              / \\o     ', '                 \\     ', ],
    ['               __ __    ', '                 |o    ', '                 |     ', ],
    ['                  \\     ', '                  /\\   ', '                 |o    ', ],
    ['                        ', '                  __|  ', '                 /o |  ', ],
    ['                   |    ', '                  o\\ / ', '                    |  ', ],
    ['                    o/  ', '                    |__', '                    |  ', ],
    ['                    o/  ', '                    |  ', '                    |\\ ', ],

    ['                     o  ', '                   /|\\ ', '                   / \\ ', ],
    ['                    \\o/ ', '                    |  ', '                   / \\ ', ],
    ['                    |o__', '                    |  ', '                   / \\ ', ],
    ['                    \\o  ', '                    |\\ ', '                   / \\ ', ],
    ['                  __o   ', '                   /|  ', '                   / \\ ', ],
    ['                    o/  ', '                    |  ', '                   /|\\ ', ],
    ['                    o/  ', '                   /|  ', '                   / \\ ', ],
    ['                  __o|  ', '                    |  ', '                   / \\ ', ],

    ['                    o   ', '                   /|\\ ', '                   / \\ ', ],
    ['                  \\ o / ', '                    |  ', '                   / \\ ', ],
    ['                  o _   ', '                  /\\   ', '                  / |  ', ],
    ['                        ', '               o/__    ', '               |  (\\   ', ],
    ['               |__      ', '             o/        ', '            / )        ', ],
    ['           \\ /          ', '            |          ', '           /o\\         ', ],
    ['        __|             ', '          \\o           ', '          ( \\          ', ],
    ['                        ', '      ___\\o            ', '     /)  |             ', ],
    ['   _ o                  ', '    /\\                 ', '   | \\                 ', ],
    ['\\ o /                   ', '  |                    ', ' / \\                   ', ],
    ['\\ o /                   ', '  |                    ', ' / \\                   ', ],
    ['  o                     ', ' /|\\                   ', ' / \\                   ', ],
    ['  o                     ', ' /|\\                   ', ' / \\                   ', ],

    ['  o/                    ', '  |                    ', ' /|                    ', ],
    ['  o/                    ', '__|                    ', '  |                    ', ],
    ['   o__                  ', ' \\/                    ', '  |                    ', ],
    ['                        ', ' \\ __o                 ', '  |  \\                 ', ],
    ['    /                   ', '  / \\o                 ', '     \\                 ', ],
    ['   __ __                ', '     |o                ', '     |                 ', ],
    ['      \\                 ', '      /\\               ', '     |o                ', ],
    ['                        ', '      __|              ', '     /o |              ', ],
    ['       |                ', '      o\\ /             ', '        |              ', ],
    ['        o/              ', '        |__            ', '        |              ', ],
    ['        o/              ', '        |              ', '        |\\             ', ],
    ['        o/              ', '        |__            ', '        |              ', ],
    ['       |                ', '      o\\ /             ', '        |              ', ],
    ['                        ', '      __|              ', '     /o |              ', ],
    ['      \\                 ', '      /\\               ', '     |o                ', ],
    ['   __ __                ', '     |o                ', '     |                 ', ],
    ['    /                   ', '  / \\o                 ', '     \\                 ', ],
    ['                        ', ' \\ __o                 ', '  |  \\                 ', ],
    ['   o__                  ', ' \\/                    ', '  |                    ', ],
    ['  o/                    ', '__|                    ', '  |                    ', ],
    ['  o/                    ', '  |                    ', ' /|                    ', ],
    ['  o/                    ', '  |                    ', ' /|                    ', ],

    ['   o                    ', ' /|\\                   ', ' / \\                   ', ],
    ['  \\o/                   ', '  |                    ', ' / \\                   ', ],
    ['  |o__                  ', '  |                    ', ' / \\                   ', ],
    ['  \\o                    ', '  |\\                   ', ' / \\                   ', ],
    ['__o                     ', ' /|                    ', ' / \\                   ', ],
    ['  o/                    ', '  |                    ', ' /|\\                   ', ],
    ['  o/                    ', ' /|                    ', ' / \\                   ', ],
    ['__o|                    ', '  |                    ', ' / \\                   ', ],

];

export default class Ninja extends React.Component {
    static contextTypes = {
        muiTheme: React.PropTypes.object
    };

    static propTypes = {
        interval: React.PropTypes.number.isRequired,
        enabled: React.PropTypes.bool.isRequired,
        disableDelay: React.PropTypes.number,
        style: React.PropTypes.object,
    };

    state = {
        counter: 0,
    };

    lastEnableTime = 0;
    lastDisableTime = 0;
    timer = null;

    buildTimer() {
        if (!this.timer) {
            this.timer = setInterval(() => {
                this.setState((state) => {
                    return {counter: state.counter + 1}
                });
            }, this.props.interval);
        }
    }

    destroyTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = null;
    }

    componentDidMount() {
        this.buildTimer();
    }

    componentWillUnmount() {
        this.destroyTimer();
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.enabled && nextProps.enabled) {
            this.lastEnableTime = Date.now();
            this.buildTimer();
        }
        if (this.props.enabled && !nextProps.enabled) {
            this.lastDisableTime = Date.now();
        }
    }

    getStyles(disableDelay) {
        return {
            root: {
                color: this.context.muiTheme.textColor,
                opacity: 1.0,
                transition: transitions.easeOut(`${disableDelay}ms`, 'opacity'),
            }
        };
    }

    getNinjaState(index) {
        return NINJA_STATES[index % NINJA_STATES.length];
    }

    render() {
        const disableDelay = this.props.disableDelay ? this.props.disableDelay : this.props.interval * 20;
        const styles = this.getStyles(disableDelay);
        const style = Object.assign(styles.root, this.props.style);
        const ninja = this.getNinjaState(this.state.counter);

        if (!this.props.enabled) {
            const elapsedTime = Date.now() - this.lastDisableTime;
            if (elapsedTime > disableDelay) {
                style.display = 'none';
                this.destroyTimer();
            } else {
                style.opacity = 0.0
            }
        }
        return <pre style={style}>{ninja[0]}<br/>{ninja[1]}<br/>{ninja[2]}</pre>
    }
}
