import React, { Component } from 'react';
import Header from '../../components/Student/LoggedinHeader';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CourseEnrollmentForm from '../../components/Student/CourseEnrollmentForm';

class StudentEnroll extends Component {

    render() {
        return (
            <Grid container direction='column' justify="center" spacing={Number("16")}>
                <Header />
                <Grid item>
                    <Paper style={{ paddingTop: "1%", paddingBottom: "1%" }}>
                        <Grid container direction="row" alignItems="flex-start" justify="space-between" style={{ paddingLeft: "1%", paddingRight: "2%" }}>
                            <Typography variant="h2" color="secondary"> Join Courses </Typography>
                        </Grid>
                        <CourseEnrollmentForm />
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}
export default StudentEnroll;