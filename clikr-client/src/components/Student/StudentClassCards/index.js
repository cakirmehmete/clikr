import React from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom'
import { observer, inject } from 'mobx-react';
import APIStudentService from '../../../services/APIStudentService';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = theme => ({
    card: {
        margin: theme.spacing.unit,
        width: '98%',
    },
    link: {
        width: '98%',
        textDecoration: 'none',
    },
    icon: {
        margin: theme.spacing.unit
    }

});

@inject("store")
@observer
class ClassCard extends React.Component {

    constructor(props) {
        super(props)
        this.store = props.store
        this.apiStudentService = new APIStudentService(this.store)
        this.styles = props.classes
        
        
    }
    state = {
        link:'student/questions',
    }
    handleOpen = () => {
        this.setState({ open: true });
    };
      
    handleClose = () => {
        this.setState({ open: false });
    };

    handleDelete = () => {
        this.apiStudentService.dropCourse(this.props.id);
        this.handleClose()
    };

    
    render() {
        return (
                <Card className={this.styles.card}>
                    <CardContent>
                        <Grid container direction="row" justify="space-between" alignItems="stretch">
                            <Grid item>
                                <Link className={this.styles.link} to={{
                                pathname: '/student/questions',
                                state : {
                                    course_id: this.props.id,
                                }
                                }}>
                                    <Typography variant="h4">
                                        {this.props.name}
                                    </Typography>
                                </Link>
                            </Grid>
                            <Grid item>
                                <Tooltip title="drop course" placement="top-start">
                                    <Button variant="text" size="small" onClick={this.handleOpen}>
                                        <Icon className={this.styles.icon} color="secondary">delete</Icon>
                                    </Button>
                                </Tooltip>
                            </Grid>
                            <Dialog
                                open={this.state.open}
                                onClose={this.handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                            <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete \"" + this.props.name + "\"?"}</DialogTitle>
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
                </CardContent>
            </Card>
        );
    }
}

export default withStyles(styles)(ClassCard);