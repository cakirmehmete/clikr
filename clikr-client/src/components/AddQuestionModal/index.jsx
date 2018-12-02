import React from 'react';
import { Redirect } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { List } from '@material-ui/icons';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { observer } from 'mobx-react';

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
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },
    vert: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

@observer
class AddQuestionModal extends React.Component {
    state = {
        open: false,
        toNewMCQuestion: false
    };

    constructor(props) {
        super(props)
        this.profStore = props.profStore
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleMC = () => {
        // Close modal 
        this.setState({ open: false, toNewMCQuestion: true });
    }

    render() {
        const { classes } = this.props;
        if (this.state.toNewMCQuestion === true) {
            return <Redirect to='/professor/view-questions/add-mc-question' push />
        }

        return (
            <div>
                <Button variant="outlined" color="primary" onClick={this.handleOpen}>Add Question</Button>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <div style={getModalStyle()} className={classes.paper}>
                        <IconButton className={classes.button} aria-label="Delete" onClick={this.handleMC}>
                            <div className={classes.vert}>
                                <List color="primary" fontSize="large" />
                                <Typography>
                                    Multiple Choice
                                </Typography>
                            </div>
                        </IconButton>
                    </div>
                </Modal>
            </div>
        );
    }
}

// We need an intermediary variable for handling the recursive nesting.
const AddQuestionModalWrapped = withStyles(styles)(AddQuestionModal);

export default AddQuestionModalWrapped;