import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { observer, inject } from 'mobx-react';
import Icon from '@material-ui/core/Icon';
import APIStudentService from '../../../services/APIStudentService';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';

const styles = theme => ({
    button:{
        color: theme.palette.secondary.main,
        marginRight: theme.spacing.unit*2
    },
    icon: {
        margin: theme.spacing.unit,
        color: "white"
    }
});

@inject('store')
@observer
class AddCourseDialog extends React.Component {
    
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.store = props.store
        this.apiStudentService = new APIStudentService(this.store)
    }

    state = {
        open: false,
        code: "",
        disabled: true,
    };

    handleChange = (e) => {
        if (e.target.value.length > 0) {
            this.setState({
                [e.target.name]: e.target.value,
                disabled: false,
            })
        }
        else {
            this.setState({
                disabled: true,
                [e.target.name]: e.target.value,
            })
        }
        
    }  
    handleOpen = () => {
        this.setState({ open: true });
    };
    handleClose = () => {
        this.setState({ open: false });
    }
    handleSubmit = () => {
        this.apiStudentService.enrollCourse(this.state.code)
        this.apiStudentService.loadAllCourses()
        this.handleClose();
    };

    
    render() {
        return (
            <div>
                <Fab color="secondary" aria-label="Add" className={this.styles.button} onClick={this.handleOpen}>
                    <Icon className={this.styles.icon}>add</Icon>
                </Fab>
                <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Enter Course Enrollment Code:"}</DialogTitle>
                        <DialogContent>
                            <TextField
                                id="title"
                                helperText="Enter code"
                                name='code'
                                value={this.state.code}
                                onChange={e => this.handleChange(e)}
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleSubmit} disabled={this.state.disabled} color="secondary">
                                enroll
                            </Button>
                            <Button onClick={this.handleClose} color="secondary">
                                cancel
                            </Button>
                    </DialogActions>
                </Dialog>   
            </div>
        );
    }
}
export default withStyles(styles)(AddCourseDialog);