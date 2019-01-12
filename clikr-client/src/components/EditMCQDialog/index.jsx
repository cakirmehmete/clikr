import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import APIProfService from '../../services/APIProfService';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import { MultipleChoiceQuestionObj } from '../../models/QuestionObj';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';

const styles = theme => ({
    button:{
        color: theme.palette.secondary.main
    },
    select: {
        width: 200
    },
    icon: {
        margin: theme.spacing.unit,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    item: {
        paddingBottom: theme.spacing.unit,
    },
    bootstrapInput: {
        borderRadius: 4,
        backgroundColor: theme.palette.common.white,
        border: '1px solid #ced4da',
        fontSize: 12,
        padding: '10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
          borderColor: '#80bdff',
          boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
      },
});

function answersValid(new_options) {
    if (new_options.length === 0) return false;
    for (const option of new_options) {
        for (const val of Object.values(option)) {
            if (val === "") return false; 
        }     
    }
    return true;
}

@observer
class EditMCQDialog extends React.Component {
    
    state = {
        open: false,
        title: '',
        correct_answer: '',
        number_of_options: "",
        options: [], // necessary because of controlled form
        answer_choices: {option1: "", option2: "", option3: "", option4: "", option5: ""}, // must be set for input base to be controlled
        checked: {option1: false, option2: false, option3: false, option4: false, option5: false},
        should_delete: {option1:false, option2:false, option3:false, option4:false, option5:false},
        titleError: "",
        formValid: true,
        titleValid: true,
        hasAnswers: true,
        optionsValid: true,
        delete_mode: false,
        deleteDisabled: false,
        deleteConfirmDisabled: false,
    };

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = new APIProfService(this.profStore)
    }

    componentDidMount() {
        let answer_choices = {};
        let checked = this.state.checked;
        let correct = this.props.questionObj.correct_answer 
        const number_of_options = Number(this.props.questionObj.number_of_options);
        let options = [];

        for (let i = 1; i <= number_of_options; i++) {
            let option_string= "option" + i.toString();
            answer_choices[option_string] = this.props.questionObj[option_string];
            options.push({ [option_string]: answer_choices[option_string] })
        }
        if (correct !== null) {
            correct = "option" + correct;
            checked[correct] = true;
        }
       
        this.setState({ title: this.props.questionObj.question_title, correct_answer: correct, number_of_options: number_of_options,  answer_choices: answer_choices, checked: checked, options: options })
       
        
    }
    handleClose = () => {
        this.setState({ open: false });
    };


    handleDelete() {

        let answer_choices = this.state.answer_choices;
        let number_of_options = this.state.number_of_options;
        let options = [];
        let correct_answer = "";
        let checked = {option1: false, option2: false, option3: false, option4: false, option5: false};

        for (const k of Object.keys(this.state.should_delete)) {
            if (this.state.should_delete[k]) {
                number_of_options--;
            }
        }

        // abort if less than two options remain, but button disabling should prevent this anyway
        if (number_of_options < 2) {
            this.setState({
                should_delete: { option1:false, option2:false, option3:false, option4:false, option5:false },
                delete_mode: false,
            })
            return;
        }

        let index = 1;
        for (const k of Object.keys(answer_choices)) {
            if (!this.state.should_delete[k]) {
                let option_string = "option" + index.toString();
                options.push({ [option_string]: answer_choices[k] });
                if (k === this.state.correct_answer) correct_answer = option_string;
                index++;
                if (index > number_of_options) {
                    break;
                }
            }
        }

        answer_choices = {option1: "", option2: "", option3: "", option4: "", option5: ""};
        // this is not the nicest way to do this, but it's functional, and I couldn't find my bug in my nicer code
        options.map(option => answer_choices[Object.keys(option)[0]] = Object.values(option)[0]);

        if (correct_answer !== "" && correct_answer !== null) checked[correct_answer] = true;

        this.setState({
            should_delete: { option1:false, option2:false, option3:false, option4:false, option5:false },
            answer_choices: answer_choices,
            correct_answer: correct_answer,
            checked: checked,
            number_of_options: number_of_options,
            delete_mode: false,
            options: options,
            deleteDisabled: number_of_options <= 2,
        }, () => { this.validateFields('answer_choices', options) });
       
    }

    validateFields(name, value) {
        let titleValid = this.state.titleValid;
        let errors = this.state.errors;
        let has_answers = this.state.hasAnswers
        let optionsValid = this.state.optionsValid;
        let titleError = this.state.titleError;

        switch(name) {
            case "title":
                if (value === "") {
                    titleError = "This field is required";
                    titleValid = false;
                }
                else {
                    titleError = '';
                    titleValid = true;
                }
                break;
            case "number_of_options":
                has_answers = true;
                optionsValid = answersValid(value);
                break;
            case "answer_choices":
                optionsValid = answersValid(value);
                break;
            default:
        }
       
        this.setState({ errors: errors, 
                        titleValid: titleValid, 
                        titleError: titleError,
                        hasAnswers: has_answers,
                        optionsValid: optionsValid,
         }, this.validateForm);

    }
    
    validateForm() {
        const titleValid = this.state.title !== "";
        if (!titleValid) {
            this.setState({ titleValid: false })
        }
        this.setState({ formValid: titleValid && this.state.hasAnswers && this.state.optionsValid });
    }


    handleOption = option => event => {
        const key = Object.keys(option)[0];
        let answer_choices = this.state.answer_choices;
        let options = this.state.options;
        answer_choices[key] = event.target.value;
        options.find(x => Object.keys(x)[0] === key)[key] = event.target.value
        this.setState({
            answer_choices: answer_choices,
            options: options,
        }, () => { this.validateFields('answer_choices', options) });
    }
    
    handleSetNumberOfOptions = name => event => {
        let options = [];
        let answer_choices = this.state.answer_choices;
        let deleteDisabled = event.target.value <= 2;

        for (let i = 1; i <= event.target.value; i++) {
            let option_string = "option" + i.toString();
            options.push({ [option_string]: this.state.answer_choices[option_string] })
        }
        if (event.target.value < this.state.number_of_options) {
            for (let i = event.target.value + 1; i <=5; i++) {
                let option_string = "option" + i.toString();
                answer_choices[option_string] = "";
            }
        }

        this.setState({
            answer_choices: answer_choices,
            number_of_options: event.target.value,
            options: options,
            deleteDisabled: deleteDisabled,
        }, () => { this.validateFields(name, options)});

    }

    handleDeleteQueue = name => event => {
        let should_delete = this.state.should_delete;
        if (event.target.checked) {
            should_delete[name] = true;
        }
        else {
            should_delete[name] = false;
        }

        // compute if confirm button should be disabled
        let numRemainingOptions = 0;
        for (const k of Object.keys(should_delete)) {
            if (!should_delete[k]) {
                numRemainingOptions++;
            }
        }
        
        // adjust for the "invisible" options which have been counted as well
        numRemainingOptions -= (5 - this.state.number_of_options);

        this.setState({
            should_delete: should_delete,
            deleteConfirmDisabled: numRemainingOptions < 2,
        })
    }

    handleCheck = option => event => {
        const key = Object.keys(option)[0];
        let checked = this.state.checked;
        let correct_answer = key;
        checked[key] = event.target.checked;

        if (this.state.correct_answer === key) {
            checked[key] = false;
            correct_answer = "";
        }
    
        this.setState({
            correct_answer: correct_answer,
            checked: checked
        })
    }

    handleChange = name => event => {
        let value = event.target.value;
        this.setState({
            [name]: value,
        }, () => { this.validateFields(name, value) });
    };

    setDeleteMode() {
        const delete_mode = !this.state.delete_mode;
        this.setState({ delete_mode: delete_mode });
    }

    handleOpen =  () => {
        this.setState({ open: true })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let correct_answer = "";
        if (this.state.correct_answer !== "" && this.state.correct_answer !== null) {
            correct_answer = this.state.correct_answer.substring(6, 7);
        }
       
        if(this.state.formValid) {
            this.props.getEdits( 
                new MultipleChoiceQuestionObj(this.props.questionObj.id,
                this.props.questionObj.lecture_id, "multiple_choice",
                this.state.title, correct_answer,
                this.props.questionObj.creator_id, this.props.questionObj.is_open, this.props.questionObj.opened_at, this.props.questionObj.closed_at,
                this.props.questionObj.created_at, this.props.questionObj.modified_at, this.props.questionObj.answer,
                this.state.answer_choices.option1, this.state.answer_choices.option2, this.state.answer_choices.option3, this.state.answer_choices.option4, this.state.answer_choices.option5,
                this.state.number_of_options))
        }
        this.handleClose();
    }
    
    render() {

        return (
            <div>
                <Button variant="outlined" onClick={this.handleOpen} disabled={this.props.is_open}>
                    Edit
                </Button>
                <Dialog
                    fullWidth
                    scroll="paper"
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                <DialogTitle id="alert-dialog-title">{"Edit Multiple Choice Question"}</DialogTitle>
                <DialogContent>
                <Grid container direction="column" justify="center">
                <Grid item className={this.styles.item}>
                    <form className={this.styles.container} noValidate autoComplete="off">
                        <TextField
                            required
                            fullWidth
                            error={!this.state.titleValid}
                            id="standard-name"
                            label="Question Title"
                            value={this.state.title}
                            onChange={this.handleChange('title')}
                            margin="normal"
                            helperText={this.state.titleError}
                        />
                    </form>
                </Grid>
                <Grid item className={this.styles.item}>
                    <form autoComplete="off">
                        <FormControl>
                            <InputLabel htmlFor="number-options">number of answer choices</InputLabel>
                            <Select
                                value={this.state.number_of_options}
                                onChange={this.handleSetNumberOfOptions('number_of_options')}
                                className={this.styles.select}
                                disabled={this.state.delete_mode}
                                inputProps={{
                                name: 'number_of_options',
                                id: 'number-options',
                                }}
                            >
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                            </Select>
                        </FormControl>
                    </form>
                </Grid>
                {this.state.hasAnswers && 
                    <Grid item>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {this.state.delete_mode ? 
                                        <TableCell> Delete?</TableCell>
                                        :
                                        <TableCell>Correct Answer?</TableCell>
                                    }
                                    <TableCell>Answer Choices</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {this.state.delete_mode ? 
                               this.state.options.map((option, index) => 
                                    <TableRow key={index}> 
                                        <TableCell>
                                            <Checkbox
                                                checked={this.state.should_delete[Object.keys(option)[0]]}
                                                onChange={this.handleDeleteQueue(Object.keys(option)[0])}
                                                value={Object.keys(option)[0]}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1" align="justify"> {this.state.answer_choices[Object.keys(option)[0]]}</Typography>
                                        </TableCell>
                                    </TableRow>
                                )
                                :
                                this.state.options.map((option, index) => 
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Checkbox
                                                checked={this.state.correct_answer === Object.keys(option)[0]}
                                                onChange={this.handleCheck(option)}
                                                value={Object.keys(option)[0]}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <FormControl>
                                                <InputBase
                                                multiline
                                                id="bootstrap-input"
                                                name={Object.keys(option)[0]}
                                                value={this.state.answer_choices[Object.keys(option)[0]]}
                                                onChange={this.handleOption(option)}
                                                classes={{
                                                    input: this.styles.bootstrapInput
                                                }}
                                                />
                                            </FormControl>
                                        </TableCell>
                                    </TableRow>
                                )
                            }

                            </TableBody>
                        </Table>    
                    
                                    
                        <Grid container direction="row" justify="flex-end">
                                {!this.state.delete_mode ? 

                                <IconButton onClick={this.setDeleteMode.bind(this)} color="secondary" disabled={this.state.deleteDisabled}>
                                    <DeleteIcon />
                                </IconButton>

                                :
                                
                                <IconButton color="secondary" onClick={this.handleDelete.bind(this)} disabled={this.state.deleteConfirmDisabled}>
                                        <DoneIcon className={this.styles.iconDone}/>
                                </IconButton>
                         
                                }     
                        </Grid>
                            
                    </Grid>
                }
                
            </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} autoFocus color="secondary">
                        cancel
                    </Button>
                    <Button onClick={this.handleSubmit} color="secondary" disabled={!this.state.formValid}>
                        submit
                    </Button>
            </DialogActions>
                </Dialog>
            </div>
        );
    }
}
export default withStyles(styles)(EditMCQDialog);