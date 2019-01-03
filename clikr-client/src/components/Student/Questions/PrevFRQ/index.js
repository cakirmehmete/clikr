import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { observer, inject } from 'mobx-react';
import APIStudentService from '../../../../services/APIStudentService'
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    gridContainer: {
        margin: theme.spacing.unit,
    },
    gridItem: {
        paddingRight: theme.spacing.unit*2,
    },
    buttonContainer: {
        padding: theme.spacing.unit*1.5,
    },
    correctAnswer: {
        backgroundColor: theme.palette.primary.light,
    },
    wrongAnswer: {
        backgroundColor: theme.palette.primary.dark,
    },
    neutralAnswer: {
    },
    paper: {
        padding: theme.spacing.unit,
    },
});

@inject("store")
@observer
class PrevFRQ extends Component {

    constructor(props) {
        super(props);
        this.store = this.props.store;
        this.styles = props.classes;
        this.apiStudentService = new APIStudentService(this.store);
        this.question = null;
        this.answer = "";
        this.correct = null;
        this.helperText = "";
    }

    

    render() {
        if (this.props.isLast) {
            this.question = this.store.lastQuestion;
            if (this.store.lastAnswer !== null) {
                this.answer = this.store.lastAnswer;
            } 
        } else {
            this.question = this.store.getPrevQuestionWithId(this.props.questionId);
            if (this.question.answer !== null) {
                this.answer = this.question.answer;
            }   
        }

        // correct answer
        var a =  this.question.correct_answer
        if (a !== undefined) {
            this.correct = a;

            if (a === "" || a === null) {
                this.helperText = "Your Answer: "
            } else if (this.answer === a) {
                this.helperText = "Correct"
            } else {
                this.helperText = "Correct Answer: " + a
            }
        }

        var backgroundStyle;
        if (this.correct && this.correct !== "") {
            if (this.answer === this.correct) {
                backgroundStyle = this.styles.correctAnswer;
            } else {
                backgroundStyle = this.styles.wrongAnswer;
            }
        } else {
            backgroundStyle = this.styles.neutralAnswer;
        }
    
        return (
            <div>
                <Paper className={this.styles.paper}>
                    <Grid container direction="column" className={this.styles.gridContainer}>
                        <Typography variant="h5" color="secondary"> {this.question.question_title} </Typography>
                        <Grid item className={this.styles.gridItem}>
                            <TextField
                                id="full-width"
                                helperText={this.helperText}
                                name = 'answer'
                                value={this.answer}
                                fullWidth
                                disabled
                                className={backgroundStyle}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        );
    }
}
export default withStyles(styles)(PrevFRQ);
