import React, { Component } from 'react';
//import './style.css'; // Not our preferred way of importing style
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import colortheme from '../../constants/themes/colortheme';
import typeographytheme from '../../constants/themes/typographytheme';
import Header from '../../components/Student/LoggedinHeader';  
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CourseEnrollmentForm from '../../components/Student/CourseEnrollmentForm';

class StudentEnroll extends Component {

    render() {
        return (
            <MuiThemeProvider theme={typeographytheme}>
                <MuiThemeProvider theme={colortheme}>
                    <Grid container direction='column' justify="center" spacing={Number("16")}>
                        <Header/>
                            <Grid item>
                                <Paper style={{paddingTop:"1%", paddingBottom:"1%"}}>
                                        <Grid container direction="row" alignItems="flex-start" justify="space-between" style={{paddingLeft:"1%", paddingRight:"2%"}}>
                                            <Typography variant="h2" color="secondary"> Join Courses </Typography> 
                                        </Grid>
                                        
                                            <CourseEnrollmentForm/>
                                                                              
                                </Paper>
                            </Grid>
                    </Grid>
                </MuiThemeProvider>
            </MuiThemeProvider>
        );
    }
}
export default StudentEnroll;