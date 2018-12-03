import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { observer } from 'mobx-react';
import AddStudentsModalWrapped from '../AddStudentsModal';
import TopCoursesStatFrame from '../TopCoursesStatFrame';

const styles = theme => ({
    card: {
        minWidth: 275,
    },
});

@observer
class ListOfAllCoures extends React.Component {
    state = {
        courseId: "",
        title: "",
        redirect: false

    }

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
    }

    handleCourseClick = courseObj => () => {
        this.setState(() => ({
            courseId: courseObj.id,
            courseObj: courseObj,
            redirect: TopCoursesStatFrame
        }))
    }

    render() {
        // Handle routes
        if (this.state.redirect) {
            return <Redirect from="/professor" to={{pathname:"/professor/view-lectures/" + this.state.courseId, state:{courseObj: this.state.courseObj}}} push />
        }
        
        return (
            <List component="nav">
                {this.profStore.courses.map((courseObj, index) => {
                    return (
                        <ListItem divider button key={index} onClick={this.handleCourseClick(courseObj)} >
                            <ListItemText primary={courseObj.title} />
                            <ListItemSecondaryAction>
                                <AddStudentsModalWrapped profStore={this.profStore} joinCode={courseObj.joinCode} />
                            </ListItemSecondaryAction>
                        </ListItem>
                    )
                })}
            </List>
        );
    }
}

export default withStyles(styles)(ListOfAllCoures);
