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
    yellowCard: {
        margin: theme.spacing.unit,
        width: '98%',
        background: theme.palette.primary.main
    },
    navyCard: {
        margin: theme.spacing.unit,
        width: '98%',
        background: theme.palette.secondary.light
    },
    greenCard: {
        margin: theme.spacing.unit,
        width: '98%',
        background: theme.palette.primary.light
    },
    orangeCard: {
        margin: theme.spacing.unit,
        width: '98%',
        background: theme.palette.primary.dark
    },
    link: {
        width: '98%',
        textDecoration: 'none',
    },
    icon: {
        margin: theme.spacing.unit
    },
    typography: {
        width: '100%'
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
        colorStyle: undefined,
        open:false,
    }

    componentDidMount () {
        var colors = [this.styles.orangeCard, this.styles.greenCard, this.styles.yellowCard, this.styles.navyCard];
        this.setState({
            colorStyle: colors[this.props.colorIndex]
        });
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
        debugger;
        return (
            
                <Card className={this.state.colorStyle}>
                    <CardContent>
                        <Grid container direction="row" justify="space-between" alignItems="stretch" spacing={24}>
                            <Grid item xs={10}>
                                <Link className={this.styles.link} to={{
                                pathname: '/student/questions',
                                state : {
                                    course_id: this.props.id,
                                }
                                }}>
                                    <Typography className={this.styles.typography} variant="h4">
                                        {this.props.course.dept} {this.props.course.num} - {this.props.course.title}: {this.props.course.term} {this.props.course.year}
                                    </Typography>
                                </Link>
                            </Grid>
                            <Grid item xs={2}>
                                <Grid container direction="row" justify="flex-end">
                                    <Tooltip title="drop course" disableFocusListener placement="top-start">
                                        <Button variant="text" size="small" onClick={this.handleOpen}>
                                            <Icon className={this.styles.icon} color="secondary">delete</Icon>
                                        </Button>
                                    </Tooltip>
                                </Grid>
                                
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
                                <Button onClick={this.handleClose} autoFocus color="secondary">
                                    no
                                </Button>
                                <Button onClick={this.handleDelete} color="secondary">
                                    yes
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