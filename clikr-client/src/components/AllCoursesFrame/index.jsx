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

const styles = theme => ({
    card: {
        minWidth: 275,
    },
});

@observer
class AllCoursesFrame extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = props.apiProfService
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
                            {this.profStore.courses.map(function (courseObj, index) {
                                return (<ListItem button key={index} >
                                    <ListItemText primary={courseObj.title} />
                                </ListItem>)
                            })}
                        </List>
                        <AddCourseModalWrapped apiProfService={this.apiProfService}></AddCourseModalWrapped>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default withStyles(styles)(AllCoursesFrame);
