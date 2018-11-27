import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { observer } from 'mobx-react';

const styles = theme => ({
    card: {
        minWidth: 275,
    },
});

@observer
class AllQuestionsFrame extends React.Component {
    state = {
        toNewQuestion: false,
        referrerQuestionIndex: -1
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = props.apiProfService
        this.parentCourse = this.profStore.getCourseWithId(this.profStore.course_id)
    }

    componentDidMount() {
        this.apiProfService.loadLecturesForCourse(this.parentCourse.id)
    }

    handleNewLectureClick = () => {
        this.setState(() => ({
            toNewLecture: true
        }))
    }

    handleLectureClick = index => () => {
        this.setState(() => ({
            referrerLectureIndex: index
        }))
    }

    render() {
        // Handle routes
        if (this.state.toNewLecture === true) {
            return <Redirect to='/professor/add-lecture' />
        }

        return (
            <div>
                <Typography variant="subtitle1" color="textPrimary">
                    Here are your lectures:
                </Typography>
                <Card className={this.styles.card}>
                    <CardContent>
                        <Typography variant="h6" color="inherit">
                            Lectures for {this.parentCourse.title}
                        </Typography>
                        <List component="nav">
                            {this.profStore.lectures.map((lectureObj, index) => {
                                return (
                                    <ListItem divider button key={index} onClick={this.handleLectureClick(lectureObj.id)} >
                                        <ListItemText primary={lectureObj.title + " Lecture on " + lectureObj.date} />
                                    </ListItem>
                                )
                            })}
                        </List>
                        <Button onClick={this.handleNewLectureClick} variant="outlined" color="primary">Add Lecture</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default withStyles(styles)(AllQuestionsFrame);
