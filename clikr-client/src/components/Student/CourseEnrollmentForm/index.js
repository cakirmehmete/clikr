import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import APIStudentService from '../../../services/APIStudentService';

class CourseEnrollmentForm extends Component {

    constructor(props) {
        super(props)
        this.apiStudentService = new APIStudentService()
    }

    state = {
        code: ""
    }
    handleClick = (e) => {
        this.apiStudentService.enrollCourse(this.state.code)
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {

        return (
            <Grid item>
                <form noValidate autoComplete="off">
                    <TextField

                        id="full-width"
                        style={{ width: "98%", paddingLeft: "1%" }}
                        helperText="Enter Course Enrollment Code"
                        name='code'
                        value={this.state.code}
                        onChange={e => this.handleChange(e)}
                        margin="normal"
                    />
                </form>
                <Grid container justify="flex-end" style={{ "paddingRight": "1%" }}>
                    <Button onClick={this.handleClick} variant="contained" color="secondary">
                        <Link to='/student' onClick={this.forceUpdate} style={{ "color": "white", "textDecoration": "none" }}>enroll</Link>
                    </Button>
                </Grid>
            </Grid>
        );
    }
}
export default CourseEnrollmentForm;