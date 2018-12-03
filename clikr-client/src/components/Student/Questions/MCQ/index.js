import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import APIStudentService from '../../../../services/APIStudentService'
import { observer, inject } from 'mobx-react';

@inject("store")
@observer
class MCQ extends Component {

    constructor(props) {
        super(props)
        this.store = this.props.store
        this.apiStudentService = new APIStudentService(this.store)
    }
    
    componentDidMount() {

        var answers = []

        var mcq = this.props.question.question
        for (var i = 1; i <= mcq['number_of_options']; i++) {
            var qstring = mcq["option" + i.toString()];
            answers.push(qstring)
        }
        this.setState({
            answerchoices: answers
        })
    }

    state = {
        question: "What is the meaning of life?",
        answerchoices: [],
        answer: "",
        disabled: false
    }
    handleChange = (e) => {
        this.setState({
            answer: e.target.value
        });
    }
    handleClick = (e) => {
        this.apiStudentService.postAnswer(this.state.answer, this.props.question.question.id)
        this.setState({
            disabled: true
        })
    }

    render() {
        return (
            <Grid item>
                <Grid container direction="column" justify="center" style={{ padding: "1%" }}>
                    <FormControl component="fieldset">
                        <RadioGroup
                            name="answers"
                            value={this.state.answer}
                            onChange={this.handleChange}
                        >
                            {this.state.answerchoices.map(a => (
                                <FormControlLabel value={a} control={<Radio />} label={a} />
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <Grid container justify="flex-end" style={{ "paddingRight": "1%" }}>
                        <Button onClick={this.handleClick} disabled={this.state.disabled} value={this.state.answer} variant="contained" color="secondary">
                            submit
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}
export default MCQ;