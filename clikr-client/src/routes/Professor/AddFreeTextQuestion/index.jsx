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
        text: '',
        correct_answer: '',
        word_limit: ''
    };

    constructor(props) {
        super(props)
        this.styles = props.classes
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleSubmit = () => {
        const { lectureId } = this.props.match.params

        // Send course to API
        this.props.apiService.addQuestion(
            new FreeTextQuestionObj(null, lectureId, "free_text", this.state.title, this.state.text, this.state.correct_answer, null, null, null, null, null, null, this.state.word_limit)
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
                        id="standard-name"
                        label="Question Title"
                        className={this.styles.textField}
                        value={this.state.title}
                        onChange={this.handleChange('title')}
                        margin="normal"
                    />
                    <TextField
                        id="standard-name"
                        label="Question Text"
                        className={this.styles.textField}
                        value={this.state.text}
                        onChange={this.handleChange('text')}
                        margin="normal"
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
                        id="standard-name"
                        label="Answer Word Limit"
                        className={this.styles.textField}
                        value={this.state.word_limit}
                        onChange={this.handleChange('word_limit')}
                        margin="normal"
                    />
                    <Button variant="outlined" color="primary" onClick={this.handleSubmit}>Submit</Button>
                </form>
            </div>
        );
    }
}

export default withStyles(styles)(ProfessorAddFreeTextQuestion);
