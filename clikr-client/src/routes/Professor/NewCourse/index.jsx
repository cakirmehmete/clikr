import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Redirect } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import APIProfService from '../../../services/APIProfService';
import { observer, inject } from 'mobx-react';
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
    subcontainer: {
        display: 'flex',
        direction: 'row',
        alignItems: 'flex-start'
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 400,
    },
});

@inject("profStore")
@observer
class ProfessorNewCourse extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = new APIProfService(this.profStore)

        this.state = {
            toHome: false,
            name: '',
            department: '',
            courseNumber: '',
            year: '',
            term: '',
            description: ''
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        const { name, value } = event.target
        this.setState({ [name]: value })
    }

    handleSubmit(event) {
        // Send course to API
        event.preventDefault()
        this.apiProfService.addCourse(
            new CourseObj(this.state.name, this.state.courseNumber, this.state.department,
                this.state.year, this.state.term, this.state.description)
        )
        // Close modal
        this.setState({ toHome: true });
    }


    // TODO: Make the year and term and Dept a drop down
    render() {
        if (this.state.toHome === true) {
            return <Redirect to='/professor' push />
        }

        return (
            <div className={this.styles.paper}>
                <Typography variant="h6" color="textPrimary">
                    Add New Course:
                </Typography>
                <form className={this.styles.container} onSubmit={this.handleSubmit} noValidate autoComplete="off">
                    <TextField
                        label="Course Name"
                        name="name"
                        className={this.styles.textField}
                        value={this.state.name}
                        onChange={this.handleChange}
                        margin="normal"
                    />

                    <TextField
                        label="Department"
                        name="department"
                        className={this.styles.textField}
                        value={this.state.department}
                        onChange={this.handleChange}
                        margin="normal"
                    />

                    <TextField
                        label="Course Number"
                        name="courseNumber"
                        className={this.styles.textField}
                        value={this.state.courseNumber}
                        onChange={this.handleChange}
                        margin="none"
                    />

                    <TextField
                        label="Year"
                        name="year"
                        className={this.styles.textField}
                        value={this.state.year}
                        onChange={this.handleChange}
                        margin="normal"
                    />

                    <TextField
                        label="Term"
                        name="term"
                        className={this.styles.textField}
                        value={this.state.term}
                        onChange={this.handleChange}
                        margin="none"
                    />

                    <TextField
                        label="Description"
                        name="description"
                        className={this.styles.textField}
                        value={this.state.description}
                        onChange={this.handleChange}
                        margin="normal"
                        multiline={true}
                    />

                    <Button
                        type="submit"
                        disabled={!this.state.name}
                        variant="outlined"
                        color="primary"
                        > submit
                    </Button>
                </form>
            </div>
        );
    }
}

export default withStyles(styles)(ProfessorNewCourse);
