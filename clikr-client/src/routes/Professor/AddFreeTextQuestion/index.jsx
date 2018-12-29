import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Redirect } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { observer, inject } from 'mobx-react';
import { FreeTextQuestionObj } from '../../../models/QuestionObj';

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
class ProfessorAddFreeTextQuestion extends React.Component {
    state = {
        toQuestions: false,
        title: '',
        correct_answer: '',
        word_limit: '',
        errors: {title:'', word_limit:''},
        formValid: false,
        titleValid: true,
        limitValid: true
    };

    constructor(props) {
        super(props)
        this.styles = props.classes
    }

    handleValidation(name, value) {
        let titleValid = this.state.titleValid;
        let limitValid = this.state.limitValid;
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
            case "word_limit":
                if (value === '') {
                    errors.word_limit = '';
                    limitValid = true
                }
                else if (isNaN(value)) {
                    errors.word_limit = "Should be a number";
                    limitValid = false
                }
                else if (value > 1000 || value < 1) {
                    errors.word_limit = "Out of range";
                    limitValid = false
                }
                else {
                    errors.word_limit = '';
                    limitValid = true
                }
                break;
            default:
                break;
        }
        if (this.state.title === '') {
            errors.title = "This field is required";
            titleValid = false
        }

        this.setState({ errors: errors,
                        titleValid: titleValid,
                        limitValid: limitValid }, this.validateForm);

    }

    validateForm() {
        this.setState({formValid: this.state.titleValid
                                    && this.state.limitValid});
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
            new FreeTextQuestionObj(null, lectureId, "free_text", this.state.title, this.state.correct_answer, null, null, null, null, null, null, null, this.state.word_limit)
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
                        margin="normal"
                        helperText={this.state.errors["title"]}
                    />
                    <TextField
                        id="standard-name"
                        label="Question Correct Answer"
                        className={this.styles.textField}
                        value={this.state.correct_answer}
                        onChange={this.handleChange('correct_answer')}
                        margin="normal"
                    />
                    <TextField
                        error={!this.state.limitValid}
                        id="standard-name"
                        label="Answer Word Limit"
                        className={this.styles.textField}
                        value={this.state.word_limit}
                        onChange={this.handleChange('word_limit')}
                        margin="normal"
                        helperText={this.state.errors["word_limit"]}
                    />
                    <Button
                        disabled={!this.state.formValid}
                        variant="outlined"
                        color="primary"
                        onClick={this.handleSubmit}>Submit</Button>
                </form>
            </div>
        );
    }
}

export default withStyles(styles)(ProfessorAddFreeTextQuestion);
