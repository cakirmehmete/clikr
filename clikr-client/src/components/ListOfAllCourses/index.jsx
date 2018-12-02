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
class ListOfAllCoures extends React.Component {
    state = {
        referrerCourseIndex: -1
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
    }

    handleCourseClick = index => () => {
        this.setState(() => ({
            referrerCourseIndex: index
        }))
    }

    render() {
        // Handle routes
        if (this.state.referrerCourseIndex !== -1) {
            this.profStore.course_id = this.profStore.courses[this.state.referrerCourseIndex].id
            return <Redirect to='/professor/view-lectures'/>
        }
        
        return (
            <List component="nav">
                {this.profStore.courses.map((courseObj, index) => {
                    return (
                        <ListItem divider button key={index} onClick={this.handleCourseClick(index)} >
                            <ListItemText primary={courseObj.title} />
                            <ListItemSecondaryAction>
                                <AddStudentsModalWrapped profStore={this.profStore} courseIndex={index} />
                            </ListItemSecondaryAction>
                        </ListItem>
                    )
                })}
            </List>
        );
    }
}

export default withStyles(styles)(ListOfAllCoures);
