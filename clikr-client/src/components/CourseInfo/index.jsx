import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { observer } from 'mobx-react';
import CourseObj from '../../models/LectureObj';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import DoneIcon from '@material-ui/icons/Done';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    card: {
        minWidth: 275,
    },
    icon: {
        margin: theme.spacing.unit,
    },
    title: {
        margin: theme.spacing.unit,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 350,
    }
});


@observer
class CourseInfo extends React.Component {
    state = {
        parentCourse: new CourseObj(),
        editMode: false
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = props.apiProfService
        this.courseId = props.courseId
    }

    componentDidMount() {
        if (this.courseId !== undefined) {
            if (!this.profStore.dataLoaded) {
                this.apiProfService.loadData().then(() => {
                    this.profStore.dataLoaded = true;
                    this.setState({
                        parentCourse: this.profStore.getCourseWithId(this.courseId)
                    })
                })
            } else {
                this.setState({
                    parentCourse: this.profStore.getCourseWithId(this.courseId)
                })
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.courseId !== undefined) {
            this.setState({
                parentCourse: this.profStore.getCourseWithId(nextProps.courseId)
            })
        }
    }

    handleChange = (event) => {
        const { name, value } = event.target
        this.setState(prevState => {
            let newCourse = {...prevState.parentCourse}
            newCourse[name] = value
            return { parentCourse: newCourse, editMode: prevState.editMode }
        })
    }

    handleEditOpen = () => {
        this.setState({
            editMode: true
        })
    }

    handleEditClose = () => {
        this.apiProfService.changeCourseData(this.state.parentCourse.id, this.state.parentCourse);
        this.setState({
            editMode: false,
        })
    }

    render() {
        if (this.state.editMode) {
            return (
                <Grid container direction='column' justify='space-between' alignItems='stretch'>
                    <Grid item xs={12}>
                        <Grid container direction='row' justify='space-between' alignItems='stretch'>
                            <Grid item xs={11}>
                                <TextField
                                    label="Course Name"
                                    name="title"
                                    className={this.styles.textField}
                                    value={this.state.parentCourse.title}
                                    onChange={this.handleChange}
                                    margin="normal"
                                />

                                <TextField
                                    label="Department"
                                    name="dept"
                                    className={this.styles.textField}
                                    value={this.state.parentCourse.dept}
                                    onChange={this.handleChange}
                                    margin="normal"
                                />

                                <TextField
                                    label="Course Number"
                                    name="coursenum"
                                    className={this.styles.textField}
                                    value={this.state.parentCourse.coursenum}
                                    onChange={this.handleChange}
                                    margin="normal"
                                />
                            </Grid>

                            <Grid item>
                                <Tooltip title="Done Editing" placement="top">
                                    <IconButton color="secondary" disabled={!this.state.parentCourse.title} onClick={this.handleEditClose}>
                                        <DoneIcon className={this.styles.iconDone}/>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>

                        <Grid container direction='row' justify='space-between' alignItems='stretch'>
                            <Grid item xs={12}>
                                <TextField
                                    label="Term"
                                    name="term"
                                    className={this.styles.textField}
                                    value={this.state.parentCourse.term}
                                    onChange={this.handleChange}
                                    margin="normal"
                                />

                                <TextField
                                    label="Year"
                                    name="year"
                                    className={this.styles.textField}
                                    value={this.state.parentCourse.year}
                                    onChange={this.handleChange}
                                    margin="normal"
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            label="Description"
                            name="description"
                            className={this.styles.textField}
                            value={this.state.parentCourse.description}
                            onChange={this.handleChange}
                            multiline={true}
                            margin="normal"
                        />
                    </Grid>
                </Grid>
            )
        } else {
            return (
                <Grid container direction='row' justify='space-between' alignItems='stretch'>
                    <Grid item xs={12}>
                        <Grid container direction='row' justify='space-between' alignItems='stretch'>
                            <Grid item>
                                <Typography className={this.styles.title} 
                                            variant="h4" 
                                            color="inherit">
                                                {this.state.parentCourse.dept} {this.state.parentCourse.coursenum} - {this.state.parentCourse.title} 
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Tooltip title="Edit Course Info" placement="top">
                                    <IconButton color="secondary" onClick={this.handleEditOpen}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                            
                        <Typography className={this.styles.title} variant="h8" color="inherit">{this.state.parentCourse.term} {this.state.parentCourse.year}</Typography>
                        <Divider />
                        <Typography className={this.styles.title} variant="body2" color="inherit">{this.state.parentCourse.description}</Typography>
                    </Grid>
                </Grid>
            )
        }
        
    }
}

export default withStyles(styles)(CourseInfo);
