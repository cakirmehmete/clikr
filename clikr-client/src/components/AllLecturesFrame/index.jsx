import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import CourseObj from '../../models/LectureObj';
import ListOfAllLectures from '../ListOfAllLectures';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteLecturesList from '../DeleteLecturesList';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = theme => ({
    card: {
        minWidth: 275,
    },
    icon: {
        margin: theme.spacing.unit,
    },
    title: {
        margin: theme.spacing.unit,
    }

});


@observer
class AllLecturesFrame extends React.Component {
    state = {
        toNewLecture: false,
        referrerLectureIndex: -1,
        parentCourse: new CourseObj(),
        numLects: undefined,
        deletions: [],
        deleteMode: false,
        delTitles: [], // only holds titles
        delIds: [],
        open: false
    }
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = props.apiProfService
        this.courseId = props.courseId
    }

    componentDidMount() {
        if (!this.profStore.dataLoaded) {
            this.apiProfService.loadData().then(() => {
                this.profStore.dataLoaded = true
                this.setState({
                    parentCourse: this.profStore.getCourseWithId(this.courseId)
                })
            })
        } else {
            this.setState({
                parentCourse: this.profStore.getCourseWithId(this.courseId)
            })
        }
    }

    componentDidUpdate() {
        if (this.state.parentCourse.id !== this.props.courseId) {
            if (!this.props.profStore.dataLoaded) {
                this.apiProfService.loadData().then(() => {
                    this.props.profStore.dataLoaded = true
                    this.setState({
                        parentCourse: this.profStore.getCourseWithId(this.props.courseId)
                    })
                })
            } else {
                this.setState({
                    parentCourse: this.profStore.getCourseWithId(this.props.courseId)
                })
            }
        }
    }

    // gets lectures to be deleted from child component
    getDeletions = (delLectures) => {
        this.setState({
            deletions: delLectures
        })
    }
    handleNewLectureClick = () => {
        this.setState(() => ({
            toNewLecture: true,
            numLects: this.profStore.getCourseLectures(this.courseId).length + 1
        }))
    }

    handleLectureClick = index => {
        this.setState(() => ({
            referrerLectureIndex: index
        }))
    }

    handleDelete = () => {
        if (!this.state.deleteMode) {
            this.setState({
                deleteMode: true,
            })
        }
        else {
            const lectArr = [];
            const delTitles = []
            for (let i = 0; i < this.state.deletions.length; i++) {
                if (this.state.deletions[i].checked) {
                    lectArr.push(this.state.deletions[i].id);
                    delTitles.push(this.state.deletions[i].title);
                }
            }
            if (lectArr.length > 0) {
                this.setState({
                    delTitles: delTitles,
                    delIds: lectArr,
                    open: true
                })
            }
            else {
                this.handleClose()
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
        this.apiProfService.deleteLectures(this.state.delIds, this.state.parentCourse.id);
        this.handleClose()
    };

    render() {
        // Handle routes
        if (this.state.toNewLecture === true) {
            return <Redirect to={{
                pathname: '/professor/' + this.courseId + '/new',
                state: { numLects: this.state.numLects }
            }} />
        } else if (this.state.referrerLectureIndex !== -1) {
            return <Redirect to={'/professor/' + this.state.referrerLectureIndex + '/questions'} push />
        }

        let list = <ListOfAllLectures courseId={this.state.parentCourse.id} profStore={this.profStore} apiProfService={this.apiProfService} />
        let deleteAction = "delete"

        if (this.state.deleteMode) {
            list = <DeleteLecturesList courseId={this.state.parentCourse.id} profStore={this.profStore} getDeletions={this.getDeletions} />
            deleteAction = "done"
        }

        return (
            <div>
                <Card className={this.props.classes.card}>
                    <CardContent>
                        <Grid container direction='row' justify='space-between' alignItems='stretch'>
                            <Grid item>
                                <Typography className={this.styles.title} variant="h6" color="inherit">Lectures for {this.state.parentCourse.title} </Typography>
                            </Grid>
                            <Grid item>
                                <Grid container direction="row" justify="flex-end">
                                    <Grid item>
                                        <Tooltip title={deleteAction} placement="top-start">
                                            <IconButton color="secondary" onClick={this.handleDelete.bind(this)}>
                                                {deleteAction === 'delete' ? <DeleteIcon /> : <DoneIcon />}
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item>
                                        <Button onClick={this.handleNewLectureClick} color="primary">
                                            <Icon className={this.styles.icon} color="primary">add_circle</Icon>
                                            Add Lecture
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        {list}
                    </CardContent>
                </Card>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete the folowing lecture(s): "}</DialogTitle>
                    <DialogContent>
                        {this.state.delTitles.map((title, index) =>
                            <DialogContentText key={index} id="alert-dialog-description">
                                {title}
                            </DialogContentText>

                        )}

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} autoFocus color="secondary">
                            no
                        </Button>
                        <Button onClick={this.handleFinalDeletion} color="secondary">
                            yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

AllLecturesFrame.propTypes = {
    courseId: PropTypes.string
};

export default withStyles(styles)(AllLecturesFrame);
