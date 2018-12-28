import React, { Component } from 'react';
//import './style.css'; // Not our preferred way of importing style
import Header from '../../../components/Student/LoggedinHeader';
import Paper from '@material-ui/core/Paper';
import { socketioURL } from '../../../constants/api';
import socketIOClient from 'socket.io-client'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import APIStudentService from '../../../services/APIStudentService';
import { observer, inject } from 'mobx-react';
import FRQ from '../../../components/Student/Questions/FRQ';
import MCQ from '../../../components/Student/Questions/MCQ';
import PrevMCQ from '../../../components/Student/Questions/PrevMCQ';
import PrevFRQ from '../../../components/Student/Questions/PrevFRQ';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    gridContainer: {
        padding: theme.spacing.unit,
    },
    gridItem: {
        padding: theme.spacing.unit,
    },
    paper: {
        padding: theme.spacing.unit,
    }

});

@inject("store")
@observer
class QuestionPage extends Component {
    state = {
        number_of_open_questions: 0,
        show_previous_questions: false,
        show_last_question: false,
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.store = this.props.store
        this.apiStudentService = new APIStudentService(this.store)
    }

    componentDidMount() {
        const { course_id } = this.props.location.state
        const socket = socketIOClient(socketioURL)

        // this emits an event to the socket (your server) with an argument of 'red'
        // you can make the argument any color you would like, or any kind of data you want to send.

        socket.emit('subscribe student', course_id)
        // socket.emit('change color', 'red', 'yellow') | you can have multiple arguments

        // socket.on is another method that checks for incoming events from the server
        // This method is looking for the event 'change color'
        // socket.on takes a callback function for the first argument
        socket.on('question opened', (data) => {
            this.store.addOneQuestion(data.question)
            this.setState({
                // has_question: true,
                number_of_open_questions: this.state.number_of_open_questions + 1,
                show_previous_questions: false,
            });
        })

        socket.on('question closed', (msg) => {
            this.store.updateOneQuestion(msg.question);
            this.setState({
                number_of_open_questions: this.state.number_of_open_questions - 1,
                show_previous_questions: false,
                show_last_question: true,
            });
            this.store.updateLastQuestion(msg.question);
        })

        socket.on('all open questions', (data) => {
            console.log(data.questions);
            var num_questions = data.questions.length;
            this.store.updateAllQuestions(data.questions);
            this.setState({
                number_of_open_questions: num_questions,
                show_previous_questions: false,
            });
        })

        socket.on('server message', (msg) => {
            console.log('Received message:' + msg);
        });
    }

    handleClick = () => {
        const { course_id } = this.props.location.state;

        if (!this.state.show_previous_questions) {
            this.apiStudentService.loadAllPrevQuestions(course_id);
            this.setState({
                show_previous_questions: true,
                show_last_question: false,
            });
        } else {
            this.setState({
                show_previous_questions: false,
            }); 
        }
    };

    render() {
        return (
            <Grid container direction='column' spacing={Number("16")}>
                <Header />
                <Grid className={this.styles.gridContainer}>
                    {this.state.number_of_open_questions === 0 ? (
                        <Paper className={this.styles.paper}>
                            <Typography variant="h5" color="secondary"> There are no questions for this course at the moment... </Typography>
                        </Paper>
                    ) : null} 
                </Grid>
                <Grid className={this.styles.gridContainer}>
                    {this.store.questions.map(q => {
                        if (q.question_type === 'free_text') {
                            return (
                                <Grid item className={this.styles.gridItem} key={q.id}>
                                    <FRQ questionId={q.id} />
                                </Grid>

                            )
                        }
                        else {
                            // TODO: handle slider and drag-and-drop questions!
                            return (
                                <Grid item className={this.styles.gridItem} key={q.id}>
                                    <MCQ questionId={q.id} />
                                </Grid>
                            )
                        }

                    })}

                </Grid>
                <Grid className={this.styles.gridContainer}>
                    <Paper className={this.styles.paper}>
                        <Typography variant="h5" color="secondary"> {this.state.show_last_question ? "Recently Closed" : "Previous Questions"} </Typography>
                        {this.state.show_last_question ? (
                            <Grid className={this.styles.gridContainer}>
                                {this.store.lastQuestion !== null ? (
                                    this.store.lastQuestion.question_type === "multiple_choice" ? (
                                        <PrevMCQ isLast={true} />
                                    ) : (
                                        <PrevFRQ isLast={true} />
                                    ) // TODO: handle new question types
                                ) : (
                                    <Typography color="secondary"> None. </Typography>
                                )} 
                            </Grid>
                        ) : null}
                        <Grid className={this.styles.gridContainer}>
                            <Button onClick={this.handleClick} variant="outlined" color="secondary">
                                {this.state.show_previous_questions ? "Hide Previous Questions" : "Show All Previous Questions"}
                            </Button>
                        </Grid>
                        <Grid >
                            {this.state.show_previous_questions ? (
                                this.store.prevQuestions.length > 1 ? (
                                    this.store.prevQuestions.map(q => {
                                        if (q.question_type === 'free_text') {
                                            return (
                                                <Grid item className={this.styles.gridItem} key={q.id}>
                                                    <PrevFRQ questionId={q.id} />
                                                </Grid>
            
                                            )
                                        }
                                        else {
                                            // TODO: handle slider and drag-and-drop questions!
                                            return (
                                                <Grid item className={this.styles.gridItem} key={q.id}>
                                                    <PrevMCQ questionId={q.id}/>
                                                </Grid>
                                            )
                                        }
            
                                    })) : 
                                    <Typography color="secondary"> There are no previous questions </Typography>
                                ) : null}
                        </Grid>
                    </Paper>
                </Grid>
                

            </Grid>
        );

    }
}
export default withStyles(styles)(QuestionPage);