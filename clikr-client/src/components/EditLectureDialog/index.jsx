import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { inject } from 'mobx-react';
import Collapse from '@material-ui/core/Collapse';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import LectureObj from '../../models/LectureObj';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';

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
@observer
class EditLectureDialog extends React.Component {

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = props.apiService

        const date = new Date()

        this.state = {
            open: false,
            title: "",
            courseId: "",
            id: "",
            scheduled: false,
            titleValid: true,
            formValid: false,
            selectedDate: date,
            dateValid: true,
            openDate: date,
            closeDate: date
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.lectureObj !== undefined) {
            this.setState({
                title: nextProps.lectureObj.title,
                scheduled: nextProps.lectureObj.scheduled,
                selectedDate: new Date(nextProps.lectureObj.date),
                courseId: nextProps.lectureObj.courseId,
                id: nextProps.lectureObj.id
            }, () => { this.handleValidation() })

            if (nextProps.lectureObj.scheduled) {
                this.setState({
                    openDate: new Date(nextProps.lectureObj.open_date),
                    closeDate: new Date(nextProps.lectureObj.close_date)
                }, () => { this.handleValidation() })
            }
        }
    }

    handleValidation() {
        let dateValid = this.state.dateValid;
        let titleValid = this.state.title !== ''

        if (this.state.scheduled) {
            dateValid = this.state.closeDate.getTime() >= this.state.openDate.getTime()
        } else {
            dateValid = true
        }

        this.setState({ titleValid: titleValid, dateValid: dateValid }, this.validateForm);
    }
    
    validateForm() {
        this.setState({formValid: this.state.titleValid && this.state.dateValid });
    }

    modifyDate = date => {
        console.log(date.getYear(), date.getMonth(), date.getDate());
        date = new Date(Date.UTC(date.getYear(), date.getMonth(), date.getDate(), 0, 0, 0));
        console.log(date);

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

    handleOpen = () => {
        this.setState({ open: true })
    }

    handleClose = () => {
        this.setState({ open: false })
    }

    handleSubmit = () => {
        // Send course to API
        this.props.apiService.editLecture(
            new LectureObj(this.state.title, this.state.selectedDate, this.state.id, this.state.courseId, null, 
                this.state.scheduled, this.state.openDate, this.state.closeDate)
        )
        .then(() => {
            this.handleClose();
        })
    }
    
    render() {
        return (
            <div>
                <Button variant="outlined" onClick={this.handleOpen}>
                    <Typography variant="h7" color="textPrimary">
                        Edit
                    </Typography>
                </Button>
                <Dialog
                    fullWidth
                    scroll="paper"
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Edit Lecture Information"}</DialogTitle>
                    <DialogContent>
                    <Grid container direction="column">
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
                                            error={!this.state.dateValid}
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
                                            error={!this.state.dateValid}
                                        />
                                    </Grid>
                                </Grid>
                                
                            </MuiPickersUtilsProvider>
                        </Collapse>

                    </Grid>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.handleClose} type="button" autoFocus color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleSubmit} type="submit" color="secondary" disabled={!this.state.formValid}>
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
export default withStyles(styles)(EditLectureDialog);