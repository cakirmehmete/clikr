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
        error: '',
        titleValid: false,
        correct_answer_valid: true,
    };

    constructor(props) {
        super(props)
        this.styles = props.classes
    }

    handleValidation(name, value) {
        switch(name) {
            case "title":
                if (this.state.title.replace(/^\s+|\s+$/g, '') === '') {
                    this.setState({
                        error: "This field is required",
                        titleValid: false,
                    })
                } else {
                    this.setState({
                        error: "",
                        titleValid: true,
                    });
                }
                break;
            case "correct_answer":
                if (this.state.correct_answer !== "") {
                    if (this.state.correct_answer.replace(/^\s+|\s+$/g, '') === '') {
                        this.setState({ correct_answer_valid: false })
                    }
                    else {
                        this.setState({ correct_answer_valid: true })
                    }
                }
                else {
                    if (!this.state.correct_answer_valid) this.setState({ correct_answer_valid: true })
                }
                break;
            default:
        }
        
    }

    handleChange = name => event => {
        let value = event.target.value;
        this.setState({
            [name]: value,
        }, () => { this.handleValidation(name, value) });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        if(this.state.titleValid) {
            const { lectureId } = this.props.match.params
    
            // Send course to API
            this.props.apiService.addQuestion(
                new FreeTextQuestionObj(null, lectureId, "free_text", this.state.title, this.state.correct_answer, null, null, null, null, null, null, null, '')
            )
    
            this.setState({ toQuestions: true });
        }
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
                <form className={this.styles.container} onSubmit={this.handleSubmit} noValidate autoComplete="off">
                    <TextField
                        required
                        error={!this.state.titleValid && !(this.state.error === "")}
                        label="Question Title"
                        className={this.styles.textField}
                        value={this.state.title}
                        onChange={this.handleChange('title')}
                        margin="normal"
                        helperText={this.state.error}
                    />
                    <TextField
                        label="Correct Answer"
                        className={this.styles.textField}
                        value={this.state.correct_answer}
                        onChange={this.handleChange('correct_answer')}
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        disabled={!this.state.titleValid || !this.state.correct_answer_valid}
                        variant="outlined"
                        color="primary"
                        onClick={this.handleSubmit}>Submit</Button>
                </form>
            </div>
        );
    }
}

export default withStyles(styles)(ProfessorAddFreeTextQuestion);
