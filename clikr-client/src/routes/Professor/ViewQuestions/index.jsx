import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { observer, inject } from 'mobx-react';
import { socketioURL } from '../../../constants/api';
import socketIOClient from 'socket.io-client'
import Typography from '@material-ui/core/Typography';
import AllQuestionsFrame from '../../../components/AllQuestionsFrame';
import MCQuestionStats from '../../../components/MCQuestionStats';
import FreeTextStats from '../../../components/FreeTextStats';
import SliderStats from '../../../components/SliderStats';

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
        this.lectureId = null
        this.state = {
            currentQuestionIndex: 0,
            currentQuestionId: 0,
            openQuestionId: 0,
            btnStatus: 0,
            parentLecture: { questions: [] },
            mounted: true,
            lectureId: 0
        }
    }

    componentDidMount() {
        // Get the lecture
        if (!this.props.profStore.dataLoaded) {
            this.props.apiService.loadData().then(() => {
                this.props.profStore.dataLoaded = true
                if (this.state.mounted) {
                    const { lectureId } = this.props.match.params
                    this.lectureId = lectureId
                    this.setState({
                        parentLecture: this.props.profStore.getLectureWithId(lectureId),
                        lectureId
                    })
                    this.setState({
                        currentQuestionId: this.convertQuestionIndexToId(this.state.currentQuestionIndex)
                    })
                }
            })
        } else {
            if (this.state.mounted) {
                const { lectureId } = this.props.match.params
                this.lectureId = lectureId
                this.setState({
                    parentLecture: this.props.profStore.getLectureWithId(lectureId),
                    lectureId: this.props.match.params.lectureId
                })
                this.setState({
                    currentQuestionId: this.convertQuestionIndexToId(this.state.currentQuestionIndex)
                })
            }
        }
    }

    componentWillUnmount() {
        // close all questions in this lecture
        this.props.apiService.closeAllQuestions(this.lectureId)
        this.setState({
            mounted: false
        })
    }

    handleBtnClick = () => {
        switch (this.state.btnStatus) {
            case 0:
                if (!this.props.profStore.getQuestionWithId(this.state.parentLecture, this.convertQuestionIndexToId(this.state.currentQuestionIndex)).is_open) {
                    // Handle the "Open Question"

                    this.props.apiService.openQuestion(this.convertQuestionIndexToId(this.state.currentQuestionIndex), this.state.parentLecture.id)
                    socket.emit('subscribe professor', this.convertQuestionIndexToId(this.state.currentQuestionIndex))
                    this.setState({ btnStatus: 1, openQuestionId: this.convertQuestionIndexToId(this.state.currentQuestionIndex), currentQuestionId: this.convertQuestionIndexToId(this.state.currentQuestionIndex) })
                }
                break;

            case 1:
                // Handle the "Close Question"
                this.props.apiService.closeQuestion(this.state.currentQuestionId, this.state.parentLecture.id)
                // Check if this is last question
                if (this.state.currentQuestionIndex + 1 >= this.state.parentLecture.questions.length)
                    this.setState({ btnStatus: 3, openQuestionId: 0 })
                else
                    this.setState({ btnStatus: 2, openQuestionId: 0 })
                break;

            case 2:
                // Handle the "Open Next Question"
                this.props.apiService.openQuestion(this.convertQuestionIndexToId(this.state.currentQuestionIndex + 1), this.state.parentLecture.id)
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

    handleListClick = (question_id) => {
        // Update the index to the next question
        this.setState({
            btnStatus: 1,
            currentQuestionIndex: this.convertQuestionIdToIndex(question_id),
            currentQuestionId: question_id,
            openQuestionId: question_id
        })
    }

    handleListClickClose = (question_id) => {
        // Update the index to the next question
        if (this.state.currentQuestionIndex + 1 >= this.state.parentLecture.questions.length)
            this.setState({ btnStatus: 3, openQuestionId: 0 })
        else
            this.setState({
                btnStatus: 2,
                openQuestionId: 0
            })
    }

    render() {
        return (
            <div>
                <Paper className={this.styles.root} elevation={1}>
                    <Typography variant="h6" component="h5" className={this.styles.text}>
                        {this.state.parentLecture.title} Lecture on {this.state.parentLecture.date}
                    </Typography>
                    <Typography variant="h4" component="h2" className={this.styles.textQ} align="center">
                        Q{this.convertQuestionIdToIndex(this.state.currentQuestionId) + 1}: {this.props.profStore.getQuestionWithId(this.state.parentLecture, this.state.currentQuestionId).question_title}
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={() => this.handleBtnClick()} className={this.styles.startLectureBtn} disabled={this.state.btnStatus === 3}>
                        {this.state.btnStatus === 0 ? "Open Question " + (this.convertQuestionIdToIndex(this.state.currentQuestionId) + 1) :
                            this.state.btnStatus === 1 ? "Close Question " + (this.convertQuestionIdToIndex(this.state.currentQuestionId) + 1) :
                                this.state.btnStatus === 2 ? "Open Question " + (this.convertQuestionIdToIndex(this.state.currentQuestionId) + 2) :
                                    "No More Questions"}
                    </Button>
                </Paper>
                <Grid container spacing={24} className={this.styles.grid}>
                    <Grid item xs={12} md={8}>
                        <AllQuestionsFrame handleListClose={this.handleListClickClose} handleClick={this.handleListClick} parentLecture={this.state.parentLecture} selectedQuestionId={this.state.openQuestionId} />
                    </Grid>
                    <Grid item xs={12} sm={9} md={4}>
                        <List>
                            {(this.props.profStore.getLectureWithId(this.state.lectureId).questions).map((questionObj, index) => {
                                if (questionObj.question_type === "multiple_choice")
                                    return (<MCQuestionStats key={index} parentLecture={this.state.parentLecture} selectedQuestionId={questionObj.id} />)
                                else if (questionObj.question_type === "free_text")
                                    return (<FreeTextStats key={index} parentLecture={this.state.parentLecture} selectedQuestionId={questionObj.id} />)
                                else if (questionObj.question_type === "slider")
                                    return (<SliderStats key={index} parentLecture={this.state.parentLecture} selectedQuestionId={questionObj.id} />)

                                // Something went wrong
                                return (null)
                            })}
                        </List>
                    </Grid>
                </Grid>
            </div>
        );
    }

    convertQuestionIndexToId(index) {
        if (index < this.state.parentLecture.questions.length) {
            return this.state.parentLecture.questions[index].id;
        }

        else {
            return 0;
        }

    }

    convertQuestionIdToIndex(question_id) {
        for (var i = 0; i < this.state.parentLecture.questions.length; i++) {
            if (this.state.parentLecture.questions[i].id === question_id)
                return i;
        }
        return 0;
    }
}

export default withStyles(styles)(ProfessorViewQuestions);
