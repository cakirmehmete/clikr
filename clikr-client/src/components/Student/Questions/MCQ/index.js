
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
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
import Typography from '@material-ui/core/Typography';

// for sliding up motion
function Transition(props) {
    return <Slide direction="up" {...props} />;
  }

@inject("store")
@observer    
class MCQ extends Component {
    
    constructor(props) {
        super(props)
        this.store = this.props.store
        this.apiStudentService = new APIStudentService(this.store)
    }
    componentDidMount () {
        
        var answers = []
        var mcq = this.store.getQuestionWithId(this.props.questionId);

        for (var i = 1; i <= mcq['number_of_options']; i++) {
            var qstring = mcq["option" + i.toString()];
            answers.push(qstring)
        }

        this.setState({
            answerchoices: answers
        })
    }

    state = {
        question:"What is the meaning of life?",
        answerchoices: [],
        answer: "",
        sent: "",
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
        if (this.state.sent === ""){
            this.handleSubmit()
        }
        else {
            this.setState({
                dialogue: true
            });
        }
    };

    handleDismiss = () => {
        this.store.removeQuestionById(this.props.questionId);
    }

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
        var button;
        var correct_answer_index = this.store.getQuestionWithId(this.props.questionId).correct_answer;
        var correct_answer = this.state.answerchoices[correct_answer_index-1];
        var answer_index = (this.state.answerchoices.indexOf(this.state.answer) + 1).toString();

        console.log('correct_answer=' + correct_answer_index);
        console.log('my answer=' + this.state.answer);

        // either submit button or dismiss button
        if (this.store.getQuestionWithId(this.props.questionId).correct_answer) {
            button = (
                <Button onClick={this.handleDismiss} variant="contained" color="secondary">
                    dismiss
                </Button>
            );
        } else {
            button = (
                <Button onClick={this.handleClick} disabled={this.state.disabled} value={this.state.answer} variant="contained" color="secondary">
                    submit
                </Button>
            );
        }

        return (
            <Grid item>
                <Grid container direction="column" justify="center" style={{padding:"1%"}}>
                    <FormControl component="fieldset">
                        <RadioGroup
                            name="answers"
                            value={this.state.answer}
                            onChange={this.handleChange}
                        >
                        {this.state.answerchoices.map(a => (
                            <FormControlLabel key={a} value={a} control={<Radio />} label={a}/>
                        ))}
                        </RadioGroup>
                    </FormControl>
                    <Grid container style={answer_index === correct_answer_index ? {backgroundColor: 'green'} : {backgroundColor: 'red'}}>
                        {this.store.getQuestionWithId(this.props.questionId).correct_answer && <Typography>Correct answer: {correct_answer}</Typography>}
                    </Grid>
                    <Grid container justify="flex-end" style={{"paddingRight":"1%"}}>
                        {button}
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
                </Grid>
            </Grid>
        );
    }
}
export default MCQ;