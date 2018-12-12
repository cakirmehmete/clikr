import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import APIStudentService from '../../../services/APIStudentService';
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
    link: {
        color: "white",
        textDecoration: "none"
    },
    gridItem: {
        padding: theme.spacing.unit*2
    }
})
class CourseEnrollmentForm extends Component {

    constructor(props) {
        super(props)
        this.apiStudentService = new APIStudentService()
        this.styles = props.classes
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
            <Grid item className={this.styles.gridItem}>
                <form noValidate autoComplete="off">
                    <TextField

                        id="full-width"
                        helperText="Enter Course Enrollment Code"
                        name='code'
                        value={this.state.code}
                        onChange={e => this.handleChange(e)}
                        fullWidth
                    />
                </form>
                <Grid container justify="flex-end">
                    <Button onClick={this.handleClick} variant="contained" color="secondary">
                        <Link to='/student' onClick={this.forceUpdate} className={this.styles.link}>enroll</Link>
                    </Button>
                </Grid>
            </Grid>
        );
    }
}
export default withStyles(styles)(CourseEnrollmentForm);