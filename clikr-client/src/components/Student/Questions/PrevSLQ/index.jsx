import React, { Component } from 'react';
import Slider from '@material-ui/lab/Slider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { observer, inject } from 'mobx-react';
import APIStudentService from '../../../../services/APIStudentService'
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    gridContainer: {
        margin: theme.spacing.unit,
    },
    labels: {
        wordBreak:"break-word", 
        fontFamily:"sans-serif", 
        fontSize:"1em", 
        display:"flex", 
        justifyContent:"center",
        color: "#424242"
    },
    percentContainer: {
        paddingRight: theme.spacing.unit*3
    },
    titleWrap: {
        wordBreak:"break-word", 
        fontFamily:"sans-serif", 
        fontSize:"1.5em", 
        display:"flex", 
        color: theme.palette.secondary.main
    },
    card: {
        backgroundColor: "gray",
        padding: theme.spacing.unit*0.25,
        width: 45
    },
    gridItem: {
        paddingTop: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        width: "98%"
    },
    paper: {
        padding: theme.spacing.unit,
    },
    correctAnswer: {
        backgroundColor: theme.palette.primary.light,
        paddingTop: theme.spacing.unit*2
        
    },
    wrongAnswer: {
        backgroundColor: theme.palette.primary.dark,
        paddingTop: theme.spacing.unit*2
    },
    neutralAnswer: {
        paddingTop: theme.spacing.unit*2
    },
    textField: {
		fontSize: 50
	}
});

@inject("store")
@observer
class PrevSLQ extends Component {

    constructor(props) {
        super(props);
        this.store = props.store;
        this.styles = props.classes;
        this.apiStudentService = new APIStudentService(this.store);
        this.question = null;
        this.answer = -1;
        this.helperText = "";
        
    }

    // helper method to see if answer is correct
    operatorToComparison(response, operator, answer) {
        let correct = false;
        switch(operator) {
            case "<":
                correct = response < answer;
                break;
            case "<=":
                correct = response <= answer;
                break;
            case ">":
                correct = response > answer;
                break;
            case ">=":
                correct = response >= answer;
                break;
            default:
                correct = response === answer;
        } 
        return correct;
    }
    
    // check if answer is correct
    checkAnswer(correct_answer, answer) {
        if (correct_answer === null) return true;
        const expression = correct_answer.split(" ");
        if (expression.length === 2) {
            return this.operatorToComparison(Number(answer), expression[0], Number(expression[1]))
        }
        else {
            const exp1 = this.operatorToComparison(Number(answer), expression[0], Number(expression[1]))
            const exp2 = this.operatorToComparison(Number(answer), expression[3], Number(expression[4]))
            if (expression[2] === "&&") return exp1 && exp2;
            return exp1 || exp2;
        }
    }

    // helper method for function that turns answer into a more readable form 
    operatorToWord(operator) {
        let string = "equals";
        switch(operator) {
            case "<":
                string = "is less than";
                break;
            case "<=":
                string = "is less than or equal to";
                break;
            case ">":
                string = "is greater than";
                break;
            case ">=":
                string = "is greater than or equal to";
                break;
            case "||":
                string = "or";
                break;
            case "&&":
                string = "and";
                break;
            default:
                string = "equals";
        } 
        return string;
    }

    // turn the answer into a more readable form
    getAnswerText(answer) {
        if (answer === null) {
            return "";
        }
        const expression = answer.split(" ");
        if (expression.length === 2) {
            return "answer " + this.operatorToWord(expression[0]) + " " +  expression[1] + "%";
        }
        else {
            return "answer " + this.operatorToWord(expression[0]) + " " +  expression[1] + "% " + this.operatorToWord(expression[2]) + " " + this.operatorToWord(expression[3]) + " " + expression[4] + "%";
        }
    }

    render() {

        // fetch question data
        if (this.props.isLast) {
            this.question = this.store.lastQuestion;
            if (this.store.lastAnswer !== null) {
                this.answer = Number(this.store.lastAnswer);
            } 
        } else {
            this.question = this.store.getPrevQuestionWithId(this.props.questionId);
            if (this.question.answer !== null) {
                this.answer = Number(this.question.answer);
            }   
        }
        
        // background style
        var correct = this.checkAnswer(this.question.correct_answer, this.answer);
        var backgroundStyle;
        if (correct) {
            if (this.question.correct_answer !== "" && this.question.correct_answer !== null) {
                backgroundStyle = this.styles.correctAnswer;
            } else {
                backgroundStyle = this.styles.neutralAnswer;
            }
        } else {
            backgroundStyle = this.styles.wrongAnswer;
        }

        // helper text
        if (this.question.correct_answer === "" || this.question.correct_answer === null) {
            this.helperText = "Your Answer: " + this.answer.toString() + "%"
        } else if (correct) {
            this.helperText = "Correct"
        } else {
            this.helperText = "Correct Answer: " + this.getAnswerText(this.question.correct_answer) 
        }

        return (
            <div>
                <Paper className={this.styles.paper}>
                    <Grid container direction="column" justify="space-between" className={this.styles.gridContainer}>
                        <Grid item>
                            <Grid container direction="row" justify="space-between" alignItems="flex-start" spacing={16}>
                                <Grid item xs>
                                    <div className={this.styles.titleWrap}> {this.question.question_title} </div>
                                </Grid>
                                <Grid item xs={4}>
                                    <Grid container justify="flex-end" direction="row" className={this.styles.percentContainer}>
                                        <Card className={this.styles.card}>
                                            <Typography align="center" className={this.styles.whiteTypography}>
                                                {this.answer.toString() + " "}%
                                            </Typography>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container direction="column" className={this.styles.gridItem}>
                            <Grid container direction="column" justify="space-evenly" className={backgroundStyle}>
                                <Grid container direction="row" justify="center" alignItems="center" spacing={24}>
                                    <Grid item xs>
                                        <Grid container justify="center">
                                            <div className={this.styles.labels}>{this.question.lower_label}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Slider
                                            disabled
                                            value={this.answer}
                                            min={0}
                                            max={100}
                                            step={1}
                                            aria-labelledby="label"
                                        />
                                    </Grid>
                                    <Grid item xs>
                                        <Grid container justify="center">
                                            <div className={this.styles.labels}>{this.question.upper_label}</div>
                                        </Grid>
                                    </Grid>
                                </Grid> 
                                <Grid container direction="row" >
                                    <TextField
                                        id="correctAnswer"
                                        helperText={this.helperText}
                                        fullWidth
                                        disabled
                                    />
                                </Grid>
                            </Grid> 
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        );
    }
}
export default withStyles(styles)(PrevSLQ);
