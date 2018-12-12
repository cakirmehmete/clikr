
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


// for sliding up motion
function Transition(props) {
    return <Slide direction="up" {...props} />;
}

const styles = theme => ({
    gridContainer: {
        margin: theme.spacing.unit,
    },
    buttonContainer: {
        padding: theme.spacing.unit*1.5,
    },
    correctAnswer: {
        backgroundColor: theme.palette.primary.light,
        marginLeft: theme.spacing.unit*0.3,
    },
    wrongAnswer: {
        backgroundColor: theme.palette.primary.dark,
        marginLeft: theme.spacing.unit*0.3,
    },
    neutralAnswer: {
        marginLeft: theme.spacing.unit*0.3,
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
    }
    componentDidMount () {

        var answers = []

        for (var i = 1; i <= this.question['number_of_options']; i++) {
            var qstring = this.question["option" + i.toString()];
            answers.push(qstring)
        }

        this.setState({
            answerchoices: answers
        })
    }

    componentWillReceiveProps(nextProps) {
        var a =  this.store.getQuestionWithId(nextProps.questionId).correct_answer

        if (a !== undefined) {
            if (a !== null) {
                this.setState({
                    correct: Number(a) - 1
                });
            } else {
                this.setState({
                    correct: null
                })
            }
            this.setState({
                buttonText: "dismiss",
                disabledInput: true,
                disabled: false
            });
        }
    }

    state = {
        answerchoices: [],
        answer: "",
        sent: "",
        correct: undefined,
        buttonText: "submit",
        disabledInput: false,
        dialogue: false,
        disabled: false,
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
        else{
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
        if (this.state.buttonText === "dismiss") {
            this.store.removeQuestionById(this.props.questionId);
        }
        else if (this.state.sent === ""){
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
                        <FormControl component="fieldset">
                            <RadioGroup
                                name="answers"
                                value={this.state.answer}
                                onChange={this.handleChange}
                            >
                                {this.state.answerchoices.map((a, index) => {
                                    var background_style;
                                    if (this.state.correct === undefined || this.state.correct === null) {
                                        background_style = this.styles.neutralAnswer;
                                    }
                                    else if (index === this.state.correct) {
                                        background_style = this.styles.correctAnswer;
                                    }
                                    else if (this.state.answerchoices.indexOf(this.state.sent) === index) {
                                        background_style = this.styles.wrongAnswer;
                                    }

                                    return (
                                        <FormControlLabel value={a} key={a} control={<Radio disabled={this.state.disabledInput} />} label={a} className={background_style}/>
                                    );
                                })}
                            </RadioGroup>
                        </FormControl>
                    </Grid>



                    <Grid container direction='row' justify="flex-end" className={this.styles.buttonContainer}>
                        <Button onClick={this.handleClick} disabled={this.state.disabled} value={this.state.answer} variant="contained" color="secondary">
                            {this.state.buttonText}
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
