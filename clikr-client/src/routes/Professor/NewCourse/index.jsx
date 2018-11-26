import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Redirect } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import APIProfService from '../../../services/APIProfService';
import { observer, inject } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import CourseObj from '../../../models/CourseObj';

const styles = theme => ({
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
});

@inject("profStore")
@observer
class ProfessorNewCourse extends React.Component {
    state = {
        toHome: false,
        name: '',
        coursenum: '',
        dept: ''
    };

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = new APIProfService(this.profStore)
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
            toHome: true
        });
    };

    handleSubmit = () => {
        // Send course to API
        this.apiProfService.addCourse(new CourseObj(this.state.name, this.state.coursenum, this.state.dept, null))
        // Close modal 
        this.setState({ open: false });
    }

    render() {
        if (this.state.toHome === true) {
            return <Redirect to='/professor' />
        }

        return (
            <div className={this.styles.paper}>
                <Typography variant="h6" color="textPrimary">
                    Add New Course:
                </Typography>
                <form className={this.styles.container} noValidate autoComplete="off">
                    <TextField
                        id="standard-name"
                        label="Course Name"
                        className={this.styles.textField}
                        value={this.state.name}
                        onChange={this.handleChange('name')}
                        margin="normal"
                    />
                    <TextField
                        id="standard-name"
                        label="Course Number"
                        className={this.styles.textField}
                        value={this.state.coursenum}
                        onChange={this.handleChange('coursenum')}
                        margin="normal"
                    />
                    <TextField
                        id="standard-name"
                        label="Course Dept"
                        className={this.styles.textField}
                        value={this.state.dept}
                        onChange={this.handleChange('dept')}
                        margin="normal"
                    />
                    <Button variant="outlined" color="primary" onClick={this.handleSubmit}>Submit</Button>
                </form>
            </div>
        );
    }
}

export default withStyles(styles)(ProfessorNewCourse);
