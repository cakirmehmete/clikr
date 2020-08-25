import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { Redirect } from "react-router-dom";
import { inject } from 'mobx-react';
import LectureObj from '../../../models/LectureObj';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from "@date-io/moment";

const styles = theme => ({
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 80,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    gridItem: {
        margin: theme.spacing.unit
    },
    dateField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: theme.spacing.unit * 30,
    },
    gridItemButton: {
        margin: theme.spacing.unit*2
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: theme.spacing.unit * 60,
    },
});

@inject("profStore")
@inject("apiService")
class ProfessorAddLecture extends React.Component {
    constructor(props) {
        super(props)
        MomentUtils.prototype.getStartOfMonth =
          MomentUtils.prototype.startOfMonth;
        this.styles = props.classes
        this.profStore = props.profStore
        this.courseId = this.props.match.params.courseId
        
        const date = new Date();
       
        this.state = {
            toLecture: false,
            title: "Lecture ",
            courseId: this.courseId,
            // description: "",
            scheduled: false,
            numLects: this.props.location.state.numLects.toString(),
            errors: {title: ''},
            titleValid: true,
            formValid: false,
            selectedDate: date,
            dateValid: true,
            openDate: date,
            closeDate: date
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
        let dateValid = this.state.dateValid;
        let errors = this.state.errors;

        if (this.state.title === '') {
            errors.title = "This field is required."
            titleValid = false
        }
        else {
            titleValid = true
        }

        if (this.state.scheduled) {
            dateValid = this.state.closeDate.getTime() >= this.state.openDate.getTime()
        }

        this.setState({ titleValid: titleValid, dateValid: dateValid }, this.validateForm);
    }


    validateForm() {
        this.setState({formValid: this.state.titleValid && this.state.dateValid });
    }

    modifyDate = date => {
        date = new Date(Date.UTC(date.getYear() + 1900, date.getMonth(), date.getDate(), 12, 0, 0));

        return date;
    }

    handleDateChange = date => {
        date = this.modifyDate(date);

        this.setState({
            selectedDate: date
        })
    }

    handleOpenDateChange = date => {
        date = this.modifyDate(date);

        this.setState({ 
            openDate: date
        }, () => { this.handleValidation() })
    }

    handleCloseDateChange = date => {
        date = this.modifyDate(date);

        this.setState({
            closeDate: date
        }, () => { this.handleValidation() })
    }

    handleChange = (event) => {
        const {name, value} = event.target
        this.setState({
            [name]: value
        }, () => { this.handleValidation() });
    };

    handleCheck = (event) => {
        const {name, checked} = event.target
        this.setState({
            [name]: checked
        }, () => {this.handleValidation() });
    }

    handleSubmit = () => {
        this.props.apiService.addLecture(
            new LectureObj(this.state.title, this.state.selectedDate, null, this.state.courseId, null, this.state.scheduled, this.state.openDate, this.state.closeDate)
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
                            name="title"
                            label="Lecture Title"
                            className={this.styles.textField}
                            value={this.state.title}
                            onChange={this.handleChange}
                            margin="normal"
                            helperText={this.state.errors["title"]}
                            multiline={true}
                        />
                    </Grid>

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid item className={this.styles.gridItem}>
                            <DatePicker
                                margin="normal"
                                label="Lecture Date"
                                name="selectedDate"
                                value={this.state.selectedDate}
                                onChange={this.handleDateChange}
                                className={this.styles.dateField}
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>

                    <Grid item className={this.styles.gridItem}>
                        <Grid container direction="row" alignItems="center">
                            <Grid item>
                                <Checkbox
                                    checked={this.state.scheduled}
                                    onChange={this.handleCheck}
                                    name="scheduled"
                                />
                            </Grid>

                            <Grid item>
                                <Typography variant="body2" color="textPrimary">
                                    Schedule the Lecture to Open and Close at Specific Dates
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Collapse in={this.state.scheduled} timeout="auto" unmountOnExit>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container direction="row">
                                <Grid item className={this.styles.gridItem}>
                                    <DatePicker
                                        margin="normal"
                                        label="Start Date"
                                        name="openDate"
                                        value={this.state.openDate}
                                        onChange={this.handleOpenDateChange}
                                        className={this.styles.dateField}
                                    />
                                </Grid>

                                <Grid item className={this.styles.gridItem}>
                                    <DatePicker
                                        margin="normal"
                                        label="End Date"
                                        name="closeDate"
                                        value={this.state.closeDate}
                                        onChange={this.handleCloseDateChange}
                                        className={this.styles.dateField}
                                    />
                                </Grid>
                            </Grid>
                            
                        </MuiPickersUtilsProvider>
                    </Collapse>

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
