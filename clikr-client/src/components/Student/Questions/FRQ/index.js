import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { observer, inject } from 'mobx-react';
import APIStudentService from '../../../../services/APIStudentService'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    gridContainer: {
        margin: theme.spacing.unit,
    },
    gridItem: {
        paddingRight: theme.spacing.unit*2,
    },
    buttonContainer: {
        padding: theme.spacing.unit*1.5,
    }
});

// for sliding up motion
function Transition(props) {
    return <Slide direction="up" {...props} />;
  }

@inject("store")
@observer    
class FRQ extends Component {
    
    constructor(props) {
        super(props)
        this.store = this.props.store
        this.styles = props.classes
        this.apiStudentService = new APIStudentService(this.store)
    }

    state = {
        answer: "",
        sent: "",
        disabled: false,
        dialogue: false
    }
    handleSubmit = () => {
        this.apiStudentService.postAnswer(this.state.answer, this.props.question.question.id)
        this.setState({
            sent: this.state.answer,
            disabled: true
        })
    }
    handleClick = (e) => {
        if (this.state.sent !== "" && this.state.answer !== this.state.sent) {
            this.setState({
                dialogue: true
            })
        }
        else {
            this.handleSubmit()
        }  
    }
    handleChange = (e) => {
        
        if (e.target.value === this.state.sent) {
            this.setState({
                disabled: true
            })
        }
        else {
            this.setState({
                disabled: false
            })
        }
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    // close dialogue box
    handleClose = () => {
        this.setState({ dialogue: false });
        };

    // close dialogue box and resubmit
    handleCloseSubmit = () => {
        this.setState({ dialogue: false });
        this.handleSubmit()
    };

    render() {
        return (
            <div>
                <Grid container direction="column" className={this.styles.gridContainer}>
                    <Grid item className={this.styles.gridItem}>
                        <form noValidate autoComplete="off">
                            <TextField
                                id="full-width"
                                helperText="Enter Response"
                                name = 'answer'
                                value={this.state.answer}
                                onChange={e => this.handleChange(e)}
                                fullWidth  
                            />
                        </form>
                    </Grid>
                </Grid>
                <Grid container direction='row' justify="flex-end" className={this.styles.buttonContainer}>
                    <Button onClick={this.handleClick} disabled={this.state.disabled} variant="contained" color="secondary">
                    submit
                    </Button>
                    <Dialog
                        open={this.state.dialogue}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle id="alert-dialog-slide-title">
                            {"Answer changed- "}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                            "Are you sure you want to change your answer from {this.state.sent} to {this.state.answer}?"
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                            no
                            </Button>
                            <Button onClick={this.handleCloseSubmit} color="primary">
                            yes
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>   
            </div>
        );
    }
}
export default withStyles(styles)(FRQ);