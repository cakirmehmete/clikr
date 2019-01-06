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
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

const styles = theme => ({
    gridItem: {
        padding: theme.spacing.unit,
    },
    card: {
        backgroundColor: theme.palette.secondary.main,
        padding: theme.spacing.unit*0.25,
        marginRight: theme.spacing.unit*2.5,
        width: 45
    },
    percentText: {
        color: "white",
    },
    labels: {
        wordBreak:"break-word", 
        fontFamily:"sans-serif", 
        fontSize:"0.75em", 
        display:"flex", 
        justifyContent:"center"
    },
    titleWrap: {
        wordBreak:"break-word", 
        fontFamily:"sans-serif", 
        fontSize:"1.5em", 
        display:"flex", 
    },
    entry: {
        maxWidth: 500
    },
    titleContainer: {
        paddingTop: theme.spacing.unit,
        paddingBottom: theme.spacing.unit*2
    },
    slidercontainer: {
        paddingRight: theme.spacing.unit*2
    },
    gridContainer: {
        margin: theme.spacing.unit,
    },
    container: {
        flexWrap: 'wrap',
    },
    button: {
        paddingTop: theme.spacing.unit*3,
    },
    andor: {
        padding: theme.spacing.unit,
        width: "15%"
    },
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
    value: '<=',
    label: '<=',
    },
    {
    value: '>=',
    label: '>=',
    },
  ];
  const answerBoundOptionsRange = [
    {
      value: '<',
      label: '<',
    },
    {
      value: '>',
      label: '>',
    },
    {
    value: '<=',
    label: '<=',
    },
    {
    value: '>=',
    label: '>=',
    },
  ];

@inject("profStore")
@inject("apiService")
@observer
class ProfessorAddSliderQuestion extends React.Component {
    state = {
        toQuestions: false,
        title: '',
        titleError: "",
        correct_answer: '', // will be sent as statement such as = 5 or >2 && < 100
        labels: {lower:"0%", upper:"100%"}, // labels on slider
        answer_bounds: {upper:"", lower:""}, 
        range: false, // whether or not correct answer has a range
        rangeVal: "not_range", // added for radio group purposes
        equality_operators: {upper:"", lower:""},
        slider_value: 50,
        has_correct_answer: false,
        custom_labels: false,
        fieldsValid: {title: false, lower_label:false, upper_label:false, lower_bound:false, upper_bound: false, equality_operators: false},
        disabled: true
    };

    constructor(props) {
        super(props)
        this.styles = props.classes
    }

    validateAnswers() {
        let disabled = false;

        if (this.state.custom_labels && this.state.has_correct_answer) {
            const keys = Object.keys(this.state.fieldsValid);
            for (const key of keys) {
                if (!this.state.fieldsValid[key]) disabled = true;
            }
        }
        else {
            if (this.state.custom_labels) {
                if (!this.state.fieldsValid.lower_label || !this.state.fieldsValid.upper_label || !this.state.fieldsValid.title) disabled = true;
            }
            else {
                if (this.state.has_correct_answer) {
                    if (!this.state.fieldsValid.lower_bound || !this.state.fieldsValid.upper_bound || !this.state.fieldsValid.equality_operators) {
                        disabled = true;
                    }
                }
                else {
                    if (!this.state.fieldsValid.title) disabled = true;
                }
            }
        }
       
        if (!this.state.fieldsValid.title) disabled = true;

        this.setState({ disabled: disabled })
    }
    
    // handles the switch to control setting a correct answer for the question
    setCorrectAnswer = name => event => {

        if (!event.target.checked) {
            this.setState({
                answer_bounds:{upper:"", lower:""},
                equality_operators: {upper:"", lower:""}, 
                range: false,
                rangeVal: "not_range", 
            })
        }
       

        this.setState({ [name]: event.target.checked },
            () => { this.validateBoundsAndOperators() });

    };

    // controls switch to set custom labels for bounds
    setCustomLabels = name => event => {
        if (!event.target.checked) {
            let fieldsValid = this.state.fieldsValid;
            fieldsValid.lower_label = true;
            fieldsValid.upper_label = true;
            this.setState({
                fieldsValid: fieldsValid,
                labels: {upper:"100%", lower:"0%"},
                custom_labels: false,
            })
        }
        this.setState({ [name]: event.target.checked });
        this.validateAnswers();
    };

    // gets opposite of upper_bound/lower_bound vice
    getOppBound(bound) {
       if (bound === "upper_bound") return "lower_bound";
       return "upper_bound";
    }

    // gets opposite of upper/lower vice
    getOppSide(side) {
        if (side === "upper") return "lower";
        return "upper";
     }

    isInRange(operator, value) {
        if (operator.replace(/^\s+|\s+$/g, '') === "") return false;
        if (value.replace(/^\s+|\s+$/g, '') === "") return false;

        if (operator === "<") {
            if (value === "0") {
                return false;
            }
        }
        if (operator === ">") {
            if (value === "100") return false;
        }
        return true;
    }

    // sets if bounds and operators are valid 
    validateBoundsAndOperators() {

        let allValid = true;
        let fieldsValid = this.state.fieldsValid;

        if (!this.isInRange(this.state.equality_operators.lower, this.state.answer_bounds.lower)) {
            fieldsValid.equality_operators = false;
            fieldsValid.lower_bound = false;
            allValid = false;
        }

        if (this.state.range) {
            if (!this.isInRange(this.state.equality_operators.upper, this.state.answer_bounds.upper)) {
                fieldsValid.equality_operators = false;
                fieldsValid.upper_bound = false;
                allValid = false;
            }

            if (this.state.answer_bounds.lower === this.state.answer_bounds.upper) {
                fieldsValid.equality_operators = false;
                fieldsValid.lower_bound = false;
                allValid = false;
            }

            let valid = true;
            switch(this.state.equality_operators.lower) {
                case ">":
                    valid = this.state.equality_operators.upper !== ">" && this.state.equality_operators.upper !== ">=";
                    break;
                case ">=":
                    valid = this.state.equality_operators.upper !== ">" && this.state.equality_operators.upper !== ">=";
                    break;
                case "<":
                    valid = this.state.equality_operators.upper !== "<" && this.state.equality_operators.upper !== "<=";
                    break;
                case "<=":
                    valid = this.state.equality_operators.upper !== "<" && this.state.equality_operators.upper !== "<=";
                    break;
                default:
                    valid = true;
            }

            fieldsValid.equality_operators = valid && fieldsValid.equality_operators;

            if (!valid) allValid = false;

        }

        if (allValid) {
            fieldsValid = {title: this.state.fieldsValid.title, lower_label:true, upper_label:true, lower_bound:true, upper_bound: true, equality_operators: true};
        }
        else {
        }

        this.setState({ fieldsValid: fieldsValid },
            () => { this.validateAnswers() });
    }
    
   
    // function to handle setting correct answer bounds. prop contains "lower" or "upper"
    setCorrectBounds = prop => event => {
        let answerBounds = this.state.answer_bounds;
        let val = event.target.value;

        answerBounds[prop] = val;

        if (val < 0) {
            val = 0;
        }
        if (val > 100) {
            val = 100;
        }

        if (!Number.isInteger(val)) {
            val = Math.round(val);
        }
        
    
        this.setState({ answer_bounds: answerBounds },
            () => { this.validateBoundsAndOperators() });

    };


    // function to set equality operators
    handleEqualityOperator = prop => event => {

        let equality_operators = this.state.equality_operators;
        equality_operators[prop] = event.target.value;
        this.setState({ equality_operators: equality_operators },
            () => { this.validateBoundsAndOperators() });

    };


    validateTitle(value) {
        let error = this.state.titleError;
        let fieldsValid = this.state.fieldsValid;

        if (value.replace(/^\s+|\s+$/g, '') === "") {
           error = "Required" ;
           fieldsValid.title = false;
        }
        else {
            error = "";
            fieldsValid.title = true;
        }
            
        this.setState({ titleError: error, fieldsValid: fieldsValid });

        this.validateAnswers();
    }

    handleTitleChange = name => event => {
        let value = event.target.value;
        this.setState({
            title: value,
        }, () => { this.validateTitle(value) });
    };

    handleLabelsValidation() {
        let valid = false;
        if (this.state.labels.upper === "" && this.state.labels.lower === "") valid  = true;
        else {
            if (this.state.labels.upper !== "" && this.state.labels.lower !== "") valid = true;
        }
        let fieldsValid = this.state.fieldsValid;
        fieldsValid.lower_label = valid;
        fieldsValid.upper_label = valid;
        this.setState({ fieldsValid: fieldsValid })

        this.validateAnswers();
    }

    handleLabelsChange = name => event => {
        let value = event.target.value;
        let labels = this.state.labels;
        labels[name] = event.target.value;
        this.setState({
            labels: labels,
        }, () => { this.handleLabelsValidation(name, value) });
    };

    handleSliderChange = (event, value) => {
        this.setState({ slider_value: value });
      };

    // whether or not to display to inqualities
    handleSetRange = (e) => {
        let range = true;
        if (e.target.value === "not_range") {
            range = false;
        }
        this.setState({
            rangeVal: e.target.value,
            range: range
        });
    };

    // true will be && and false will be ||
    getOperatorCondition(lower_operator) {
        
        let condition = true;

        switch (lower_operator) {
            case "<":
                condition = "||";
                break;
            case "<=":
                condition = "||";
                break;
            case ">":
                condition = "&&";
                break;
            case ">=":
                condition = "&&";
                break;
            default:
                condition = true;
        }
        return condition;
    }

    handleSubmit = () => {
        const { lectureId } = this.props.match.params;
        let correct_answer = "";
        
        if (this.state.has_correct_answer) {
            if (this.state.range) {
                let answerBounds = this.state.answer_bounds;
                let equalityOperators = this.state.equality_operators;
                if (Number(answerBounds.lower) > Number(answerBounds.upper)) {
                    const lower = answerBounds.lower;
                    answerBounds.lower = answerBounds.upper;
                    answerBounds.upper = lower;
                    let equalityOperators = this.state.equality_operators;
                    const lower_operator = this.state.equality_operators.lower;
                    equalityOperators.lower = equalityOperators.upper;
                    equalityOperators.upper = lower_operator;
                }
                correct_answer = equalityOperators.lower + " " + answerBounds.lower.toString() + " " +  this.getOperatorCondition(equalityOperators.lower) + " " + equalityOperators.upper + " " + answerBounds.upper.toString();
            }
            else {
                correct_answer = this.state.equality_operators.lower + " " + this.state.answer_bounds.lower.toString();
            }
        }

        // Send course to API
        this.props.apiService.addQuestion(
            new SliderQuestionObj(null, lectureId, "slider", this.state.title, correct_answer, null, null, null, null, null, null, null, this.state.labels.lower, this.state.labels.upper)
        );

        this.setState({ toQuestions: true });
    }

    render() {
        const { lectureId } = this.props.match.params

        if (this.state.toQuestions === true) {
            return <Redirect to={'/professor/' + lectureId + '/questions'} push />
        }

        return (
            <Grid container justify="center" className={this.styles.container} spacing={24} >
                <Grid item className={this.styles.gridItem} xs={12} sm={6}>
                    <Grid container direction="column" align-items="flex-start">
                        <Grid item>
                            <Typography variant="h6" color="textPrimary">
                                Add New Question:
                            </Typography>
                        </Grid>
                        <Grid item className={this.styles.entry}>
                            <form noValidate autoComplete="off">
                                <TextField
                                    required
                                    fullWidth
                                    error={this.state.titleError !== ""}
                                    id="standard-name"
                                    label="Question Title"
                                    value={this.state.title}
                                    onChange={this.handleTitleChange('title')}
                                    margin="normal"
                                    helperText={this.state.titleError}
                                />
                            </form>
                        </Grid>  
                    </Grid>
                    <Grid container direction="column" justify="flex-start" >
                        <Grid item>
                            <FormControlLabel
                                control={
                                    <Switch
                                    checked={this.state.custom_labels}
                                    onChange={this.setCustomLabels('custom_labels')}
                                    value={this.state.custom_labels}
                                    />
                                }
                                label="custom labels (optional)"
                            />
                        </Grid>
                        
                        {this.state.custom_labels && 
                            <Grid item>
                                <Grid container direction="row" justify="flex-start" alignItems="center" spacing={24} className={this.styles.entry}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            id="standard-name"
                                            label="lower label"
                                            value={this.state.labels.lower}
                                            onChange={this.handleLabelsChange('lower')}
                                            margin="normal"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            id="standard-name"
                                            label="upper label"
                                            value={this.state.labels.upper}
                                            onChange={this.handleLabelsChange('upper')}
                                            margin="normal"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        }
                    </Grid>                       
                    <Grid container direction="column" justify="space-evenly" >
                        <Grid item>
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
                        </Grid>
                        {this.state.has_correct_answer && 
                            <Grid item>
                                <Grid container direction="row">
                                    <FormControl component="fieldset">
                                        <RadioGroup
                                            name="rangeVal"
                                            value={this.state.rangeVal}
                                            onChange={this.handleSetRange}
                                        >
                                            <FormControlLabel value={"not_range"} name="not_range" control={<Radio />} label={"inequality/equality"} />
                                            <FormControlLabel value={"range"} name="range" control={<Radio />} label={"set range"} />  
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        }
                        
                        {this.state.has_correct_answer && this.state.range ? ( <Grid item>
                            <Grid container direction="row" justify="flex-start" className={this.styles.entry} spacing={16}> 
                                <Grid item xs={6} sm={3}>
                                    <TextField
                                        select
                                        value={this.state.equality_operators.lower}
                                        onChange={this.handleEqualityOperator('lower')}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">answer</InputAdornment>,
                                        }}
                                        >
                                        {answerBoundOptionsRange.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <TextField
                                        id="correct answer lower bound"
                                        type="number"
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
                                <Grid item xs={6} sm={3}>
                                    <TextField
                                        select
                                        value={this.state.equality_operators.upper}
                                        onChange={this.handleEqualityOperator('upper')}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">and/or</InputAdornment>,
                                        }}
                                        >
                                        {answerBoundOptionsRange.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <TextField
                                        id="correct answer upper bound"
                                        type="number"
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
                            </Grid>
                        </Grid>)
                        : (this.state.has_correct_answer && <Grid item>
                            <Grid container direction="row" justify="flex-start" className={this.styles.entry}>
                                <Grid item> 
                                    <Grid container direction="row" justify="flex-start" spacing={24}>
                                        <Grid item xs={6}>
                                            <TextField
                                                select
                                                fullWidth
                                                value={this.state.equality_operators.lower}
                                                onChange={this.handleEqualityOperator('lower')}
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
                                        <Grid item xs={6}>
                                            <TextField
                                                fullWidth
                                                id="correct answer lower bound"
                                                type="number"
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
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>)}
                    </Grid>
                    <Grid container className={this.styles.button}>
                        <Button
                            disabled={this.state.disabled}
                            variant="outlined"
                            color="primary"
                            onClick={this.handleSubmit}>
                            Submit
                        </Button>
                    </Grid>
                </Grid>
                <Grid item className={this.styles.gridItem} xs={12} sm={6}>
                    <Grid container direction="column" align-items="flex-start" spacing={24}>
                        <Grid item><Typography variant="h6" color="textPrimary"> Preview: </Typography></Grid>
                        <Grid item>
                            <Grid container direction="column" justify="center" spacing={24}>
                                <Grid item xs={12}>
                                    <Grid container direction="row" justify="space-between" className={this.styles.titleContainer}>
                                        <Grid item>
                                            <div className={this.styles.titleWrap}> {this.state.title} </div>
                                        </Grid>
                                        <Grid item>
                                            <Grid container direction="row" justify="flex-end">
                                                <Card className={this.styles.card}>
                                                    <Typography align="center" className={this.styles.percentText}>
                                                        {this.state.slider_value.toString() + " "}%
                                                    </Typography>
                                                </Card>
                                            </Grid>
                                        </Grid>  
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" justify="flex-start" alignItems="center" className={this.styles.slidercontainer} spacing={24}>
                                    <Grid item xs><div className={this.styles.labels}>{this.state.labels.lower}</div></Grid>
                                    <Grid item xs={8}>
                                        <Slider
                                            value={this.state.slider_value}
                                            min={0}
                                            max={100}
                                            step={1}
                                            aria-labelledby="label"
                                            onChange={this.handleSliderChange}
                                        />
                                    </Grid>
                                    <Grid item xs><div className={this.styles.labels}>{this.state.labels.upper}</div></Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>  
            </Grid>
        );
    }
}

export default withStyles(styles)(ProfessorAddSliderQuestion);
