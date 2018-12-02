import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { observer, inject } from 'mobx-react';
import { socketioURL } from '../../../constants/api';
import socketIOClient from 'socket.io-client'
import APIProfService from '../../../services/APIProfService';
import Typography from '@material-ui/core/Typography';
import AllQuestionsFrame from '../../../components/AllQuestionsFrame';
const socket = socketIOClient(socketioURL)

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 7,
        backgroundColor: '#3C4252',
    },
    grid: {
        paddingTop: theme.spacing.unit * 2,
    },
    text: {
        color: '#ffffff'
    },
    textQ: {
        color: '#ffffff',
        paddingTop: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 10,
        paddingLeft: theme.spacing.unit * 10,
        paddingBottom: theme.spacing.unit * 2
    },
    startLectureBtn: {
        float: "right"
    }
});

@inject("profStore")
@observer
class ProfessorViewQuestions extends React.Component {
    state = {
        currentQuestionIndex: 0,
        firstTime: false
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = new APIProfService(this.profStore)
    }

    send = () => {
        if (this.state.firstTime === false) {
            this.setState({ firstTime: 'true' });
            this.apiProfService.openQuestion(this.profStore.getQuestionWithIndex(this.state.currentQuestionIndex).id)
            socket.emit('subscribe professor', this.profStore.getQuestionWithIndex(this.state.currentQuestionIndex).id)
        } else {
            this.apiProfService.closeQuestion(this.profStore.getQuestionWithIndex(this.state.currentQuestionIndex).id)
            this.apiProfService.openQuestion(this.profStore.getQuestionWithIndex(this.state.currentQuestionIndex + 1).id)
            socket.emit('subscribe professor', this.profStore.getQuestionWithIndex(this.state.currentQuestionIndex + 1).id)
            this.setState({ currentQuestionIndex: this.state.currentQuestionIndex + 1 });
        }
    }

    componentDidMount() {
        socket.on('new results', (msg) => {
            var data = JSON.stringify(msg);
            // setting the color of our button
            console.log(data)
        })

        socket.on('server message', (msg) => {
            console.log('Received message:' + msg);
        });
    }

    render() {
        return (
            <div>
                <Paper className={this.styles.root} elevation={1}>
                    <Typography variant="h6" component="h5" className={this.styles.text}>
                        {this.profStore.getLectureWithId(this.profStore.lecture_id).title} Lecture on {this.profStore.getLectureWithId(this.profStore.lecture_id).date}
                    </Typography>
                    <Typography variant="h4" component="h2" className={this.styles.textQ} align="center">
                        Q{this.state.currentQuestionIndex + 1}: {this.profStore.getQuestionWithIndex(this.state.currentQuestionIndex).question_text}
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={() => this.send()} className={this.styles.startLectureBtn}>
                        {this.state.firstTime === false ? "Start Lecture" : "Next Question"}
                    </Button>
                </Paper>
                <Grid container spacing={24} className={this.styles.grid}>
                    <Grid item xs={8}>
                        <AllQuestionsFrame profStore={this.profStore} apiProfService={this.apiProfService} />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(ProfessorViewQuestions);
