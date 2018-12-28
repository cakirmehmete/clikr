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
class DeleteLecturesList extends React.Component {

    state = {
        referrerLectureId: null,
        delLectures: [],
        lectures: [],
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.courseId  = props.courseId
    }
    componentDidMount() {
        let shouldDelete = []
        this.profStore.getCourseLectures(this.courseId).map(lectureObj => 
           shouldDelete.push({
            id: lectureObj.id,
            checked: false,
            title: lectureObj.title
        }))
        if (this.courseId !== undefined) {
            this.setState({
                lectures: this.profStore.getCourseLectures(this.courseId),
                delLectures: shouldDelete
            })
        }
        
    }

    handleChange = id =>  event => {
        // if id in lectures, then we are unchecking; otherwise we need to uncheck
        this.state.delLectures.find(x => x.id === id).checked = event.target.checked;
        this.setState({
            delLectures: this.state.delLectures
        })
        // send checked boxes back to parent
        this.props.getDeletions(this.state.delLectures);
    }


    render() {
        return (
            <FormControl component="fieldset" fullWidth>
                <FormGroup
                    name="delLectures"
                    value={this.state.delLectures}
                    onChange={this.handleChange}
                    >
                    <List component="nav">
                            {this.state.delLectures.map((lect, index) => {
                                return (
                                    <ListItem divider key={index}>
                                        <ListItemText primary={lect.title}/>
                                        <ListItemSecondaryAction>
                                            <FormControlLabel key={index} control={
                                                    <Checkbox className={this.styles.checkBox} key={lect.id} checked={lect.checked} onChange={this.handleChange(lect.id)} value={lect.id} />
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

export default withStyles(styles)(DeleteLecturesList);