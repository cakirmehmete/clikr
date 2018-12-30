import React from 'react';
import { Redirect } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { List, ChatBubbleOutline } from '@material-ui/icons';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';

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
        toNewSliderQuestion: false,
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

    handleSlider = () => {
        this.setState({ open: false, toNewSliderQuestion: true })
    }

    render() {
        const { classes } = this.props;
        if (this.state.toNewMCQuestion === true) {
            // Lecture Id
            return <Redirect to={'/professor/' + this.props.lectureId + '/questions/new-mc'} push />
        } else if (this.state.toNewFreeTextQuestion === true) {
            return <Redirect to={'/professor/' + this.props.lectureId + '/questions/new-free-text'} push />
        }
        else  if (this.state.toNewSliderQuestion === true) {
            return <Redirect to={'/professor/' + this.props.lectureId + '/questions/new-slider'} push />
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
                        <Grid container direction="row" justify="space-evenly" alignItems="center">
                            <Grid item>
                                <IconButton className={classes.button} aria-label="multiple choice" onClick={this.handleMC}>
                                    <div className={classes.vert}>
                                        <List color="primary" fontSize="large" />
                                        <Typography>
                                            Multiple Choice
                                        </Typography>
                                    </div>
                                </IconButton>
                            </Grid>
                            <Grid item>
                                <IconButton className={classes.button} aria-label="free text" onClick={this.handleFreeText}>
                                    <div className={classes.vert}>
                                        <ChatBubbleOutline color="primary" fontSize="large" />
                                        <Typography>
                                            Free Text
                                        </Typography>
                                    </div>
                                </IconButton>
                            </Grid>
                            <Grid item>
                                <IconButton className={classes.button} aria-label="slider" onClick={this.handleSlider}>
                                    <div className={classes.vert}>
                                        <Icon color="primary" fontSize="large">linear_scale</Icon>
                                        <Typography>
                                            Slider
                                        </Typography>
                                    </div>
                                </IconButton>
                            </Grid>
                        </Grid>
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