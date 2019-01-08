import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Timer from '@material-ui/icons/Timer';
import { observer } from 'mobx-react';
const prettyMs = require('pretty-ms')

const styles = theme => ({
    card: {
        marginBottom: 10
    },
    icon: {
        fontSize: 12
    }
});

@observer
class BaseStatsComponent extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.state = {
            time: 0,
            isOn: false,
        }
        this.startTimer = this.startTimer.bind(this)
        this.stopTimer = this.stopTimer.bind(this)
        this.resetTimer = this.resetTimer.bind(this)
    }

    startTimer() {
        this.setState({
            isOn: true
        })
        this.timer = setInterval(() => this.setState({
            time: Date.now() - new Date(this.props.question.opened_at)
        }), 1);
    }
    stopTimer() {
        this.setState({ isOn: false })
        clearInterval(this.timer)
    }
    resetTimer() {
        this.setState({ isOn: false })
    }

    componentDidUpdate() {
        if (this.props.timer) {
            if (!this.props.hidden && !this.state.isOn) {
                this.startTimer()
            }
            else if (this.props.hidden && this.state.time !== 0 && this.state.isOn) {
                this.stopTimer()
                this.resetTimer()
            }
        }
    }

    componentWillUnmount() {
        this.stopTimer()
        this.resetTimer()
    }


    render() {
        return (
            <Card className={this.styles.card} hidden={this.props.hidden}>
                <CardContent>
                    <Typography variant="h6" color="inherit">
                        Statistics for {this.props.questionTitle}
                    </Typography>
                    {this.props.timer ? (
                        <Typography variant="subtitle2" color="inherit" hidden={!this.props.timer} >
                            <Timer className={this.styles.icon} /> Open for {this.state.time < 1000 ?
                                '0s' : prettyMs(this.state.time, { secDecimalDigits: 0 })}
                        </Typography>
                    ) : null
                    }
                    {this.props.children}
                    <Typography variant="body1" color="inherit">
                        Total Responses: {this.props.responsesNumber}
                    </Typography>
                </CardContent>
            </Card>
        );
    }
}

export default withStyles(styles)(BaseStatsComponent);