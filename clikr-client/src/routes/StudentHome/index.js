import React, { Component } from 'react';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import colortheme from '../../constants/themes/colortheme';
import typeographytheme from '../../constants/themes/typographytheme';
import ClassCard from '../../components/Student/StudentClassCards';
import Header from '../../components/Student/LoggedinHeader';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AddCourseButton from '../../components/Student/Buttons/AddCourseButton';
import { observer, inject } from 'mobx-react';
import APIService from '../../services/APIService';

@inject("courseStore")
@observer
class StudentHome extends Component {
    constructor(props) {
        super(props)
        this.courseStore = props.courseStore
        this.apiService = new APIService(this.courseStore)
    }

    componentDidMount() {
        this.courseStore.loadCoursesStudent()
    }

    render() {
        return (
            <MuiThemeProvider theme={typeographytheme}>
                <MuiThemeProvider theme={colortheme}>
                    <Grid container direction='column' spacing={Number("16")}>
                        <Header />
                        <Grid item>
                            <Paper style={{ paddingTop: "1%", paddingBottom: "1%" }}>
                                <Grid container direction="row" alignItems="flex-start" justify="space-between" style={{ paddingLeft: "1%", paddingRight: "2%" }}>
                                    <Typography variant="h2" color="secondary"> My Classes </Typography>
                                    <AddCourseButton />
                                </Grid>
                                <Grid container justify="center" alignItems="flex-end" style={{ paddingTop: "1%" }}>
                                    {this.courseStore.courses.map(function (courseObj, index) {
                                        return (
                                            <ClassCard key={index} name={courseObj.title} number={courseObj.number} />
                                        );
                                    })}
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </MuiThemeProvider>
            </MuiThemeProvider>
        )
    }
}
export default StudentHome;