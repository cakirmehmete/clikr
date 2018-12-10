import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Redirect } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { observer, inject } from 'mobx-react';
import APIProfService from '../../../services/APIProfService';
import { MultipleChoiceQuestionObj } from '../../../models/QuestionObj';

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
@inject("apiService")
@observer
class ProfessorAddMCQuestion extends React.Component {
    state = {
        toQuestions: false,
        title: '',
        correct_answer: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        option5: '',
        number_of_options: 1,
        errors: {title:'', correct_answer:'', number_of_options:"Will display first 1 option(s)"},
        formValid: false,
        titleValid: true,
        correctValid: true,
        optionsValid: true
    };

    constructor(props) {
        super(props)
        this.styles = props.classes
    }

    handleValidation(name, value) {
        let titleValid = this.state.titleValid;
        let correctValid = this.state.correctValid;
        let optionsValid = this.state.optionsValid;
        let number_of_options = this.state.number_of_options;
        let errors = this.state.errors;

        switch(name) {
            case "title":
                if (value === '') {
                    errors.title = "This field is required";
                    titleValid = false
                }
                else {
                    errors.title = '';
                    titleValid = true
                }
                break;
            case "correct_answer":
                if (isNaN(value)) {
                    errors.correct_answer = "Should be a number";
                    correctValid = false
                }
                else if (value === '') {
                    errors.correct_answer = '';
                    correctValid = true
                }
                else if (value > 5 | value < 1) {
                    errors.correct_answer = "Should be between 1-5";
                    correctValid = false
                }
                else if (value === '1' && this.state.option1 === '') {
                    errors.correct_answer = "No value given for option 1";
                    correctValid = false
                }
                else if (value === '2' && this.state.option2 === '') {
                    errors.correct_answer = "No value given for option 2";
                    correctValid = false
                }
                else if (value === '3' && this.state.option3 === '') {
                    errors.correct_answer = "No value given for option 3";
                    correctValid = false
                }
                else if (value === '4' && this.state.option4 === '') {
                    errors.correct_answer = "No value given for option 4";
                    correctValid = false
                }
                else if (value === '5' && this.state.option5 === '') {
                    errors.correct_answer = "No value given for option 5";
                    correctValid = false
                }
                else {
                    errors.correct_answer = '';
                    correctValid = true
                }
                break;
            case "option1":
                if (this.state.correct_answer === '1') {
                    if (value === '') {
                        errors.correct_answer = "No value given for option 1";
                        correctValid = false
                    }
                    else {
                        errors.correct_answer = '';
                        correctValid = true
                    }
                }
                break;
            case "option2":
                if (this.state.correct_answer === '2') {
                    if (value === '') {
                        errors.correct_answer = "No value given for option 2";
                        correctValid = false
                    }
                    else {
                        errors.correct_answer = '';
                        correctValid = true
                    }
                }
                break;
            case "option3":
                if (this.state.correct_answer === '3') {
                    if (value === '') {
                        errors.correct_answer = "No value given for option 3";
                        correctValid = false
                    }
                    else {
                        errors.correct_answer = '';
                        correctValid = true
                    }
                }
                break;
            case "option4":
                if (this.state.correct_answer === '4') {
                    if (value === '') {
                        errors.correct_answer = "No value given for option 4";
                        correctValid = false
                    }
                    else {
                        errors.correct_answer = '';
                        correctValid = true
                    }
                }
                break;
            case "option5":
                if (this.state.correct_answer === '5') {
                    if (value === '') {
                        errors.correct_answer = "No value given for option 5";
                        correctValid = false
                    }
                    else {
                        errors.correct_answer = '';
                        correctValid = true
                    }
                }
                break;
            case "number_of_options":
                if (value === '') {
                    errors.number_of_options = "This field is required";
                    optionsValid = false
                }
                else if (value > 5 | value < 1) {
                    errors.number_of_options = "Should be between 1-5";
                    optionsValid = false
                }
                else {
                    errors.number_of_options = "Will display first " + value + " option(s)";
                    optionsValid = true
                }
                break;
        }

        if (this.state.title === '') {
            errors.title = "This field is required";
            titleValid = false
        }

        this.setState({ errors: errors,
                        titleValid: titleValid,
                        correctValid: correctValid,
                        optionsValid: optionsValid,
                        number_of_options: number_of_options}, this.validateForm);
    }

    validateForm() {
        this.setState({formValid: this.state.titleValid
                                    && this.state.correctValid
                                    && this.state.optionsValid
                                    && this.state.number_of_options > 0 });
    }


    handleChange = name => event => {
        let value = event.target.value;
        this.setState({
            [name]: value,
        }, () => { this.handleValidation(name, value) });
    };

    handleSubmit = () => {
        const { lectureId } = this.props.match.params

        // Send course to API
        this.props.apiService.addQuestion(
            new MultipleChoiceQuestionObj(null,
                lectureId, "multiple_choice",
                this.state.title, this.state.correct_answer,
                null, null, null, null, null, null,
                this.state.option1, this.state.option2, this.state.option3, this.state.option4, this.state.option5,
                this.state.number_of_options)
        )

        this.setState({ toQuestions: true });
    }

    render() {
        const { lectureId } = this.props.match.params

        if (this.state.toQuestions === true) {
            return <Redirect to={'/professor/' + lectureId + '/questions'} push />
        }

        return (
            <div className={this.styles.paper}>
                <Typography variant="h6" color="textPrimary">
                    Add New Question:
                </Typography>
                <form className={this.styles.container} noValidate autoComplete="off">
                    <TextField
                        required
                        error={!this.state.titleValid}
                        id="standard-name"
                        label="Question Title"
                        className={this.styles.textField}
                        value={this.state.title}
                        onChange={this.handleChange('title')}
                        margin="dense"
                        helperText={this.state.errors["title"]}
                    />
                    <TextField
                        id="standard-name"
                        label="Question Option 1"
                        className={this.styles.textField}
                        value={this.state.option1}
                        onChange={this.handleChange('option1')}
                        margin="normal"
                    />
                    <TextField
                        id="standard-name"
                        label="Question Option 2"
                        className={this.styles.textField}
                        value={this.state.option2}
                        onChange={this.handleChange('option2')}
                        margin="normal"
                    />
                    <TextField
                        id="standard-name"
                        label="Question Option 3"
                        className={this.styles.textField}
                        value={this.state.option3}
                        onChange={this.handleChange('option3')}
                        margin="normal"
                    />
                    <TextField
                        id="standard-name"
                        label="Question Option 4"
                        className={this.styles.textField}
                        value={this.state.option4}
                        onChange={this.handleChange('option4')}
                        margin="normal"
                    />
                    <TextField
                        id="standard-name"
                        label="Question Option 5"
                        className={this.styles.textField}
                        value={this.state.option5}
                        onChange={this.handleChange('option5')}
                        margin="normal"
                    />
                    <TextField
                        error={!this.state.correctValid}
                        id="standard-name"
                        label="Question Correct Answer"
                        className={this.styles.textField}
                        value={this.state.correct_answer}
                        onChange={this.handleChange('correct_answer')}
                        margin="normal"
                        helperText={this.state.errors["correct_answer"]}
                    />
                    <TextField
                        required
                        error={!this.state.optionsValid}
                        id="standard-required"
                        label="Question # of Options"
                        className={this.styles.textField}
                        value={this.state.number_of_options}
                        onChange={this.handleChange('number_of_options')}
                        margin="normal"
                        helperText={this.state.errors["number_of_options"]}
                    />
                </form>
                <div>
                    <Button
                        disabled={!this.state.formValid}
                        variant="outlined"
                        color="primary"
                        onClick={this.handleSubmit}>
                            Submit
                    </Button>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(ProfessorAddMCQuestion);
