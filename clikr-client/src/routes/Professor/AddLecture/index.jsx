import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Redirect } from "react-router-dom";
import { inject } from 'mobx-react';
import LectureObj from '../../../models/LectureObj';

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

@inject("apiService")
class ProfessorAddLecture extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes

        const { courseId } = this.props.match.params
        this.state = {
            toLecture: false,
            title: '',
            date: '',
            courseId: courseId,
            errors: {title: ''},
            titleValid: true,
            formValid: false
        }
    }

    handleValidation() {
        let titleValid = this.state.titleValid;
        let errors = this.state.errors;

        if (this.state.title === '') {
            errors.title = "This field is required."
            titleValid = false
        }
        else {
            titleValid = true
        }

        this.setState({ titleValid: titleValid }, this.validateForm);
    }

    validateForm() {
        this.setState({formValid: this.state.titleValid });
    }


    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        }, () => { this.handleValidation() });
    };

    handleSubmit = () => {
        // Send course to API
        this.props.apiService.addLecture(
            new LectureObj(this.state.title, this.state.date, null, this.state.courseId)
        )

        this.setState({ toLecture: true });
    }

    render() {
        if (this.state.toLecture === true) {
            return <Redirect to={'/professor/' + this.state.courseId + '/lectures'} push />
        }

        return (
            <div className={this.styles.paper}>
                <Typography variant="h6" color="textPrimary">
                    Add New Lecture:
                </Typography>
                <form className={this.styles.container} noValidate autoComplete="off">
                    <TextField
                        required
                        error={!this.state.titleValid}
                        id="standard-name"
                        label="Lecture Title"
                        className={this.styles.textField}
                        value={this.state.title}
                        onChange={this.handleChange('title')}
                        margin="normal"
                        helperText={this.state.errors["title"]}
                    />
                    <TextField
                        id="standard-name"
                        label="Lecture Date"
                        className={this.styles.textField}
                        value={this.state.date}
                        onChange={this.handleChange('date')}
                        margin="normal"
                    />
                    <Button
                        disabled={!this.state.formValid}
                        variant="outlined"
                        color="primary"
                        onClick={this.handleSubmit}>
                            Submit
                    </Button>
                </form>
            </div>
        );
    }
}

export default withStyles(styles)(ProfessorAddLecture);
