
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
import { withStyles } from '@material-ui/core/styles';

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
class PrevMCQ extends Component {

    constructor(props) {
        super(props);
        this.store = this.props.store;
        this.styles = props.classes;
        this.apiStudentService = new APIStudentService(this.store);
        this.question = this.store.getPrevQuestionWithId(this.props.questionId);
    }

    componentDidMount() {

        var answers = []

        for (var i = 1; i <= this.question['number_of_options']; i++) {
            var qstring = this.question["option" + i.toString()];
            answers.push(qstring)
        }

        this.setState({
            answerchoices: answers
        });

        // compute correct answer
        var a =  this.question.correct_answer
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
        }
    }

    state = {
        answerchoices: [],
        correct: undefined,
    }

    render() {
        return (
            <div>
                <Paper className={this.styles.paper}>
                    <Grid container direction="column" className={this.styles.gridContainer}>

                        <Typography variant="h5" color="secondary"> {this.question.question_title} </Typography>
                        <FormControl component="fieldset">
                            <RadioGroup
                                name="answers"
                            >
                                {this.state.answerchoices.map((a, index) => {
                                    var background_style;
                                    if (this.state.correct === undefined || this.state.correct === null) {
                                        background_style = this.styles.neutralAnswer;
                                    }
                                    else if (index === this.state.correct) {
                                        background_style = this.styles.correctAnswer;
                                    }
                                    else if (parseInt(this.question.answer, 10)-1 === index) {
                                        background_style = this.styles.wrongAnswer;
                                    }

                                    return (
                                        <FormControlLabel value={a} key={a} control={<Radio disabled checked={index === parseInt(this.question.answer)-1} />} label={a} className={background_style}/>
                                    );
                                })}
                            </RadioGroup>
                        </FormControl>
                    </Grid>



                    <Grid container direction='row' justify="flex-end" className={this.styles.buttonContainer}>
                        <Button disabled variant="contained" color="secondary">
                            closed
                        </Button>
                    </Grid>
                </Paper>
            </div>


        );
    }
}
export default withStyles(styles)(PrevMCQ);
