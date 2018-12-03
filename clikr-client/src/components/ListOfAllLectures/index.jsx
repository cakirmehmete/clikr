import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { observer } from 'mobx-react';
import AddStudentsModalWrapped from '../AddStudentsModal';

const styles = theme => ({
    card: {
        minWidth: 275,
    },
});

@observer
class ListOfAllLectures extends React.Component {
    state = {
        lectureObj: "", 
        lectureId: ""
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
    }

    handleLectureClick = lectureObj => () => {
        this.setState(() => ({
            lectureObj: lectureObj, 
            lectureId: lectureObj.id
        }))
    }

    render() {
        // Handle routes
        if (this.state.lectureId !== "") {
            return <Redirect from='/professor/view-lectures' to={{pathname:"/professor/view-questions/" + this.state.lectureId, state:{lectureObj: this.state.lectureObj}}} push />
        }
        
        return (
            <List component="nav">
                {this.profStore.lectures.map((lectureObj, index) => {
                    return (
                        <ListItem divider button key={index} onClick={this.handleLectureClick(lectureObj)} >
                            <ListItemText primary={lectureObj.title + " Lecture on " + lectureObj.date} />
                        </ListItem>
                    )
                })}
            </List>
           
        );
    }
}

export default withStyles(styles)(ListOfAllLectures);
