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
import QuestionStats from '../../../components/QuestionStats';
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
    state = {
        currentQuestionIndex: 0,
            currentQuestionId: 0,
            openQuestionId: 0,
            btnStatus: 0,
            parentLecture: { questions: [] }
    }
    constructor(props) {
        super(props)
        this.styles = props.classes
    }

    componentDidMount() {
        // Get the lecture
        this.props.apiService.loadData().then(() => {
            const { lectureId } = this.props.match.params
            this.lectureId = lectureId
            this.setState({
                parentLecture: this.props.profStore.getLectureWithId(lectureId)
            })
            this.setState({
                currentQuestionId: this.convertQuestionIndexToId(this.state.currentQuestionIndex)
            })
        })
    }

    componentWillReceiveProps(nextProps) {
        const newParentLecture = nextProps.profStore.getLectureWithId(this.lectureId)
        console.log(newParentLecture)
        this.setState({
            parentLecture: newParentLecture,
            currentQuestionId: this.convertQuestionIndexToId(this.state.currentQuestionIndex)
        })
    
    }

    handleBtnClick = () => {
        switch (this.state.btnStatus) {
            case 0:
                if (!this.props.profStore.getQuestionWithId(this.state.parentLecture, this.state.currentQuestionId).is_open) {
                    // Handle the "Open Question"
                    console.log(this.state.currentQuestionId)
                    console.log(this.lectureId)
                    this.props.apiService.openQuestion(this.state.currentQuestionId, this.lectureId)
                    socket.emit('subscribe professor', this.state.currentQuestionId)
                    this.setState({ btnStatus: 1, openQuestionId: this.state.currentQuestionId })
                }
                break;

            case 1:
                // Handle the "Close Question"
                this.props.apiService.closeQuestion(this.state.currentQuestionId, this.lectureId)
                // Check if this is last question
                if (this.state.currentQuestionIndex + 1 >= this.state.parentLecture.questions.length)
                    this.setState({ btnStatus: 3, openQuestionId: 0 })
                else
                    this.setState({ btnStatus: 2, openQuestionId: 0 })
                break;

            case 2:
                // Handle the "Open Next Question"
                this.props.apiService.openQuestion(this.convertQuestionIndexToId(this.state.currentQuestionIndex + 1), this.lectureId)
                socket.emit('subscribe professor', this.convertQuestionIndexToId(this.state.currentQuestionIndex + 1))

                // Update the index to the next question
                this.setState({
                    btnStatus: 1,
                    currentQuestionIndex: this.state.currentQuestionIndex + 1,
                    currentQuestionId: this.convertQuestionIndexToId(this.state.currentQuestionIndex + 1),
                    openQuestionId: this.convertQuestionIndexToId(this.state.currentQuestionIndex + 1)
                })
                break;

            default:
                break;
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
                        Q{this.state.currentQuestionIndex + 1}: {this.props.profStore.getQuestionWithId(this.state.parentLecture, this.state.currentQuestionId).question_title}
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={() => this.handleBtnClick()} className={this.styles.startLectureBtn} disabled={this.state.btnStatus === 3}>
                        {this.state.btnStatus === 0 ? "Open Question" :
                            this.state.btnStatus === 1 ? "Close Question" :
                                this.state.btnStatus === 2 ? "Open Next Question" :
                                    "No More Questions"}
                    </Button>
                </Paper>
                <Grid container spacing={24} className={this.styles.grid}>
                    <Grid item xs={8}>
                        <AllQuestionsFrame parentLecture={this.state.parentLecture} selectedQuestionId={this.state.openQuestionId} />
                    </Grid>
                    <Grid item xs={4}>
                        <QuestionStats parentLecture={this.state.parentLecture} selectedQuestionId={this.state.openQuestionId} />
                    </Grid>
                </Grid>
            </div>
        );
    }

    convertQuestionIndexToId(index) {
        if (index < this.state.parentLecture.questions.length)
            return this.state.parentLecture.questions[index].id
        else
            return 0
    }
}

export default withStyles(styles)(ProfessorViewQuestions);
