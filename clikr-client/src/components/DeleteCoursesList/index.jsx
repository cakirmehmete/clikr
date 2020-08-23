import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import { observer } from 'mobx-react';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';


const styles = theme => ({
    checkBox: {
        color: theme.palette.primary.dark,
    }
});

@observer
class DeleteCoursesList extends React.Component {

    state = {
        referrerLectureId: null,
        delCourses: [],
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
    }

    componentDidMount() {
        let shouldDelete = []
        var courses = this.profStore.courses.filter((courseObj) => {
            return courseObj.is_current !== this.props.archive
        })
        
        courses.forEach(courseObj => {
            shouldDelete.push({
                id: courseObj.id,
                checked: false,
                title: courseObj.title,
                term: courseObj.term,
                year: courseObj.year
            })
        })

        this.setState({
            delCourses: shouldDelete
        })
    }

    handleChange = id =>  event => {
        // if id in courses, then we are unchecking; otherwise we need to uncheck
        this.state.delCourses.find(x => x.id === id).checked = event.target.checked;
        this.setState({
            delCourses: this.state.delCourses
        })
        // send checked boxes back to parent
        this.props.getDeletions(this.state.delCourses);
    }


    render() {
        return (
            <FormControl component="fieldset" fullWidth>
                <FormGroup
                    name="delCourses"
                    value={this.state.delCourses}
                    onChange={this.handleChange}
                    >
                    <List component="nav">
                            {this.state.delCourses.map((c, index) => {
                                return (
                                    <ListItem divider key={index}>
                                        <ListItemText primary={c.title} secondary={c.term + ' ' + c.year} />
                                        <ListItemSecondaryAction>
                                            <FormControlLabel key={index} control={
                                                    <Checkbox className={this.styles.checkBox} key={c.id} checked={c.checked} onChange={this.handleChange(c.id)} value={c.id} />
                                                }/>
                                        </ListItemSecondaryAction> 
                                    </ListItem>   
                                )
                            })}
                    </List>
                </FormGroup>
            </FormControl>
        );
    }
}

export default withStyles(styles)(DeleteCoursesList);