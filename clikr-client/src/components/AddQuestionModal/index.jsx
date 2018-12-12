import React from 'react';
import { Redirect } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { List, ChatBubbleOutline } from '@material-ui/icons';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';

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

class AddQuestionModal extends React.Component {
    state = {
        open: false,
        toNewMCQuestion: false,
        toNewFreeTextQuestion: false,
        lectureId: null
    };

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

    handleFreeText = () => {
        // Close modal
        this.setState({ open: false, toNewFreeTextQuestion: true});
    }

    render() {
        const { classes } = this.props;
        if (this.state.toNewMCQuestion === true) {
            // Lecture Id
            return <Redirect to={'/professor/' + this.props.lectureId + '/questions/new-mc'} push />
        } else if (this.state.toNewFreeTextQuestion === true) {
            return <Redirect to={'/professor/' + this.props.lectureId + '/questions/new-free-text'} push />
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
                        <IconButton className={classes.button} aria-label="Delete" onClick={this.handleFreeText}>
                            <div className={classes.vert}>
                                <ChatBubbleOutline color="primary" fontSize="large" />
                                <Typography>
                                    Free Text
                                </Typography>
                            </div>
                        </IconButton>
                    </div>
                </Modal>
            </div>
        );
    }
}

AddQuestionModal.propTypes = {
    lectureId: PropTypes.string
};

// We need an intermediary variable for handling the recursive nesting.
const AddQuestionModalWrapped = withStyles(styles)(AddQuestionModal);

export default AddQuestionModalWrapped;