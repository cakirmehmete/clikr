import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import ListItem from '@material-ui/core/ListItem';
import { observer } from 'mobx-react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import DoneIcon from '@material-ui/icons/Done';
import Tooltip from '@material-ui/core/Tooltip';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import InputBase from '@material-ui/core/InputBase';
import ListItemText from '@material-ui/core/ListItemText';
import FormControl from '@material-ui/core/FormControl';
import AddStudentsModal from '../AddStudentsModal';
import Grid from '@material-ui/core/Grid';
import { baseURL } from '../../constants/api';

const styles = theme => ({
    iconDone: {
        color: theme.palette.primary.light
    },
    iconEdit: {
        color: theme.palette.secondary
    },
    bootstrapInput: {
        borderRadius: 4,
        backgroundColor: theme.palette.common.white,
        border: '1px solid #ced4da',
        fontSize: 14,
        padding: '10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
          borderColor: '#80bdff',
          boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
      },
});

@observer
class CourseListItemNavEdit extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = props.apiProfService
        this.courseId = props.courseId
        this.courseTitle = props.courseTitle
        this.joinCode = props.joinCode
    }
    state = {
        editMode: false,
        courseTitle: this.courseTitle,
        newTitle: "",
        nav: false,
        courseId: this.courseId
    }

    componentDidMount() {
        this.setState({
            courseTitle: this.courseTitle,
            newTitle: this.courseTitle,
            courseId: this.courseId
        })
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.editMode) {
            if (nextProps.courseTitle !== this.courseTitle) {
                this.joinCode = nextProps.joinCode;
                this.setState({
                    courseTitle: nextProps.courseTitle,
                    newTitle: nextProps.courseTitle,
                    courseId: nextProps.courseId,
                    joinCode: nextProps.joinCode,
                })
            }
        } 
    }

    handleEdit = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    
    handleEditOpen = () => {
        this.setState({
            editMode: true
        })
    }

    handleEditClose = () => {

        // only close if the title is not empty space
        if (this.state.newTitle.replace(/\s/g, '').length > 0) {
            this.apiProfService.changeCourseTitle(this.state.courseId, this.state.newTitle);
            this.setState({
                courseTitle: this.state.newTitle,
                editMode: false,
            })
        }
        else { // defaults to not changing title if invalid title is input
            this.setState({
                editMode: false
            })
        }
    }

    handleToCourse = () => {
        this.setState({
            nav: true
        })
    }

    render () {
        if (this.state.nav) {
            return  <Redirect to={'/professor/' + this.state.courseId + '/lectures'} push />
        }
        if (this.state.editMode) {
            return (
                <ListItem divider>
                    <FormControl>
                        <InputBase
                        id="bootstrap-input"
                        name="newTitle"
                        value={this.state.newTitle}
                        onChange={e => this.handleEdit(e)}
                        classes={{
                            input: this.styles.bootstrapInput
                        }}
                        />
                    </FormControl>
                    <ListItemSecondaryAction>
                        <Grid container direction="row" justify="flex-end" >
                            <Grid item>
                                <Tooltip title="done editing" placement="top">
                                    <IconButton color="secondary" onClick={this.handleEditClose}>
                                        <DoneIcon className={this.styles.iconDone}/>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <Tooltip title="Export Grades" placement="top">
                                    <IconButton color="secondary" href={baseURL + "professor/courses/" + this.courseId + "/exportgrades"} target="_blank">
                                        <ImportExportIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <AddStudentsModal profStore={this.profStore} joinCode={this.state.joinCode} />
                            </Grid>  
                        </Grid>
                    </ListItemSecondaryAction>
                </ListItem>
            )
        }
        else {
            return (
                 <ListItem button divider onClick={this.handleToCourse}>
                   <ListItemText primary={this.state.courseTitle} />
                    <ListItemSecondaryAction>
                        <Grid container direction="row" justify="flex-end">
                            <Grid item>
                                <Tooltip title="change title" placement="top">
                                    <IconButton color="secondary" onClick={this.handleEditOpen}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <Tooltip title="Export Grades" placement="top">
                                    <IconButton color="secondary" href={baseURL + "professor/courses/" + this.courseId + "/exportgrades"} target="_blank">
                                        <ImportExportIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <AddStudentsModal profStore={this.profStore} joinCode={this.joinCode} />
                            </Grid>
                        </Grid>
                    </ListItemSecondaryAction>
                </ListItem>
            )
        }
    }
}

export default withStyles(styles)(CourseListItemNavEdit);