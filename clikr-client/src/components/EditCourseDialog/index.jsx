import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { observer, inject } from 'mobx-react';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import APIProfService from '../../services/APIProfService';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import CourseObj from '../../models/CourseObj';

const styles = theme => ({
    button:{
        color: theme.palette.secondary.main
    },
    icon: {
        margin: theme.spacing.unit
    }
});

@inject('profStore')
@observer
class EditCourseDialog extends React.Component {
    
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = new APIProfService(this.profStore)
        this.course = props.course
    }

    state = {
        open: false,
        title: "",
    };

    componentDidMount () {
        this.setState({
            courseId: this.courseId,
            courseTitle: this.courseTitle,
        });
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }  
    handleOpen = () => {
        this.setState({ open: true });
    };
    handleClose = () => {
        this.setState({ open: false });
    }
    handleSubmit = () => {
        const newCourse = new CourseObj(this.state.title, this.course.id, this.course.num, this.course.dept, this.course.description, this.course.term, this.course.joinCode, this.course.year)
        this.apiProfService.changeCourseTitle(newCourse);  
        this.apiProfService.loadData();
        this.handleClose();
    };

    
    render() {
        const { classes } = this.props;

        return (
            <Grid item>
                <Tooltip title="change title" placement="top-start">
                    <Button variant="text" size="small" onClick={this.handleOpen}>
                        <Icon className={classes.icon} color="secondary">edit</Icon>
                    </Button>
                </Tooltip>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                <DialogTitle id="alert-dialog-title">{"Change title here:"}</DialogTitle>
                <DialogContent>
                    <TextField
                        id="title"
                        helperText="Enter text"
                        name='title'
                        value={this.state.title}
                        onChange={e => this.handleChange(e)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleSubmit} color="secondary">
                        submit
                    </Button>
                    <Button onClick={this.handleClose} color="secondary">
                        cancel
                    </Button>
            </DialogActions>
        </Dialog>
                        
                
            </Grid>
        );
    }
}
export default withStyles(styles)(EditCourseDialog);