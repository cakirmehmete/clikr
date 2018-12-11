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
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
class DeleteCourseDialog extends React.Component {
    
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = new APIProfService(this.profStore)
        this.courseId = props.courseId
        this.courseTitle = props.courseTitle
    }

    state = {
        open: false,
        courseId: ""
    };

    componentDidMount () {
        this.setState({
            courseId: this.courseId,
            courseTitle: this.courseTitle,
        });
    }
      
    handleOpen = () => {
        this.setState({ open: true });
    };
      
    handleClose = () => {
        this.setState({ open: false });
    };

    handleDelete = () => {
        this.apiProfService.deleteCourse(this.state.courseId);
        this.handleClose()
    };
    
    render() {
        const { classes } = this.props;

        return (
            <Grid item>
                <Tooltip title="delete course" placement="top-start">
                    <Button variant="text" size="small" onClick={this.handleOpen}>
                        <Icon className={classes.icon} color="secondary">delete</Icon>
                    </Button>
                </Tooltip>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete \"" + this.state.courseTitle + "\"?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Doing so will remove this course and all of its data permanently.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleDelete} color="secondary">
                        yes
                    </Button>
                    <Button onClick={this.handleClose} autoFocus color="secondary">
                        no
                    </Button>
            </DialogActions>
        </Dialog>
                        
                
            </Grid>
        );
    }
}
export default withStyles(styles)(DeleteCourseDialog);