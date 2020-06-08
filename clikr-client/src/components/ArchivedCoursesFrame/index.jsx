import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { observer } from 'mobx-react';
import ListOfArchivedCourses from '../ListOfArchivedCourses';
import DeleteCoursesList from '../DeleteCoursesList';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';


const styles = theme => ({
    card: {
        minWidth: 275
    },
    icon: {
        margin: theme.spacing.unit,
    },
    title: {
        margin: theme.spacing.unit,
    },
    containerDiv: {
        paddingTop: theme.spacing.unit * 8
    }
});

@observer
class ArchivedCoursesFrame extends React.Component {
    state = {
        toNewCourse: false,
        deleteMode: false,
        deletions: [],
        delTitles: [], // only holds titles
        delIds: [],
        open: false,
        showArchive: false,
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = props.apiProfService
    }

    handleToggleArchive() {
        this.setState(prevState => {
            return {
                ...prevState,
                showArchive: !prevState.showArchive
            }
        })
    }

    // gets courses to be deleted from child component
    getDeletions = (delCourses) => {
        this.setState({
            deletions: delCourses
        })
    }

    handleDelete = () => {
        if (!this.state.deleteMode) {
            this.setState({
                deleteMode: true,
            })
        }
        else {
            const courseArr = [];
            const delTitles = []
            for (let i = 0; i < this.state.deletions.length; i++) {
                if (this.state.deletions[i].checked) {
                    courseArr.push(this.state.deletions[i].id);
                    delTitles.push(this.state.deletions[i].title);
                }
            }
            if (courseArr.length > 0) {
                this.setState({
                    delTitles: delTitles,
                    delIds: courseArr,
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
        this.apiProfService.deleteCourses(this.state.delIds);
        this.handleClose()
    };

    render() {
        // Handle routes
        if (this.state.toNewCourse === true) {
            return <Redirect to='/professor/new' push />
        }
        let list = <ListOfArchivedCourses profStore={this.profStore} apiProfService={this.apiProfService} />
        let deleteAction="delete"
        
        if (this.state.deleteMode) {
            list = <DeleteCoursesList profStore={this.profStore} getDeletions={this.getDeletions} archive={true} />
            deleteAction="done"
        }

        var titleString = this.state.showArchive ? "Archived Courses" : "Show Archived Courses"
        var delButton = ""
        if (this.state.showArchive) {
            delButton = deleteAction === 'delete' ? <DeleteIcon /> : <DoneIcon />
        } 

        return (
            <div className={this.props.classes.containerDiv} >
                <Card className={this.props.classes.card}>
                    <CardContent>
                        <Grid container direction='row' justify='space-between' alignItems='stretch'>
                            <Grid item>
                                <Grid container direction='row' >
                                    <Grid item>
                                        <Typography className={this.styles.title} variant="h6" color="inherit"> {titleString} </Typography>
                                    </Grid>
                                    <Grid item>
                                        <IconButton color="primary" onClick={this.handleToggleArchive.bind(this)}>
                                            {this.state.showArchive ? <ExpandLess /> : <ExpandMore />}
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                            
                            <Grid item>
                                <Grid container direction="row" justify="flex-end">
                                    <Grid item>
                                        <Tooltip title={deleteAction} placement="top">
                                            <IconButton color="secondary" onClick={this.handleDelete.bind(this)} >
                                                {delButton}
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>  
                            </Grid>
                        </Grid>

                        <Collapse in={this.state.showArchive} timeout="auto" unmountOnExit>
                            {list}
                        </Collapse>

                        <Dialog
                            open={this.state.open}
                            onClose={this.handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete the folowing course(s): "}</DialogTitle>
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
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default withStyles(styles)(ArchivedCoursesFrame);