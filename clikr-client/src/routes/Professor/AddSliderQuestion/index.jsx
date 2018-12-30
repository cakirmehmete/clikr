import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Redirect } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { observer, inject } from 'mobx-react';
import { SliderQuestionObj } from '../../../models/QuestionObj';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Slider from '@material-ui/lab/Slider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
    gridItem: {
        paddingRight: theme.spacing.unit*6,
        paddingBottom: theme.spacing.unit*4,
    },
    card: {
        width: 50,
        padding: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    percentText: {
        color: "white",
    },
    limits: {
        maxWidth: 50,
    },
    titleField: {
        width: 400
    },
    sliderContainer: {
        width: 400,
        paddingTop: theme.spacing.unit*3
    },
    slider: {
        width: 300,
        padding: theme.spacing.unit,
    },
    textField: {
        width: 188,
        padding: theme.spacing.unit
    },
    tinyTextField: {
        width: 60,
        padding: theme.spacing.unit,
    },
    answerField: {
        width: 140,
        padding: theme.spacing.unit,
    }
});

const answerBoundOptions = [
    {
      value: '=',
      label: '=',
    },
    {
      value: '<',
      label: '<',
    },
    {
      value: '>',
      label: '>',
    },
    {
        value: 'includes',
        label: 'includes',
      },
      {
        value: 'is between',
        label: 'is between',
      },
      {
        value: '<=',
        label: '<=',
      },
      {
        value: '=>',
        label: '=>',
      },
  ];

@inject("profStore")
@inject("apiService")
@observer
class ProfessorAddSliderQuestion extends React.Component {
    state = {
        toQuestions: false,
        title: '',
        correct_answer: '', // will be sent as statement such as = 5 or >2 && < 100
        lower_bound: '', // label on slider
        upper_bound: '', // label on slider
        answer_bounds: {upper:"", lower:""}, 
        equality_operator: "",
        errors: {title:'', upper_bound:'', lower_bound:''},
        formValid: false,
        slider_value: 50,
        has_correct_answer: false,
        boundFormValid: false,
        disabled: true
    };

    constructor(props) {
        super(props)
        this.styles = props.classes
    }

    setCorrectAnswer = name => event => {
        
        let disabled = true;

        if (!event.target.checked) {
            if (this.state.formValid) {
                disabled = false;
            }
            this.setState({
                answer_bounds: {upper:"", lower:""}, 
                equality_operator: "",
            })
        }
        else {
            if (this.state.boundFormValid && this.state.formValid) {
                disabled = false;
            }
        }

        this.setState({ [name]: event.target.checked, disabled: disabled });
    };

    // function to handle setting correct answer bounds
    setCorrectBounds = prop => event => {
        let answerBounds = this.state.answer_bounds;
        let val = event.target.value
        let formValid = true;
        let disabled = true;
        
        if (val < 0) {
            val = 0;
        }
        if (val > 100) {
            val = 100;
        }

        if (!Number.isInteger(val) && val.replace(/^\s+|\s+$/g, '') !== "") {
            val = Math.round(val);
        }
        
        answerBounds[prop] = val;

        switch (this.state.equality_operator) {
            case '<':
                formValid = (val > 0);
                break;
            case '>':
                formValid = (val < 100);
                break;
            case 'includes':
                formValid = (answerBounds.lower <= answerBounds.upper && answerBounds.lower !== "" && answerBounds.upper !== "");
                break;
            case 'is between':
                formValid = (answerBounds.lower < answerBounds.upper && answerBounds.lower !== "" && answerBounds.upper !== "");
                break;
            default:
                formValid = true;
        }
        if (formValid && this.state.formValid && val !== "") {
            disabled = false;
        }

        this.setState({ answer_bounds: answerBounds, boundFormValid: formValid, disabled: disabled });
        
    };


    // function to set equality operatore
    handleEqualityOperator = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    fieldIsValid(field) {
        return this.state.errors[field] === "";
    }

    handleValidation(name, value) {
        let errors = this.state.errors;
        let formValid = this.state.formValid;
        let disabled = true;

        if (value.replace(/^\s+|\s+$/g, '') === "") {
           errors[name] = "Required"  
        }
        else {
            errors[name] = "";
        }
        if (this.state.title.replace(/^\s+|\s+$/g, '') !== "" && this.state.upper_bound.replace(/^\s+|\s+$/g, '') !== "" && this.state.lower_bound.replace(/^\s+|\s+$/g, '') !== "") {
            formValid = true;
            disabled = false;
        }
        else {
            formValid = false;
            disabled = true;
        }
        this.setState({
            errors: errors,
            formValid: formValid,
            disabled: disabled,
        });
    }

    handleChange = name => event => {
        let value = event.target.value;
        this.setState({
            [name]: value,
        }, () => { this.handleValidation(name, value) });
    };

    handleSliderChange = (event, value) => {
        this.setState({ slider_value: value });
      };

    handleSubmit = () => {
        const { lectureId } = this.props.match.params;
        let correct_answer = null;
        if (this.state.has_correct_answer) {
            switch(this.state.equality_operator) {
                case "includes":
                    correct_answer = ">= " + this.state.answer_bounds.lower + " && <= " + this.state.answer_bounds.upper;
                    break;
                case "is between":
                    correct_answer = "> " + this.state.answer_bounds.lower + " && < " + this.state.answer_bounds.upper;
                    break;
                default:
                    correct_answer = this.state.equality_operator + " " + this.state.answer_bounds.lower;  
            }
        }

        // Send course to API
        this.props.apiService.addQuestion(
            new SliderQuestionObj(null, lectureId, "slider", this.state.title, correct_answer, null, null, null, null, null, null, null, this.state.upper_bound, this.state.lower_bound)
        );

        this.setState({ toQuestions: true });
    }

    render() {
        const { lectureId } = this.props.match.params

        if (this.state.toQuestions === true) {
            return <Redirect to={'/professor/' + lectureId + '/questions'} push />
        }

        return (
            <Grid container direction="row" justify="flex-start">
                <Grid item className={this.styles.gridItem}>
                    <Typography variant="h6" color="textPrimary">
                        Add New Question:
                    </Typography>
                    <form noValidate autoComplete="off">
                        <TextField
                            required
                            error={this.state.errors.title !== ""}
                            id="standard-name"
                            label="Question Title"
                            className={this.styles.titleField}
                            value={this.state.title}
                            onChange={this.handleChange('title')}
                            margin="normal"
                            helperText={this.state.errors["title"]}
                        />
                        <Grid container direction="row" justify="flex-start">
                            <TextField
                                required
                                error={this.state.errors.lower_bound !== ""}
                                id="standard-name"
                                label="lower label"
                                className={this.styles.textField}
                                value={this.state.lower_bound}
                                onChange={this.handleChange('lower_bound')}
                                margin="normal"
                                helperText={this.state.errors["lower_bound"]}
                            />
                            <TextField
                                required
                                error={this.state.errors.upper_bound !== ""}
                                id="standard-name"
                                label="upper label"
                                className={this.styles.textField}
                                value={this.state.upper_bound}
                                onChange={this.handleChange('upper_bound')}
                                margin="normal"
                                helperText={this.state.errors["upper_bound"]}
                            />
                        </Grid>                       
                    </form>
                    <Grid container direction="column">
                        <FormControlLabel
                            control={
                                <Switch
                                checked={this.state.has_correct_answer}
                                onChange={this.setCorrectAnswer('has_correct_answer')}
                                value={this.state.has_correct_answer}
                                />
                            }
                            label="set correct answer (optional)"
                        />
                        {this.state.has_correct_answer && 
                            <Grid container direction="row">
                                <Grid item>
                                    <TextField
                                        select
                                        className={this.styles.answerField}
                                        value={this.state.equality_operator}
                                        onChange={this.handleEqualityOperator('equality_operator')}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">answer</InputAdornment>,
                                        }}
                                        >
                                        {answerBoundOptions.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="correct answer lower bound"
                                        type="number"
                                        className={this.styles.tinyTextField}
                                        value={this.state.answer_bounds.lower}
                                        onChange={this.setCorrectBounds('lower')}
                                        InputProps={{
                                            endAdornment: (
                                            <InputAdornment variant="filled" position="end">
                                                %
                                            </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                {((this.state.equality_operator === 'is between') || (this.state.equality_operator === 'includes')) && 
                                    <Grid item>
                                        <Typography variant="caption" align="center" className={this.styles.tinyTextField}>
                                            {this.state.equality_operator === "is between" ? "and" : "to"}
                                        </Typography>
                                    </Grid>
                                }
                                {((this.state.equality_operator === 'is between') || (this.state.equality_operator === 'includes')) && 
                                    <Grid item>
                                        <TextField
                                            id="correct answer upper bound"
                                            type="number"
                                            className={this.styles.tinyTextField}
                                            value={this.state.answer_bounds.upper}
                                            onChange={this.setCorrectBounds('upper')}
                                            InputProps={{
                                                endAdornment: (
                                                <InputAdornment variant="filled" position="end">
                                                    %
                                                </InputAdornment>
                                                ),
                                            }}
                                        />       
                                    </Grid>
                                }
                            </Grid>
                        }
                        
                        <Button
                            disabled={this.state.disabled}
                            variant="outlined"
                            color="primary"
                            onClick={this.handleSubmit}>
                            Submit
                        </Button>
                </Grid>
            </Grid>
            <Grid item>
                <Typography variant="h6" color="textPrimary">
                    Preview:
                </Typography>
                
                <Grid container direction="column" className={this.styles.sliderContainer}>
                    <Grid item>
                        <Typography variant="h6">
                            {this.state.title}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Grid container direction="row" justify="flex-end">
                            <Card className={this.styles.card}>
                                <Typography className={this.styles.percentText}>
                                    {this.state.slider_value.toString() + " "}%
                                </Typography>
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" justfy="space-around" alignItems="center" className={this.styles.sliderContainer}>
                        <Grid item>
                            <Typography variant="caption" className={this.styles.limits}>
                                {this.state.lower_bound}
                            </Typography>
                        </Grid>
                        <Grid item className={this.styles.slider}>
                            <Slider
                                value={this.state.slider_value}
                                min={0}
                                max={100}
                                step={1}
                                aria-labelledby="label"
                                onChange={this.handleSliderChange}
                            />
                        </Grid>
                        <Grid item>
                            <Typography variant="caption" className={this.styles.limits}>
                                {this.state.upper_bound}
                            </Typography>
                        </Grid>  
                    </Grid>
                </Grid>
            </Grid>  
        </Grid>  
                        
        );
    }
}

export default withStyles(styles)(ProfessorAddSliderQuestion);
