import React, { Component } from 'react';
import ClassCard from '../../components/Student/StudentClassCards';
import Header from '../../components/Student/LoggedinHeader';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AddCourseButton from '../../components/Student/Buttons/AddCourseButton';
import { observer, inject } from 'mobx-react';
import APIStudentService from '../../services/APIStudentService';

@inject("store")
@observer
class StudentHome extends Component {
    constructor(props) {
        super(props)
        this.store = props.store
        this.apiStudentService = new APIStudentService(this.store)
    }

    componentDidMount() {
        this.apiStudentService.loadAllCourses()
    }

    render() {
        return (
            <Grid container direction='column' spacing={Number("16")}>
                <Header />
                <Grid item>
                    <Paper style={{ paddingTop: "1%", paddingBottom: "1%" }}>
                        <Grid container direction="row" alignItems="flex-start" justify="space-between" style={{ paddingLeft: "1%", paddingRight: "2%" }}>
                            <Typography variant="h2" color="secondary"> My Classes </Typography>
                            <AddCourseButton />
                        </Grid>
                        <Grid container justify="center" alignItems="flex-end" style={{ paddingTop: "1%" }}>
                            {this.store.courses.map(function (courseObj, index) {
                                return (
                                    <ClassCard key={index} name={courseObj.title} number={courseObj.number} />
                                );
                            })}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}
export default StudentHome;