import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
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
    item: {
        paddingBottom: theme.spacing.unit
    },
    buttonItem: {
        paddingRight: theme.spacing.unit
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
        question_image: ""
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
            this.setState({ title: this.props.questionObj.question_title, question_image: this.props.questionObj.question_image, correct_answer: this.props.questionObj.correct_answer })
        }
        else {
            this.setState({ title: this.props.questionObj.question_title, question_image: this.props.questionObj.question_image })
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
                    this.state.title, this.state.question_image, this.state.correct_answer, 
                    this.props.questionObj.creator_id, this.props.questionObj.is_open, this.props.questionObj.scheduled, 
                    this.props.questionObj.opened_at, this.props.questionObj.closed_at, 
                    this.props.questionObj.created_at, null, null, this.props.questionObj.word_limit))
        }
        this.handleClose();
    }

    removeImage = () => {
        this.setState({ question_image: "" })
    }

    encodeImageFileAsURL = (event) => {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onloadend = () => {
          console.log('RESULT', reader.result);
          this.setState({ question_image: reader.result })
        }
        reader.onloadend = reader.onloadend.bind(this)
        reader.readAsDataURL(file);
    }
    
    render() {

        return (
            <div>
                <Button variant="outlined" onClick={this.handleOpen} disabled={this.props.is_open}>
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

                    <Collapse in={this.state.question_image} timeout="auto" unmountOnExit>
                                <Grid item className={this.styles.item}>
                                    <Typography variant="h6" color="textPrimary">
                                        Image Preview
                                    </Typography>
                                </Grid>
                                <Grid item className={this.styles.item}>
                                    <img src={this.state.question_image} height={300} alt="Preview Unavailable"></img>
                                </Grid>
                            </Collapse>

                            <Grid item className={this.styles.item}>
                                <Grid container direction="row">
                                    <Grid item className={this.styles.buttonItem}>
                                        <Button
                                            variant="contained"
                                            component="label"
                                        >
                                        {this.state.question_image ? "Update Image" : "Upload Image"}
                                        <input
                                            type="file"
                                            style={{ display: "none" }}
                                            onChange={this.encodeImageFileAsURL}
                                        />
                                        </Button>
                                    </Grid>

                                    <Collapse in={this.state.question_image} timeout="auto" unmountOnExit>
                                        <Grid item className={this.styles.buttonItem}>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                onClick={this.removeImage}
                                            >
                                            Remove Image
                                            </Button>
                                        </Grid>
                                    </Collapse>
                                </Grid>
                            </Grid>
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