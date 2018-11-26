import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { observer } from 'mobx-react';
import AddCourseModalWrapped from '../../components/addCourseModal';

const drawerWidth = 240;

const styles = theme => ({
    content: {
        marginLeft: drawerWidth,
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
    },
    card: {
        minWidth: 275,
    },
});

@observer
class AllCoursesFrame extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.courseStore = props.courseStore
        this.apiService = props.apiService
    }

    render() {
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
                            {this.courseStore.courses.map(function (courseObj, index) {
                                return (<ListItem button key={index} >
                                    <ListItemText primary={courseObj.title} />
                                </ListItem>)
                            })}
                        </List>
                        <AddCourseModalWrapped apiService={this.apiService}></AddCourseModalWrapped>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default withStyles(styles)(AllCoursesFrame);
