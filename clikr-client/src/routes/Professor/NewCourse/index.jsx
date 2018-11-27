import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Redirect } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import APIProfService from '../../../services/APIProfService';
import { observer, inject } from 'mobx-react';
import CourseObj from '../../../models/CourseObj';

const styles = theme => ({
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
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
});

@inject("profStore")
@observer
class ProfessorNewCourse extends React.Component {
    state = {
        toHome: false,
        name: '',
        coursenum: '',
        dept: '',
        description: '',
        term: '',
        year: ''
    };

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = new APIProfService(this.profStore)
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleSubmit = () => {
        // Send course to API
        this.apiProfService.addCourse(
            // id: any, title: any, num: any, dept: any, description: any, term: any, joinCode: any, year: any
            new CourseObj(null, this.state.name, this.state.coursenum, this.state.dept,
                this.state.description, this.state.term, this.state.year)
        )
        // Close modal 
        this.setState({ toHome: true });
    }

    // TODO: Make the year and term and Dept a drop down
    render() {
        if (this.state.toHome === true) {
            return <Redirect to='/professor' />
        }

        return (
            <div className={this.styles.paper}>
                <Typography variant="h6" color="textPrimary">
                    Add New Course:
                </Typography>
                <form className={this.styles.container} noValidate autoComplete="off">
                    <TextField
                        id="standard-name"
                        label="Course Name"
                        className={this.styles.textField}
                        value={this.state.name}
                        onChange={this.handleChange('name')}
                        margin="normal"
                    />
                    <TextField
                        id="standard-name"
                        label="Course Number"
                        className={this.styles.textField}
                        value={this.state.coursenum}
                        onChange={this.handleChange('coursenum')}
                        margin="normal"
                    />
                    <TextField
                        id="standard-name"
                        label="Course Department"
                        className={this.styles.textField}
                        value={this.state.dept}
                        onChange={this.handleChange('dept')}
                        margin="normal"
                    />
                    <TextField
                        id="standard-name"
                        label="Course Description"
                        className={this.styles.textField}
                        value={this.state.description}
                        onChange={this.handleChange('description')}
                        margin="normal"
                    />
                    <TextField
                        id="standard-name"
                        label="Course Term"
                        className={this.styles.textField}
                        value={this.state.term}
                        onChange={this.handleChange('term')}
                        margin="normal"
                    />
                    <TextField
                        id="standard-name"
                        label="Course Year"
                        className={this.styles.textField}
                        value={this.state.year}
                        onChange={this.handleChange('year')}
                        margin="normal"
                    />
                    <Button variant="outlined" color="primary" onClick={this.handleSubmit}>Submit</Button>
                </form>
            </div>
        );
    }
}

export default withStyles(styles)(ProfessorNewCourse);
