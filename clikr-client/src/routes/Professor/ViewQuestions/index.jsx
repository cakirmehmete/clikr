import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { observer, inject } from 'mobx-react';
import { socketioURL } from '../../../constants/api';
import socketIOClient from 'socket.io-client'
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
@inject("apiService")
@observer
class ProfessorViewQuestions extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes

        this.state = {
            currentQuestionIndex: 0,
            currentQuestionId: 0,
            firstTime: false,
            parentLecture: { questions: [] }
        }
    }

    componentDidMount() {
        // Get the lecture
        this.props.apiService.loadData().then(() => {
            const { lectureId } = this.props.match.params
            this.setState({
                parentLecture: this.props.profStore.getLectureWithId(lectureId)
            })
        })

        socket.on('new results', (msg) => {
            var data = JSON.stringify(msg);
            // setting the color of our button
            console.log(data)
        })

        socket.on('server message', (msg) => {
            console.log('Received message:' + msg);
        });
    }

    send = () => {
        if (this.state.firstTime === false) {
            this.setState({ firstTime: 'true' });
            this.props.apiService.openQuestion(this.state.currentQuestionId)
            socket.emit('subscribe professor', this.state.currentQuestionId)
        } else {
            this.props.apiService.closeQuestion(this.state.currentQuestionId)
            this.props.apiService.openQuestion(this.state.currentQuestionId) // Should be the next question though!!
            socket.emit('subscribe professor', this.state.currentQuestionId) // Next Q here
            this.setState({ currentQuestionIndex: this.state.currentQuestionIndex + 1 });
        }
    }

    render() {
        return (
            <div>
                <Paper className={this.styles.root} elevation={1}>
                    <Typography variant="h6" component="h5" className={this.styles.text}>
                        {this.state.parentLecture.title} Lecture on {this.state.parentLecture.date}
                    </Typography>
                    <Typography variant="h4" component="h2" className={this.styles.textQ} align="center">
                        Q{this.state.currentQuestionIndex + 1}: {this.props.profStore.getQuestionWithId(this.state.parentLecture, this.state.currentQuestionId).question_text}
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={() => this.send()} className={this.styles.startLectureBtn}>
                        {this.state.firstTime === false ? "Start Lecture" : "Next Question"}
                    </Button>
                </Paper>
                <Grid container spacing={24} className={this.styles.grid}>
                    <Grid item xs={8}>
                        <AllQuestionsFrame parentLecture={this.state.parentLecture} />
                    </Grid>
                </Grid>
            </div>
        );
    }

    convertQuestionIndexToId(index) {
        return this.state.parentLecture.questions[index].id
    }
}

export default withStyles(styles)(ProfessorViewQuestions);