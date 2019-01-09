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
import { FreeTextQuestionObj } from '../../models/QuestionObj';

const styles = theme => ({
    button:{
        color: theme.palette.secondary.main
    },
    icon: {
        margin: theme.spacing.unit
    }
});

@observer
class EditFRQDialog extends React.Component {
    
    state = {
        open: false,
        title: "",
        correct_answer: "",
        error: "",
        titleValid: true,
    };

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = new APIProfService(this.profStore)
        //this.handleClick = props.handleClick
    }

    componentDidMount() {
        if (this.props.questionObj.correct_answer !== null) {
            this.setState({ title: this.props.questionObj.question_title, correct_answer: this.props.questionObj.correct_answer })
        }
        else {
            this.setState({ title: this.props.questionObj.question_title })
        }
        
    }

    handleClose = () => {
        this.setState({ open: false });
    };

    handleValidation() {
        if (this.state.title === '') {
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
    }

    handleChange = name => event => {
        let value = event.target.value;
        this.setState({
            [name]: value,
        }, () => { this.handleValidation(name, value) });
    };

    handleOpen = () => {
        this.setState({ open: true })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.state.titleValid) {
            this.props.getEdits( 
                new FreeTextQuestionObj(this.props.questionObj.id, 
                    this.props.questionObj.lecture_id, "free_text", 
                    this.state.title, this.state.correct_answer, 
                    this.props.questionObj.creator_id, this.props.questionObj.is_open, 
                    this.props.questionObj.opened_at, this.props.questionObj.closed_at, 
                    this.props.questionObj.created_at, null, null, this.props.questionObj.word_limit))
        }
        this.handleClose();
    }
    
    render() {

        return (
            <div>
                <Button variant="outlined" onClick={this.handleOpen}>
                    Edit
                </Button>
                <Dialog
                    fullWidth
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                <DialogTitle id="alert-dialog-title">{"Edit Free Text Question"}</DialogTitle>
                <DialogContent>
                    <form onSubmit={this.handleSubmit} noValidate autoComplete="off">
                        <Grid container direction="column" justify="center">
                            <Grid item>
                                <TextField
                                    required
                                    fullWidth
                                    error={!this.state.titleValid && !(this.state.error === "")}
                                    label="Question Title"
                                    value={this.state.title}
                                    onChange={this.handleChange('title')}
                                    margin="normal"
                                    helperText={this.state.error}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    fullWidth
                                    label="Correct Answer"
                                    value={this.state.correct_answer}
                                    onChange={this.handleChange('correct_answer')}
                                    margin="normal"
                                />
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} autoFocus color="secondary">
                        cancel
                    </Button>
                    <Button onClick={this.handleSubmit} color="secondary" disabled={!this.state.titleValid}>
                        submit
                    </Button>
            </DialogActions>
                </Dialog>
            </div>
        );
    }
}
export default withStyles(styles)(EditFRQDialog);