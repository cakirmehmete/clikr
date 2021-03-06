import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { observer, inject } from 'mobx-react';
import APIStudentService from '../../../../services/APIStudentService'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/lab/Slider';
import Timer from '@material-ui/icons/Timer';
import Card from '@material-ui/core/Card';

const prettyMs = require('pretty-ms')

const styles = theme => ({
    gridContainer: {
        margin: theme.spacing.unit,
    },
    gridItem: {
        paddingTop: theme.spacing.unit*3,
        paddingBottom: theme.spacing.unit*3,
        paddingRight: theme.spacing.unit*1.5
    },
    buttonContainer: {
        padding: theme.spacing.unit*1.5,
        width: "100%"
    },
    percentContainer: {
        paddingRight: theme.spacing.unit*3
    },
    labels: {
        wordBreak:"break-word", 
        fontFamily:"sans-serif", 
        fontSize:"1em", 
        display:"flex", 
        justifyContent:"center"
    },
    titleWrap: {
        wordBreak:"break-word", 
        fontFamily:"sans-serif", 
        fontSize:"1.5em", 
        display:"flex", 
        color: theme.palette.secondary.main
    },
    card: {
        backgroundColor: theme.palette.secondary.main,
        padding: theme.spacing.unit*0.25,
        width: 45
    },
    whiteTypography: {
        color: "white"
    },
    paper: {
        padding: theme.spacing.unit,
    },
    icon: {
        fontSize: 12
    }
});

// for sliding up motion
function Transition(props) {
    return <Slide direction="up" {...props} />;
  }

@inject("store")
@observer
class SLQ extends Component {

    constructor(props) {
        super(props);
        this.store = this.props.store;
        this.styles = props.classes;
        this.apiStudentService = new APIStudentService(this.store);
        this.question = this.store.getQuestionWithId(this.props.questionId);
        this.startTimer = this.startTimer.bind(this)
        this.stopTimer = this.stopTimer.bind(this)
        this.resetTimer = this.resetTimer.bind(this)
    }

    state = {
        answer: 50,
        sent: "",
        disabled: false,
        dialogue: false,
        time: 0,
        isOn: false,
    }

    startTimer() {
        this.setState({
            isOn: true
        })

        this.timer = setInterval(() => this.setState({
            time: Date.now() - new Date(this.question.opened_at)
        }), 1);
    }
    
    stopTimer() {
        this.setState({ isOn: false })
        clearInterval(this.timer)
    }

    resetTimer() {
        this.setState({ isOn: false })
    }

    componentDidMount() {
        if (!this.state.isOn) {
            this.startTimer()
        }
        else if (this.state.time !== 0 && this.state.isOn) {
            this.stopTimer()
            this.resetTimer()
        }
    }

    componentWillUnmount() {
        // question closed -> store answer into store.lastAnswer
        this.store.updateLastAnswer(this.state.sent);
        this.stopTimer()
        this.resetTimer()
    }

    handleSubmit = () => {
        this.apiStudentService.postAnswer(this.state.answer.toString(), this.question.id)
        this.setState({
            sent: this.state.answer,
            disabled: true
        })
    }

    handleClick = (e) => {
        if (this.state.sent === ""){
            this.handleSubmit()
        }
        else if (this.state.sent !== this.state.answer) {
            this.setState({
                dialogue: true
            });
        }
    }

    handleSliderChange = (event, value) => {
        if (value === this.state.sent) {
            this.setState({
                disabled: true
            })
        } 
        else {
            this.setState({
                disabled: false
            })
        }
        
        this.setState({ answer: value });
      };

    // close dialogue box
    handleClose = () => {
        this.setState({ dialogue: false });
    };

    // close dialogue box and resubmit
    handleCloseSubmit = () => {
        this.setState({ dialogue: false });
        this.handleSubmit()
    };

    render() {
        var timerString = `Open for ${this.state.time < 1000 ?
            '0s' : prettyMs(this.state.time, { secDecimalDigits: 0 })}`;
        
        if (this.question.scheduled === true) {
            timerString = `Open from ${this.question.opened_at} to ${this.question.closed_at}`
        }

        return (
            <div>
                <Paper className={this.styles.paper}>
                    <Grid container direction="column" justify="space-between" className={this.styles.gridContainer}>
                        <Grid item>
                            <Grid container direction="row" justify="space-between" alignItems="flex-start" spacing={24}>
                                <Grid item xs>
                                    <div className={this.styles.titleWrap}> {this.question.question_title} </div>
                                    <Typography variant="subtitle2" color="secondary"> 
                                        <Timer className={this.styles.icon} /> {timerString}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Grid container justify="flex-end" direction="row" className={this.styles.percentContainer}>
                                        <Card className={this.styles.card}>
                                            <Typography align="center" className={this.styles.whiteTypography}>
                                                {this.state.answer.toString() + " "}%
                                            </Typography>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid container direction="row" justify="center" alignItems="center" spacing={24} className={this.styles.gridItem}>
                            <Grid item xs>
                                <Grid container justify="center">
                                    <div className={this.styles.labels}>{this.question.lower_label}</div>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Slider
                                    value={this.state.answer}
                                    min={0}
                                    max={100}
                                    step={1}
                                    aria-labelledby="label"
                                    onChange={this.handleSliderChange}
                                />
                            </Grid>
                            <Grid item xs>
                                <Grid container justify="center">
                                    <div className={this.styles.labels}>{this.question.upper_label}</div>
                                </Grid>
                            </Grid>
                        </Grid> 
                    </Grid>
                    <Grid container direction='row' justify="flex-end" className={this.styles.buttonContainer}>
                        <Grid item >
                            <Button onClick={this.handleClick} disabled={this.state.disabled} variant="contained" color="secondary">
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
                <Dialog
                    open={this.state.dialogue}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        {"Answer changed- "}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                        "Are you sure you want to change your answer from {this.state.sent} to {this.state.answer}?"
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                        no
                        </Button>
                        <Button onClick={this.handleCloseSubmit} color="primary">
                        yes
                        </Button>
                    </DialogActions>
                </Dialog>            
            </div>
        );
    }
}
export default withStyles(styles)(SLQ);
