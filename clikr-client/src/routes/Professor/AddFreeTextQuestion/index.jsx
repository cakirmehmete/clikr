import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Redirect } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';
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
    item: {
        paddingBottom: theme.spacing.unit
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
        question_image_string: ''
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

    encodeImageFileAsURL = (event) => {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onloadend = () => {
          console.log('RESULT', reader.result);
          this.setState({ question_image_string: reader.result })
        }
        reader.onloadend = reader.onloadend.bind(this)
        reader.readAsDataURL(file);
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if(this.state.titleValid) {
            const { lectureId } = this.props.match.params
    
            // Send course to API
            this.props.apiService.addQuestion(
                new FreeTextQuestionObj(null, lectureId, "free_text", this.state.title, this.state.question_image_string, this.state.correct_answer, null, null, null, null, null, null, null, null, '')
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
                    <Grid container direction="column">
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

                        <Grid item className={this.styles.item}>
                            <Button
                                variant="contained"
                                component="label"
                            >
                            Upload Image
                            <input
                                type="file"
                                style={{ display: "none" }}
                                onChange={this.encodeImageFileAsURL}
                            />
                            </Button>
                        </Grid>

                        <Collapse in={this.state.question_image_string} timeout="auto" unmountOnExit>
                            <Grid item className={this.styles.item}>
                                <Typography variant="h6" color="textPrimary">
                                    Image Preview
                                </Typography>
                            </Grid>

                            <Grid item className={this.styles.item}>
                                <img src={this.state.question_image_string} height={300} alt="Preview Unavailable"></img>
                            </Grid>
                        </Collapse>

                        <Grid item className={this.styles.item}>
                            <Button
                                type="submit"
                                disabled={!this.state.titleValid || !this.state.correct_answer_valid}
                                variant="outlined"
                                color="primary"
                                onClick={this.handleSubmit}>
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        );
    }
}

export default withStyles(styles)(ProfessorAddFreeTextQuestion);
