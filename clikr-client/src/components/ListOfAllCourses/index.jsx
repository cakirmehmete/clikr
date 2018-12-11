import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { observer } from 'mobx-react';
import AddStudentsModalWrapped from '../AddStudentsModal';
import DeleteCourseDialog from '../DeleteCourseDialog';
import Grid from '@material-ui/core/Grid';
import EditCourseDialog from '../EditCourseDialog'

const styles = theme => ({
    card: {
        minWidth: 275,
    },
});

@observer
class ListOfAllCoures extends React.Component {
    state = {
        referrerCourseId: null,
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
    }
    
    handleCourseClick = id => () => {
        this.setState(() => ({
            referrerCourseId: id
        }))
    }
    
    render() {
        // Handle routes
        if (this.state.referrerCourseId !== null) {
            return <Redirect to={'/professor/' + this.state.referrerCourseId + '/lectures'} push />
        }
        return (
            <List component="nav">
                {this.profStore.courses.map((courseObj, index) => {
                    return (
                        <ListItem divider button key={index} onClick={this.handleCourseClick(courseObj.id)} >
                                <ListItemText primary={courseObj.title} />
                                    <ListItemSecondaryAction>
                                        <Grid container direction="row" justify="flex-end">
                                            <EditCourseDialog course={courseObj} sendData={this.getData}/>
                                            <DeleteCourseDialog courseId={courseObj.id} courseTitle={courseObj.title}/>
                                            <AddStudentsModalWrapped joinCode={courseObj.enroll_code}/>
                                        </Grid>
                                    </ListItemSecondaryAction>
                        </ListItem>
                    )
                })}
            </List>
        );
    }
}

export default withStyles(styles)(ListOfAllCoures);
