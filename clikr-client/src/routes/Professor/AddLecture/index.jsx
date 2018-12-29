import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Redirect } from "react-router-dom";
import { inject } from 'mobx-react';
import LectureObj from '../../../models/LectureObj';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';

const styles = theme => ({
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    gridItem: {
        margin: theme.spacing.unit
    },
    gridItemButton: {
        margin: theme.spacing.unit*2
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 400,
    },
});

@inject("profStore")
@inject("apiService")
class ProfessorAddLecture extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.courseId = this.props.match.params.courseId
        
        const date = new Date();
       
        this.state = {
            toLecture: false,
            title: "Lecture ",
            courseId: this.courseId,
            numLects: this.props.location.state.numLects.toString(),
            errors: {title: ''},
            titleValid: true,
            formValid: false,
            selectedDate: date
        }
    }

    componentDidMount() {
        const lectString = "Lecture " + this.state.numLects.toString();
        this.setState({
            title: lectString
        })
        this.handleValidation()
    }


    handleValidation() {
        let titleValid = this.state.titleValid;
        let errors = this.state.errors;

        if (this.state.title === '') {
            errors.title = "This field is required."
            titleValid = false
        }
        else {
            titleValid = true
        }

        this.setState({ titleValid: titleValid }, this.validateForm);
    }

    validateForm() {
        this.setState({formValid: this.state.titleValid });
    }


    handleDateChange = date => {
        this.setState({
            selectedDate: date
        })
    }  

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        }, () => { this.handleValidation() });
    };

    handleSubmit = () => {
        // Send course to API
        this.props.apiService.addLecture(
            new LectureObj(this.state.title, this.state.selectedDate, null, this.state.courseId)
        )
        this.setState({ toLecture: true });
    }

    render() {
        if (this.state.toLecture === true) {
            return <Redirect to={'/professor/' + this.state.courseId + '/lectures'} push />
        }

        return (
            <div className={this.styles.paper}>
                <Grid container direction="column">
                    <Grid item className={this.styles.gridItem}>
                        <Typography variant="h6" color="textPrimary">
                            Add New Lecture:
                        </Typography>
                    </Grid>
                    <form noValidate autoComplete="off">
                    <Grid item className={this.styles.gridItem}>
                        <TextField
                            requiredtitle="true"
                            error={!this.state.titleValid}
                            id="standard-name"
                            label="Lecture Title"
                            className={this.styles.textField}
                            value={this.state.title}
                            onChange={this.handleChange('title')}
                            margin="normal"
                            helperText={this.state.errors["title"]}
                        />
                    </Grid>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid item className={this.styles.gridItem}>
                        <DatePicker
                            margin="normal"
                            label="Lecture Date"
                            value={this.state.selectedDate}
                            onChange={this.handleDateChange}
                            className={this.styles.textField}
                        />
                        </Grid>
                    </MuiPickersUtilsProvider>
                    <Grid item className={this.styles.gridItemButton}>
                        <Button
                            disabled={!this.state.formValid}
                            variant="outlined"
                            color="primary"
                            className={this.styles.container}
                            onClick={this.handleSubmit}>
                                Submit
                        </Button>
                   </Grid>
                    </form>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(ProfessorAddLecture);
