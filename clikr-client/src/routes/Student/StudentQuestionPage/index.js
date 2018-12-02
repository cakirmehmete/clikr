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
    constructor(props) {
        super(props)
        this.store = this.props.store
        this.apiStudentService = new APIStudentService(this.store)
    }

    componentDidMount() {
        const { course_id } = this.props.location.state.course_id
        this.apiStudentService.loadAllQuestions(course_id)
        const socket = socketIOClient(socketioURL)

        // this emits an event to the socket (your server) with an argument of 'red'
        // you can make the argument any color you would like, or any kind of data you want to send.

        socket.emit('subscribe student', course_id)
        // socket.emit('change color', 'red', 'yellow') | you can have multiple arguments

        // socket.on is another method that checks for incoming events from the server
        // This method is looking for the event 'change color'
        // socket.on takes a callback function for the first argument
        socket.on('question opened', (data) => {
            this.store.updateAllQuestions([data.question])
        })

        socket.on('question closed', (msg) => {
            var data = JSON.stringify(msg);
            // setting the color of our button
            console.log("Closed Question")
        })

        socket.on('all open questions', (data) => {
            console.log(data.questions)
            this.store.updateAllQuestions(data.questions)
        })

        socket.on('server message', (msg) => {
            console.log('Received message:' + msg);
        });
    }

    state = {
        has_question: false,
        question_text: "This course has no open questions at the moment ...",
        question_type: ""
    }
    render() {
        return (
            <Grid container direction='column' spacing={Number("16")}>
                <Header />
                {this.store.questions.map(q => {
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
                                    <MCQ question={{ question: q }} />
                                </Paper>
                            </Grid>
                        )
                    }

                })}

            </Grid>
        )

    }
}
export default QuestionPage;