import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { observer } from 'mobx-react';
import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const styles = theme => ({
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 20,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 2,
        direction: 'column'
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column'
    },
    textField: {
        width: theme.spacing.unit * 15,
    },
    button: {
        width: theme.spacing.unit * 15,
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    }
});


@observer
class DuplicateCourseModal extends React.Component {
    state = {
        open: false,
        newYear: "",
        newTerm: ""
    };

    constructor(props) {
        super(props)
        this.profStore = props.profStore
        this.apiProfService = props.apiProfService
        this.courseId = props.courseId
        this.styles = props.classes
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.courseId !== undefined) {
            this.courseId = nextProps.courseId
        }
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleChange = (event) => {
        const {name, value} = event.target
        this.setState({ [name]: value });
    }

    handleClose = () => {
        this.setState({ open: false });
    };

    handleSubmit = () => {
        this.apiProfService.duplicateCourse(this.courseId, this.state.newYear, this.state.newTerm)
            .then(data => {
                this.setState({ open: false });
            })
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid item>
                <Tooltip title="Duplicate Course" placement="top">
                    <IconButton color="secondary" onClick={this.handleOpen}>
                        <FileCopyIcon />
                    </IconButton>
                </Tooltip>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <div style={getModalStyle()} className={classes.paper} >
                        <Typography variant="subtitle1">
                            Duplicate Course
                        </Typography>
                        <form className={this.styles.container} onSubmit={this.handleSubmit} noValidate autoComplete="off">
                           <TextField
                                 label="Year"
                                 name="newYear"
                                 className={this.styles.textField}
                                 error={isNaN(this.state.newYear)}
                                 value={this.state.newYear}
                                 onChange={this.handleChange}
                                 margin="normal"
                                 helperText="Year must be an integer."
                           />

                           <TextField
                                 label="Term"
                                 name="newTerm"
                                 className={this.styles.textField}
                                 value={this.state.newTerm}
                                 onChange={this.handleChange}
                                 margin="normal"
                           />

                           <Button className={this.styles.button}
                                 type="submit"
                                 disabled={!(this.state.newTerm && !isNaN(this.state.newYear))}
                                 variant="outlined"
                                 color="primary"
                                 > submit
                           </Button>
                        </form>
                    </div>
                </Modal>
            </Grid>
        );
    }
}

// We need an intermediary variable for handling the recursive nesting.
const DuplicateCourseModalWrapped = withStyles(styles)(DuplicateCourseModal);

export default DuplicateCourseModalWrapped;