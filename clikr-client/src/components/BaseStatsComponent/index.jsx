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
        fontSize: 20
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
            start: 0
        }
        this.startTimer = this.startTimer.bind(this)
        this.stopTimer = this.stopTimer.bind(this)
        this.resetTimer = this.resetTimer.bind(this)
    }

    startTimer() {
        this.setState({
            isOn: true,
            time: this.state.time,
            start: Date.now() - this.state.time
        })
        this.timer = setInterval(() => this.setState({
            time: Date.now() - this.state.start
        }), 1);
    }
    stopTimer() {
        this.setState({ isOn: false })
        clearInterval(this.timer)
    }
    resetTimer() {
        this.setState({ time: 0, isOn: false })
    }

    componentDidUpdate() {
        if (!this.props.hidden && !this.state.isOn) {
            this.startTimer()
        }
        else if (this.props.hidden && this.state.time !== 0 && this.state.isOn) {
            this.stopTimer()
            this.resetTimer()
        }
    }

    render() {
        return (
            <Card className={this.styles.card} hidden={this.props.hidden}>
                <CardContent>
                    <Typography variant="h6" color="inherit">
                        Statistics for {this.props.questionTitle}
                    </Typography>
                    <Typography variant="subtitle1" color="inherit">
                        <Timer className={this.styles.icon}/> Open for {prettyMs(this.state.time)}
                    </Typography>
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