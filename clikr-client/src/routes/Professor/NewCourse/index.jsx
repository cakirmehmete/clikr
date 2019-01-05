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
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 400,
    },
});

@inject("profStore")
@observer
class ProfessorNewCourse extends React.Component {
    state = {
        toHome: false,
        name: '',
        nameValid: false,
        formValid: true
    };

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = new APIProfService(this.profStore)
    }

    handleValidation(value) {
        let nameValid = this.state.nameValid;

        if (value === '') {
            nameValid = false
        }
        else {
            nameValid = true
        }

        this.setState({ nameValid: nameValid }, this.validateForm);
    }

    validateForm() {
        this.setState({formValid: this.state.nameValid });
    }

    handleChange = name => event => {
        let value = event.target.value;
        this.setState({
            [name]: value,
        }, () => { this.handleValidation(value) });
    };

    handleSubmit = (event) => {
        // Send course to API
        this.apiProfService.addCourse(
            new CourseObj(this.state.name)
        )
        // Close modal
        this.setState({ toHome: true });
        event.preventDefault();
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
                        id="standard-name"
                        label="Course Name"
                        className={this.styles.textField}
                        value={this.state.name}
                        onChange={this.handleChange('name')}
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        disabled={!this.state.nameValid}
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
