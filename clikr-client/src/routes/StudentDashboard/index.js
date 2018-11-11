import React, { Component } from 'react';
//import './style.css'; // Not our preferred way of importing style
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import colortheme from '../../constants/Themes/colortheme';
import typeographytheme from '../../constants/Themes/typeographytheme';
import ClassCardStudent from '../../components/ClassCards/ClassCardStudent';
import LoggedInHeader from '../../components/Header/LoggedInHeader';  
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import StudentAddCourseButton from '../../components/StudentAddCourseButton';

class StudentDashboard extends Component {

    render() {
        return (
            <MuiThemeProvider theme={typeographytheme}>
                <MuiThemeProvider theme={colortheme}>
                    <Grid container direction='column' spacing={Number("16")}>
                        <LoggedInHeader/>
                        <Grid item>
                            <Paper style={{paddingTop:"1%", paddingBottom:"1%"}}>
                                    <Grid container direction="row" alignItems="flex-start" justify="space-between" style={{paddingLeft:"1%", paddingRight:"2%"}}>
                                        <Typography variant="h2" color="secondary"> My Classes </Typography> 
                                        <StudentAddCourseButton/>
                                    </Grid>
                                    <Grid container justify="center" alignItems="flex-end" style={{paddingTop:"1%"}}>
                                        <ClassCardStudent/>
                                    </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </MuiThemeProvider>
            </MuiThemeProvider>
        );
    }
}
export default StudentDashboard;
