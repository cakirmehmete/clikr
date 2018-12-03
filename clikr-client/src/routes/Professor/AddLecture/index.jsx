import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Redirect } from "react-router-dom";
import { observer, inject } from 'mobx-react';
import APIProfService from '../../../services/APIProfService';
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
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 400,
    },
});

@inject("profStore")
@observer
class ProfessorAddLecture extends React.Component {
    state = {
        toLecture: false,
        title: '',
        date: '',
        description: '',
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
        this.apiProfService.addLecture(
            new LectureObj(this.state.title, this.state.description, this.state.date, null, this.props.location.state.courseObj.courseObj.id)
        )

        this.setState({ toLecture: true });
    }

    render() {
        if (this.state.toLecture === true) {
            return <Redirect from="/professor/add-lecture" to={{pathname:"/professor/view-lectures/" + this.props.location.state.courseObj.courseObj.id, state:{courseObj: this.props.location.state.courseObj.courseObj}}} push />
        }

        return (
            <div className={this.styles.paper}>
                <Typography variant="h6" color="textPrimary">
                    Add New Lecture:
                </Typography>
                <form className={this.styles.container} noValidate autoComplete="off">
                    <TextField
                        id="standard-name"
                        label="Lecture Title"
                        className={this.styles.textField}
                        value={this.state.title}
                        onChange={this.handleChange('title')}
                        margin="normal"
                    />
                    <TextField
                        id="standard-name"
                        label="Lecture Description"
                        className={this.styles.textField}
                        value={this.state.description}
                        onChange={this.handleChange('description')}
                        margin="normal"
                    />
                    <TextField
                        id="standard-name"
                        label="Lecture Date"
                        className={this.styles.textField}
                        value={this.state.date}
                        onChange={this.handleChange('date')}
                        margin="normal"
                    />
                    <Button variant="outlined" color="primary" onClick={this.handleSubmit}>Submit</Button>
                </form>
            </div>
        );
    }
}

export default withStyles(styles)(ProfessorAddLecture);
