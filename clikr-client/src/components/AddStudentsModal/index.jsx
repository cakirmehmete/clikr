import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { observer } from 'mobx-react';
import IconButton from '@material-ui/core/IconButton';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
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
    }
});


@observer
class AddStudentsModal extends React.Component {
    state = {
        open: false,
        code: ""
    };

    constructor(props) {
        super(props)
        this.joinCode = props.joinCode
        this.profStore = props.profStore
    }
    componentDidMount() {
        
        this.setState({
            code: this.joinCode
        })
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
            <Grid item>
                <Tooltip title="add students" placement="top">
                    <IconButton color="secondary" onClick={this.handleOpen}>
                        <PersonAddIcon />
                    </IconButton>
                </Tooltip>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <div style={getModalStyle()} className={classes.paper}>
                        <Typography variant="subtitle1">
                            Share this code with your students:
                        </Typography>
                        <Typography variant="h5" gutterBottom>
                            {this.state.code}
                        </Typography>
                        <Button variant="outlined" color="primary" onClick={this.handleSubmit}>Done</Button>
                    </div>
                </Modal>
            </Grid>
        );
    }
}

// We need an intermediary variable for handling the recursive nesting.
const AddStudentsModalWrapped = withStyles(styles)(AddStudentsModal);

export default AddStudentsModalWrapped;