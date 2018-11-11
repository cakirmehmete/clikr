import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid';

class CourseEnrollmentForm extends Component {
    state = {
        code:""
    };
    handleChange = code => event => {
        this.setState({
          [code]: event.target.value,  
        });
    }
    handleClick = (e) => {
        console.log(this.state.code);
    }
    render() {
        return (
            <Grid item>
                <form noValidate autoComplete="off">
                    <TextField

                        id="full-width"
                        style={{width:"98%", paddingLeft:"1%"}}
                        helperText="Enter Course Enrollment Code"
                        onChange={this.handleChange}
                        margin="normal"  
                    />
                </form>
                <Grid container justify="flex-end" style={{"paddingRight":"1%"}}>
                    <Button onClick={this.handleClick} variant="contained" color="secondary">
                        <Link to='/student/dashboard' style={{"color":"white", "text-decoration": "none"}}>enroll</Link>
                    </Button>
                </Grid>
            </Grid>
        );
    }
}
export default CourseEnrollmentForm;