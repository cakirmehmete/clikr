import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { observer } from 'mobx-react';
import AddStudentsModalWrapped from '../AddStudentsModal';

const styles = theme => ({
    card: {
        minWidth: 275,
    },
});

@observer
class AllCoursesFrame extends React.Component {
    state = {
        toNewCourse: false,
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = props.apiProfService
    }

    handleNewCourseClick = () => {
        this.setState(() => ({
            toNewCourse: true
        }))
    }

    render() {
        if (this.state.toNewCourse === true) {
            return <Redirect to='/professor/new-course' />
        }

        return (
            <div>
                <Typography variant="subtitle1" color="textPrimary">
                    Here are your courses:
                </Typography>
                <Card className={this.styles.card}>
                    <CardContent>
                        <Typography variant="h6" color="inherit">
                            Courses
                        </Typography>
                        <List component="nav">
                            {this.profStore.courses.map((courseObj, index) => {
                                return (
                                    <ListItem divider button key={index} >
                                        <ListItemText primary={courseObj.title} />
                                        <ListItemSecondaryAction>
                                            <AddStudentsModalWrapped profStore={this.profStore} courseIndex={index} />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )
                            })}
                        </List>
                        <Button onClick={this.handleNewCourseClick} variant="outlined" color="primary">Add Class</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default withStyles(styles)(AllCoursesFrame);
