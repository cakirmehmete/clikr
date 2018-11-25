import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import APIService from '../../services/APIService';
import ClassObj from '../../models/ClassObj';
import { observer, inject } from 'mobx-react';

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

@inject("classStore")
@observer 
class AddCourseModal extends React.Component {
    state = {
        open: false,
        name: '',
        coursenum: '',
        dept: ''
    };

    constructor(props) {
        super(props)
        this.apiService = new APIService()
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleSubmit = () => {
        // Send course to API
        this.apiService.addCourse(new ClassObj(this.state.name, this.state.coursenum, this.state.dept, null))
        // Make sure to update the courses
        this.props.classStore.loadClasses()
        // Close modal 
        this.setState({ open: false });
    }
    render() {
        const { classes } = this.props;

        return (
            <div>
                <Button onClick={this.handleOpen} variant="outlined" color="primary" >Add Class</Button>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <div style={getModalStyle()} className={classes.paper}>
                        <Typography variant="h6">
                            Add Course
                        </Typography>
                        <form className={classes.container} noValidate autoComplete="off">
                            <TextField
                                id="standard-name"
                                label="Course Name"
                                className={classes.textField}
                                value={this.state.name}
                                onChange={this.handleChange('name')}
                                margin="normal"
                            />
                            <TextField
                                id="standard-name"
                                label="Course Number"
                                className={classes.textField}
                                value={this.state.coursenum}
                                onChange={this.handleChange('coursenum')}
                                margin="normal"
                            />
                            <TextField
                                id="standard-name"
                                label="Course Dept"
                                className={classes.textField}
                                value={this.state.dept}
                                onChange={this.handleChange('dept')}
                                margin="normal"
                            />
                            <Button variant="outlined" color="primary" onClick={this.handleSubmit}>Submit</Button>
                        </form>
                    </div>
                </Modal>
            </div>
        );
    }
}

AddCourseModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const AddCourseModalWrapped = withStyles(styles)(AddCourseModal);

export default AddCourseModalWrapped;