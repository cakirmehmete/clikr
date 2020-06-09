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
import Grid from '@material-ui/core/Grid';
import LectureObj from '../../models/LectureObj';
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
class LectListItemNavEdit extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = props.apiProfService
        this.lecture = props.lecture
    }
    
    state = {
        editMode: false,
        lecture: new LectureObj(),
        newTitle: "",
        nav: false
    }

    componentDidMount() {
        if (this.lecture !== undefined) {
            this.setState({
                lecture: this.lecture,
                newTitle: this.lecture.title
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.editMode) {
            if (nextProps.lecture !== undefined && nextProps.lecture.id !== this.state.lecture.id) {
                this.setState({
                    lecture: nextProps.lecture,
                    newTitle: nextProps.lecture.title
                })
            }
        } 
    }

    handleEdit = (e) => {
        const {name, value} = e.target
        this.setState({
            [name]: value
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
            this.apiProfService.changeLectureTitle(this.state.lecture.id, this.state.newTitle);
            this.setState({
                editMode: false
            })
        }
        else { // defaults to not changing title if invalid title is input
            this.setState({
                editMode: false
            })
        }
    }

    handleToLecture = () => {
        this.setState({
            nav: true
        })
    }

    handleExportGrades = () => {
        this.apiProfService.exportGradesLecture(this.state.lecture.id)
            .then(data => {
                const element = document.createElement("a");
                const file = new Blob([data.fileData], {type: 'text/csv;charset=utf-8;'});
                element.href = URL.createObjectURL(file);
                element.download = data.fileName;
                document.body.appendChild(element); // Required for this to work in FireFox
                element.click();
            })
    }

    render () {
        if (this.state.nav) {
            return  <Redirect to={'/professor/' + this.state.lecture.id + '/questions'} push />
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
                        <Grid container direction="row" justify="flex-end">  
                            <Grid item>
                                <Tooltip title="Done Editing" placement="top">
                                    <IconButton color="secondary" onClick={this.handleEditClose}>
                                        <DoneIcon className={this.styles.iconDone}/>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <Tooltip title="Export Grades" placement="top">
                                    <IconButton color="secondary" href={baseURL + "professor/lectures/" + this.state.lecture.id + "/exportgrades"} target="_blank">
                                        <ImportExportIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </ListItemSecondaryAction>
                </ListItem>
            )
        }
        else {
            return (
                 <ListItem button divider onClick={this.handleToLecture}>
                   <ListItemText primary={this.state.lecture.title} secondary={this.state.lecture.date} />
                        <ListItemSecondaryAction>  
                            <Grid container direction="row" justify="flex-end">  
                                <Grid item>
                                    <Tooltip title="Change Title" placement="top">
                                        <IconButton color="secondary" onClick={this.handleEditOpen}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                                <Grid item>
                                    <Tooltip title="Export Grades" placement="top">
                                        <IconButton color="secondary" onClick={this.handleExportGrades}>
                                            <ImportExportIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </ListItemSecondaryAction>
                </ListItem>
            )
        }
    }
}

export default withStyles(styles)(LectListItemNavEdit);