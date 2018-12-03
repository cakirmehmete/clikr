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
        text: '',
        correct_answer: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        option5: '',
        number_of_options: ''
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
            new MultipleChoiceQuestionObj(null, lectureId, "multiple_choice", this.state.title, this.state.text, this.state.correct_answer, null, null, null, null, null, null, this.state.option1, this.state.option2, this.state.option3, this.state.option4, this.state.option5, this.state.number_of_options)
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
                        id="standard-name"
                        label="Question # of Options"
                        className={this.styles.textField}
                        value={this.state.number_of_options}
                        onChange={this.handleChange('number_of_options')}
                        margin="normal"
                    />
                    <Button variant="outlined" color="primary" onClick={this.handleSubmit}>Submit</Button>
                </form>
            </div>
        );
    }
}

export default withStyles(styles)(ProfessorAddMCQuestion);
