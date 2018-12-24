import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Redirect } from "react-router-dom";
import { inject } from 'mobx-react';
import LectureObj from '../../../models/LectureObj';

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
        let year = date.getFullYear();
        let month = date.getMonth();
        if (month.toString().length === 1) {
            month = "0" + month.toString();
        }
        else {
            month = month.toString();
        }
        let day = date.getDate();
        if (day.toString().length === 1) {
            day = "0" + day.toString();
        } 
        else {
            day = day.toString();
        }
        this.state = {
            toLecture: false,
            title: "Lecture ",
            courseId: this.courseId,
            numLects: this.props.location.state.numLects.toString(),
            errors: {title: ''},
            titleValid: true,
            formValid: false,
            date: year + "-" + month + "-" + day
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


    handleDate = (e) => {
        this.setState({
            [e.target.name]: e.target.value
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
            new LectureObj(this.state.title, this.state.date, null, this.state.courseId)
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
                    <Grid item className={this.styles.gridItem}>
                        <TextField
                            id="date"
                            className={this.styles.textField}
                            name='date'
                            onChange={e => this.handleDate(e)}
                            type="date"
                            defaultValue={this.state.date}
                            InputLabelProps={{
                            shrink: true,
                            }}
                        />
                    </Grid>
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
