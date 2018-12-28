import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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
        this.question = this.store.getPrevQuestionWithId(this.props.questionId);
    }

    state = {
        correct: undefined,
        helperText: "",
    }

    componentDidMount() {
        var a =  this.question.correct_answer

        if (a !== undefined) {
            this.setState({
                correct: a
            });

            if (a === "" || a === null) {
                this.setState({
                    helperText: "Your Answer"
                });
            } else if (this.question.answer === a) {
                this.setState({
                    helperText: "Correct"
                });
            } else {
                this.setState({
                    helperText: "Correct Answer: " + a
                });
            }
        }
    }

    render() {
        var backgroundStyle;
        if (this.state.correct && this.state.correct !== "") {
            if (this.question.answer === this.state.correct) {
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
                                helperText={this.state.helperText}
                                name = 'answer'
                                value={this.question.answer}
                                fullWidth
                                disabled
                                className={backgroundStyle}
                            />
                        </Grid>
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
export default withStyles(styles)(PrevFRQ);
