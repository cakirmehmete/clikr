import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import APIStudentService from '../../../../services/APIStudentService'
import { observer, inject } from 'mobx-react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
const prettyMs = require('pretty-ms')

// for sliding up motion
function Transition(props) {
    return <Slide direction="up" {...props} />;
}

const styles = theme => ({
    gridContainer: {
        margin: theme.spacing.unit,
    },
    buttonContainer: {
        padding: theme.spacing.unit * 1.5,
    },
    answerOption: {
        marginLeft: theme.spacing.unit * 0.3,
    },
    paper: {
        padding: theme.spacing.unit,
    },

});

@inject("store")
@observer
class MCQ extends Component {

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
        answerchoices: [],
        answer: "",
        sent: "",
        dialogue: false,
        disabled: false,
        time: 0,
        isOn: false
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

        var answers = []

        for (var i = 1; i <= this.question['number_of_options']; i++) {
            var qstring = this.question["option" + i.toString()];
            answers.push(qstring)
        }

        this.setState({
            answerchoices: answers
        })

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
        this.store.updateLastAnswer(this.state.answerchoices.indexOf(this.state.sent) + 1);
        this.stopTimer()
        this.resetTimer()
    }

    handleChange = (e) => {
        this.setState({
            answer: e.target.value
        });
        if (e.target.value === this.state.sent) {
            this.setState({
                disabled: true
            })
        }
        else {
            this.setState({
                disabled: false
            })
        }
    };

    handleSubmit = () => {
        this.apiStudentService.postAnswer((this.state.answerchoices.indexOf(this.state.answer) + 1).toString(), this.props.questionId)
        this.setState({
            sent: this.state.answer,
            disabled: true
        })
    };

    handleClick = () => {
        if (this.state.sent === "") {
            this.handleSubmit()
        }
        else if (this.state.sent !== this.state.answer) {
            this.setState({
                dialogue: true
            });
        }
    };

    // close dialogue box
    handleClose = () => {
        this.setState({
            dialogue: false,
            answer: this.state.sent,
            disabled: true
        });
    };

    // close dialogue box and resubmit
    handleCloseSubmit = () => {
        this.setState({ dialogue: false });
        this.handleSubmit()
    };


    render() {
        return (
            <div>
                <Paper className={this.styles.paper}>
                    <Grid container direction="column" className={this.styles.gridContainer}>

                        <Typography variant="h5" color="secondary"> {this.question.question_title} </Typography>
                        <Typography variant="subtitle1" color="secondary"> Open for {this.state.time < 1000 ?
                            '0s' : prettyMs(this.state.time, { secDecimalDigits: 0 })}
                        </Typography>
                        <FormControl component="fieldset">
                            <RadioGroup
                                name="answers"
                                value={this.state.answer}
                                onChange={this.handleChange}
                            >
                                {this.state.answerchoices.map((a, index) => {
                                    return (
                                        <FormControlLabel value={a} key={a} control={<Radio />} label={a} className={this.styles.answerOption} />
                                    )
                                })
                                }
                            </RadioGroup>
                        </FormControl>
                    </Grid>



                    <Grid container direction='row' justify="flex-end" className={this.styles.buttonContainer}>
                        <Button onClick={this.handleClick} disabled={this.state.disabled} value={this.state.answer} variant="contained" color="secondary">
                            Submit
                        </Button>
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
                    </Grid>
                </Paper>
            </div>


        );
    }
}
export default withStyles(styles)(MCQ);
