import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
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
});

@observer
class AddStudentsModal extends React.Component {
    state = {
        open: false,
    };

    constructor(props) {
        super(props)
        this.profStore = props.profStore
        this.courseIndex = props.courseIndex
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleSubmit = () => {
        // Close modal 
        this.setState({ open: false });
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Button variant="text" size="small" color="secondary" onClick={this.handleOpen}>Add Students</Button>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <div style={getModalStyle()} className={classes.paper}>
                        <Typography variant="h6">
                            {this.profStore.courses[this.courseIndex].joinCode}
                        </Typography>
                        <Button variant="outlined" color="primary" onClick={this.handleSubmit}>Done</Button>
                    </div>
                </Modal>
            </div>
        );
    }
}

// We need an intermediary variable for handling the recursive nesting.
const AddStudentsModalWrapped = withStyles(styles)(AddStudentsModal);

export default AddStudentsModalWrapped;