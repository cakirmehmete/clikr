import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { observer } from 'mobx-react';
import ListOfAllCourses from '../ListOfAllCourses';
import DeleteCoursesList from '../DeleteCoursesList';
import Icon from '@material-ui/core/Icon';
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
class AllCoursesFrame extends React.Component {
    state = {
        toNewCourse: false,
        deleteMode: false,
        deletions: [],
        delTitles: [], // only holds titles
        delIds: [],
        open: false
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = props.apiProfService
    }

    // gets courses to be deleted from child component
    getDeletions = (delCourses) => {
        this.setState({
            deletions: delCourses
        })
    }
    handleNewCourseClick = () => {
        this.setState(() => ({
            toNewCourse: true
        }))
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
        let list = <ListOfAllCourses profStore={this.profStore} apiProfService={this.apiProfService} />
        let deleteAction="Delete"
        
        if (this.state.deleteMode) {
            list = <DeleteCoursesList profStore={this.profStore} getDeletions={this.getDeletions} archive={false} />
            deleteAction="Done"
        }

        return (
            <div>
                <Card className={this.props.classes.card}>
                    <CardContent>
                        <Grid container direction='row' justify='space-between' alignItems='stretch'>
                            <Grid item>
                                <Typography className={this.styles.title} variant="h6" color="inherit"> Courses </Typography>
                            </Grid>
                            <Grid item>
                                <Grid container direction="row" justify="flex-end">
                                    <Grid item>
                                        <Tooltip title={deleteAction} placement="top">
                                            <IconButton color="secondary" onClick={this.handleDelete.bind(this)}>
                                                {deleteAction === 'Delete' ? <DeleteIcon /> : <DoneIcon />}
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item>
                                        <Button onClick={this.handleNewCourseClick} color="primary">
                                            <Icon className={this.styles.icon} color="primary">add_circle</Icon>
                                            Add Course
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
                    <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete the following course(s): "}</DialogTitle>
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

export default withStyles(styles)(AllCoursesFrame);