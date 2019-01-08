import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { observer, inject } from 'mobx-react';
import AddQuestionModalWrapped from '../AddQuestionModal';
import QuestionListItem from '../QuestionListItem';
import PropTypes from 'prop-types';
// import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteQuestionsList from '../DeleteQuestionsList';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LectureObj from '../../models/LectureObj';

const styles = theme => ({
    card: {
        minWidth: 275,
    },
    startLectureBtn: {
        float: "right"
    },
    title: {
        margin: theme.spacing.unit,
    },
});

@observer
class AllQuestionsFrame extends React.Component {
    state = {
        toNewQuestion: false,
        deleteMode: false,
        editMode: false,
        mode: "viewing",
        deletions: [],
        delTitles: [],
        open: false,
        parentLecture: new LectureObj(),
        lectureTitle: "",
        questions: [],
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = props.apiProfService
        this.parentLectureId = props.parentLectureId
    }

    componentDidMount() {
        console.log("mounting")
         if (!this.profStore.dataLoaded) {
             this.apiProfService.loadData().then(() => {
                 console.log("loading data")
                 this.profStore.dataLoaded = true
                 const lecture = this.profStore.getLectureWithId(this.parentLectureId);
                    this.setState({
                        parentLecture: lecture,
                        questions: lecture.questions
                    })
                })
            } else {
            const lecture = this.profStore.getLectureWithId(this.parentLectureId);
            this.setState({
                parentLecture: lecture,
                questions: lecture.questions
            })
         }
    }

    componentWillReceiveProps(nextProps) {
        const nextLecture = nextProps.profStore.getLectureWithId(nextProps.parentLectureId);
        if (nextLecture.questions.length === this.state.questions.length) {
            this.setState({
                parentLecture: nextLecture,
                questions: nextLecture.questions
            })
        }
    }
    
    

    handleNewQuestionClick = () => {
        this.setState(() => ({
            toNewQuestion: true
        }))
    }

    handleDeleteQuestions = () => {  
        this.setState({ mode: "deleteMode", deleteMode: true, editMode: false }); 
    }

    handleEditQuestions = () => {
        this.setState({ mode: "editMode", deleteMode: false, editMode: true });
    }

    handleRestoreMode = () => {
        this.setState({ mode: "viewingMode", deleteMode: false, editMode: false });
    }

     // gets questions to be deleted from child component
     getDeletions = (delQuestions) => {
        this.setState({
            deletions: delQuestions
        })
    }

    handleDelete = () => {
        if (!this.state.deleteMode) {
            this.setState({
                deleteMode: true,
            })
        }
        else {
            const qArr = [];
            const delTitles = []
            for (let i = 0; i < this.state.deletions.length; i++) {
                if (this.state.deletions[i].checked) {
                    qArr.push(this.state.deletions[i].id);
                    delTitles.push(this.state.deletions[i].title);
                }
            }
            if (qArr.length > 0) {
                this.setState({
                    delTitles: delTitles,
                    delIds: qArr,
                    open: true
                })
            }
            else {
                this.handleClose()
                this.handleRestoreMode();
            }
        }

    }

    handleClose = () => {
        this.setState({
            deleteMode: false,
            open: false,
            delIds: [],
            delTitles: [],
            deletions: [],
        });
    };

    handleDeletion = () => {

        this.props.handleFinalDeletion(this.state.delIds)
        this.handleClose()
    };

    render() {
        // Handle routes
        if (this.state.toNewQuestion === true) {
            return <Redirect to='/professor/TODO' push />
        }

        return (
            <Card className={this.styles.card}>
                <CardContent>
                    {console.log(this.state.parentLecture)}
                    <Grid container direction='row' justify='space-between' alignItems='stretch'>
                        <Grid item>
                            <Typography className={this.styles.title} variant="h6" color="inherit">
                                Questions for {this.state.parentLecture.title + " Lecture"}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Grid container direction="row" justify="flex-end">
                                {/* <Grid item>
                                    {this.state.editMode ? (
                                    <Tooltip title={"done editing"} placement="top-start">
                                        <IconButton color="secondary" onClick={this.handleRestoreMode}>
                                            <DoneIcon />
                                        </IconButton>
                                    </Tooltip>
                                    ) : (
                                    <Tooltip title={"edit questions"} placement="top-start">
                                        <IconButton color="secondary" onClick={this.handleEditQuestions}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    )}    
                                </Grid> */}
                                <Grid item>
                                {this.state.deleteMode ? (
                                    <Tooltip title={"done deleting"} placement="top-start">
                                        <IconButton color="secondary" onClick={this.handleDelete.bind(this)} disabled={this.state.mode === "viewingMode" || this.state.mode === "editMode"}>
                                            <DoneIcon />
                                        </IconButton>
                                    </Tooltip>
                                    ) : (
                                    <Tooltip title={"delete questions"} placement="top-start">
                                        <IconButton color="secondary" onClick={this.handleDeleteQuestions}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                    )}
                                </Grid>
                                <Grid item>
                                    <AddQuestionModalWrapped lectureId={this.state.parentLecture.id} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    {this.state.deleteMode ? 
                    (<DeleteQuestionsList questions={this.state.questions} getDeletions={this.getDeletions}/>)
                    : 
                    (<List component="nav">
                        {this.state.questions.slice().sort(function (a, b) {
                            if (a.created_at < b.created_at) {
                                return -1;
                            }
                            if (a.created_at > b.created_at) {
                                return 1;
                            }
                            // a must be equal to b
                            return 0;
                        }).map((questionObj, index) => {
                            return (<QuestionListItem number={index} mode={this.state.mode} handleListClose={this.props.handleListClose} profStore={this.profStore} handleClick={this.props.handleClick} parentLectureId={this.state.parentLecture.id} parentLecture={this.state.parentLecture} questionObj={questionObj} key={index} openQuestion={this.props.selectedQuestionId} />
                            )
                        })}
                    </List>)
                    }
                </CardContent>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete the folowing question(s): "}</DialogTitle>
                    <DialogContent>
                        {this.state.delTitles.map((title, index) =>
                            <DialogContentText key={index} id="alert-dialog-description">
                                {title}
                            </DialogContentText>

                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDeletion} color="secondary">
                            yes
                        </Button>
                        <Button onClick={this.handleClose} autoFocus color="secondary">
                            no
                        </Button>
                    </DialogActions>
                </Dialog>
            </Card>
        );
    }
}

AllQuestionsFrame.propTypes = {
    parentLecture: PropTypes.object
};

export default withStyles(styles)(AllQuestionsFrame);