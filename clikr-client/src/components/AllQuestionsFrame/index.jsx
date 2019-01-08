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

@inject('profStore')
@inject("apiService")
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
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
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

    handleFinalDeletion = () => {

        for (let i = 0; i < this.state.delIds.length; i++) {
            var question = this.props.parentLecture.questions.find(q => q.id === this.state.delIds[i]);
            if (question && question.is_open) {
                this.props.apiService.closeQuestion(this.state.delIds[i], this.props.parentLecture.id);
                this.props.handleListClose(this.state.delIds[i]);
            }
        }
        
        this.props.apiService.deleteQuestions(this.state.delIds, this.props.parentLecture.id);
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
                    <Grid container direction='row' justify='space-between' alignItems='stretch'>
                        <Grid item>
                            <Typography className={this.styles.title} variant="h6" color="inherit">
                                Questions for {this.props.parentLecture.title + " Lecture"}
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
                                    <AddQuestionModalWrapped lectureId={this.props.parentLecture.id} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    {this.state.deleteMode ? 
                    (<DeleteQuestionsList questions={this.props.parentLecture.questions} getDeletions={this.getDeletions}/>)
                    : 
                    (<List component="nav">
                        {this.props.parentLecture.questions.slice().sort(function (a, b) {
                            if (a.created_at < b.created_at) {
                                return -1;
                            }
                            if (a.created_at > b.created_at) {
                                return 1;
                            }
                            // a must be equal to b
                            return 0;
                        }).map((questionObj, index) => {
                            return (<QuestionListItem number={index} mode={this.state.mode} handleListClose={this.props.handleListClose} handleClick={this.props.handleClick} parentLecture={this.props.parentLecture} questionObj={questionObj} key={index} openQuestion={this.props.selectedQuestionId} />
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
                        <Button onClick={this.handleFinalDeletion} color="secondary">
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