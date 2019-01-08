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
        course_ids: []
    }

    constructor(props) {
        super(props)
        this.store = props.store
        this.apiStudentService = new APIStudentService(this.store)
        this.styles = props.classes
        this.socketIOStudentService = new SocketIOStudentService(this.store);
        
    }
    
    componentWillReceiveProps() {
        this.apiStudentService.loadAllCourses()
    }
    
    render() {
        return (
           
            <Grid container direction='column' spacing={Number("16")}>
                <Header />
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
                            {this.store.courses.map(function (courseObj, index) {
                                const colorIndex = index%4;
                                return (
                                    <ClassCard key={index} name={courseObj.title} id={courseObj.id} colorIndex={colorIndex}/>
                                );
                            })}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}
export default withStyles(styles)(StudentHome);