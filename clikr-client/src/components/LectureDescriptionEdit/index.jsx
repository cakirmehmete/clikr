import React from "react";
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
    text: {
        color: '#ffffff',
        width: theme.spacing.unit * 43
    },
    multilineColor: {
        color: '#ffffff'
    },
    container: {
        width: theme.spacing.unit * 50
    },
    textField: {
        width: theme.spacing.unit * 43
    }
});

@inject("profStore")
@inject("apiService")
@observer
class LectureDescriptionEdit extends React.Component {
    state = {
        description: "",
        editMode: false,
        parentLecture: {}
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = props.apiService
        this.parentLecture = props.parentLecture
    }

    handleOpen = () => {
        this.setState({ editMode: true })
    }

    handleClose = () => {
        this.apiProfService.changeLectureDescription(this.state.parentLecture.id, this.state.description)
            .then(id => {
                debugger;
                this.setState({ 
                    editMode: false,
                    parentLecture: this.profStore.getLectureWithId(id)
                })
            })
    }

    handleChange = (event) => {
        const {name, value} = event.target
        this.setState({ [name]: value })
    }

    componentDidMount() {
        if (this.parentLecture !== undefined) {
            this.setState({
                parentLecture: this.parentLecture,
                description: this.parentLecture.description
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.parentLecture !== undefined) {
            this.setState({
                parentLecture: nextProps.parentLecture,
                description: nextProps.parentLecture.description
            })
        }
    }

    render() {
        if (this.state.editMode) {
            return (
                <Grid container direction='row' justify='space-between' className={this.styles.container}>
                    <Grid item>
                        <TextField
                            label="Description"
                            name="description"
                            className={this.styles.textField}
                            value={this.state.description}
                            onChange={this.handleChange}
                            InputProps={{
                                className: this.styles.multilineColor
                            }}
                            margin="none"
                            multiline={true}
                        />
                    </Grid>
                    <Grid item>
                        <Tooltip title="Done Editing" placement="top">
                            <IconButton color="primary" onClick={this.handleClose}>
                                <DoneIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            )
        }
        return (
            <Grid container direction='row' justify='space-between' className={this.styles.container}>
                <Grid item>
                    <Typography variant="body2" component="body2" className={this.styles.text}>
                        {this.state.parentLecture.description}
                    </Typography>
                </Grid>
                <Grid item>
                    <Tooltip title="Edit Description" placement="top">
                        <IconButton color="primary" onClick={this.handleOpen}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(LectureDescriptionEdit);
