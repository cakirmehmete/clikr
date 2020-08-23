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
            title: '',
            dept: '',
            num: '',
            year: '',
            term: '',
            description: '',
            formValid: false,
            yearValid: false,
            titleValid: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleValidation() {
        var titleValid = true;
        var yearValid = true;

        if (this.state.title === '' ) {
            titleValid = false;
        }

        if (isNaN(this.state.year)) {
            yearValid = false;
        }

        this.setState({titleValid: titleValid, yearValid: yearValid, formValid: titleValid && yearValid})
    }

    handleChange(event) {
        const { name, value } = event.target
        this.setState({ [name]: value }, () => { this.handleValidation() })
    }

    handleSubmit(event) {
        // Send course to API
        event.preventDefault()
        this.apiProfService.addCourse(
            new CourseObj(this.state)
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
                        name="title"
                        error={!this.state.titleValid}
                        helperText="Course must have a title"
                        className={this.styles.textField}
                        value={this.state.title}
                        onChange={this.handleChange}
                        margin="normal"
                    />

                    <TextField
                        label="Department"
                        name="dept"
                        className={this.styles.textField}
                        value={this.state.dept}
                        onChange={this.handleChange}
                        margin="normal"
                    />

                    <TextField
                        label="Course Number"
                        name="num"
                        className={this.styles.textField}
                        value={this.state.num}
                        onChange={this.handleChange}
                        margin="none"
                    />

                    <TextField
                        label="Year"
                        name="year"
                        error={!this.state.yearValid}
                        helperText="Year must be an integer"
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
                        disabled={!this.state.formValid}
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
