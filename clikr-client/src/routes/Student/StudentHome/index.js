import React, { Component } from 'react';
import ClassCard from '../../../components/Student/StudentClassCards';
import Header from '../../../components/Student/LoggedinHeader';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { observer, inject } from 'mobx-react';
import APIStudentService from '../../../services/APIStudentService';
import { withStyles } from '@material-ui/core/styles'
import AddCourseDialog from '../../../components/Student/AddCourseDialog';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import SocketIOStudentService from '../../../services/SocketIOStudentService';

const styles = theme => ({
    gridContainer: {
        margin: theme.spacing.unit,
    },
    gridItem: {
        padding: theme.spacing.unit,
    },
    paper: {
        padding: theme.spacing.unit*2,
    }
});

@inject("store")
@observer
class StudentHome extends Component {
    state = {
        course_ids: [],
        userName: "",
        showArchive: false
    }

    constructor(props) {
        super(props)
        this.store = props.store
        this.apiStudentService = new APIStudentService(this.store)
        this.styles = props.classes
        this.socketIOStudentService = new SocketIOStudentService(this.store);

        this.handleToggleArchive = this.handleToggleArchive.bind(this)
    }

    componentDidMount() {
        this.apiStudentService.getName()
            .then(name => {
                this.setState({ userName: name });
            })
    }
    
    componentWillReceiveProps() {
        this.apiStudentService.loadAllCourses()
    }
    
    handleToggleArchive() {
        this.setState(prevState => {
            return {
                ...prevState,
                showArchive: !prevState.showArchive
            }
        })
    }

    render() {
        var currentCourses = this.store.courses.filter(courseObj => {
            return courseObj.is_current
        })

        var archivedCourses = this.store.courses.filter(courseObj => {
            return !courseObj.is_current
        })

        var showString = this.state.showArchive ? "" : "Show"

        return (
            <Grid container direction='column' spacing={Number("16")}>
                <Header userName={this.state.userName} />
                <Grid item className={this.styles.gridItem}>
                    <Paper className={this.styles.paper}>
                        <Grid container direction="row" alignItems="flex-start" justify="space-between" className={this.styles.gridContainer}>
                            <Grid item xs={12} sm={10}>
                                <Typography variant="h2" color="secondary" className={this.styles.typeography}> My Classes </Typography>
                            </Grid>
                            <Grid item container justify="flex-end" xs={12} sm={2}>
                                <AddCourseDialog />      
                            </Grid>
                        </Grid>
                        <Grid container justify="center" alignItems="flex-end">
                            {currentCourses.map(function (courseObj, index) {
                                const colorIndex = index%4;
                                return (
                                    <ClassCard key={index} course={courseObj} id={courseObj.id} colorIndex={colorIndex}/>
                                );
                            })}
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item className={this.styles.gridItem} >
                    <Paper className={this.styles.paper}>
                        <Grid container direction="row" alignItems="flex-start" justify="space-between" className={this.styles.gridContainer}>
                            <Grid item xs={12} sm={10}>
                                <Typography variant="h2" color="secondary" className={this.styles.typeography}> {showString} Archived Courses </Typography>
                            </Grid>
                            <Grid item container justify="flex-end" xs={12} sm={2}>
                                <IconButton color="secondary" onClick={this.handleToggleArchive}>
                                    {this.state.showArchive ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                            </Grid>
                        </Grid>
                        <Collapse in={this.state.showArchive} timeout="auto" unmountOnExit>
                            <Grid container justify="center" alignItems="flex-end">
                                {archivedCourses.map(function (courseObj, index) {
                                    const colorIndex = index%4;
                                    return (
                                        <ClassCard key={index} course={courseObj} id={courseObj.id} colorIndex={colorIndex}/>
                                    );
                                })}
                            </Grid>
                        </Collapse>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}
export default withStyles(styles)(StudentHome);