import React, { Component } from 'react';
//import './style.css'; // Not our preferred way of importing style
import Header from '../../../components/Student/LoggedinHeader';
import Paper from '@material-ui/core/Paper';
import { socketioURL } from '../../../constants/api';
import socketIOClient from 'socket.io-client'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import APIStudentService from '../../../services/APIStudentService';
import { observer, inject } from 'mobx-react';
import FRQ from '../../../components/Student/Questions/FRQ';
import MCQ from '../../../components/Student/Questions/MCQ';

@inject("store")
@observer
class QuestionPage extends Component {
    state = {
        has_question: false,
    }

    constructor(props) {
        super(props)
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
                has_question: true
            })
        })

        socket.on('question closed', (msg) => {
            this.store.removeQuestionById(msg.question.id)

            if (this.store.questions.length == 0) {
                this.setState({
                    has_question: false
                })
            }
        })

        socket.on('all open questions', (data) => {
            console.log(data.questions)
            if (data.questions.length > 0) {
                this.store.updateAllQuestions(data.questions)
                this.setState({
                    has_question: true
                })
            }
        })

        socket.on('server message', (msg) => {
            console.log('Received message:' + msg);
        });
    }

    render() {
        return (
            <Grid container direction='column' spacing={Number("16")}>
                <Header />
                {this.state.has_question == false ? (
                    <Paper style={{ paddingTop: "1%", paddingBottom: "1%" }}>
                        <Typography variant="h5" color="secondary" style={{ width: "98%", paddingLeft: "1%", paddingRight: "1%" }}> There are no questions for this course at the moment... </Typography>
                    </Paper>
                ) : (
                        this.store.questions.map(q => {
                            if (q.question_type === 'free_text') {
                                return (
                                    <Grid item>
                                        <Paper style={{ paddingTop: "1%", paddingBottom: "1%" }}>
                                            <Typography variant="h5" color="secondary" style={{ width: "98%", paddingLeft: "1%", paddingRight: "1%" }}> {q.question_text} </Typography>
                                            <FRQ question={{ question: q }} />
                                        </Paper>
                                    </Grid>

                                )
                            }
                            else {
                                return (
                                    <Grid item>
                                        <Paper style={{ paddingTop: "1%", paddingBottom: "1%" }}>
                                            <Typography variant="h5" color="secondary" style={{ width: "98%", paddingLeft: "1%", paddingRight: "1%" }}> {q.question_text} </Typography>
                                            <MCQ questionId={q.id} />
                                        </Paper>
                                    </Grid>
                                )
                            }

                        })
                    )}

            </Grid>
        )

    }
}
export default QuestionPage;