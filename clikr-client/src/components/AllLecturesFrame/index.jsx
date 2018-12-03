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
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import CourseObj from '../../models/LectureObj';

const styles = theme => ({
    card: {
        minWidth: 275,
    },
});

@inject('profStore')
@inject('apiService')
@observer
class AllLecturesFrame extends React.Component {
    state = {
        toNewLecture: false,
        referrerLectureIndex: -1,
        parentCourse: new CourseObj()
    }

    componentDidMount() {
        this.props.apiService.loadData().then(() => {
            this.setState({
                parentCourse: this.props.profStore.getCourseWithId(this.props.courseId)
            })
        })
    }

    handleNewLectureClick = () => {
        this.setState(() => ({
            toNewLecture: true
        }))
    }

    handleLectureClick = index => {
        console.log("lecture clicked")
        this.setState(() => ({
            referrerLectureIndex: index
        }))
    }

    render() {
        // Handle routes
        if (this.state.toNewLecture === true) {
            return <Redirect to={'/professor/' + this.state.parentCourse.id + '/new'} push />
        } else if (this.state.referrerLectureIndex !== -1) {
            return <Redirect to={'/professor/' + this.state.referrerLectureIndex + '/questions'} push />
        }

        return (
            <div>
                <Typography variant="subtitle1" color="textPrimary">
                    Here are your lectures:
                </Typography>
                <Card className={this.props.classes.card}>
                    <CardContent>
                        <Typography variant="h6" color="inherit">
                            Lectures for {this.state.parentCourse.title}
                        </Typography>
                        {this.state.parentCourse.lectures === undefined ? '' : (
                            <List component="nav">
                                {this.state.parentCourse.lectures.map((lectureObj, index) => {
                                    return (
                                        <ListItem divider button key={index} onClick={() => this.handleLectureClick(lectureObj.id)} >
                                            <ListItemText primary={lectureObj.title + " Lecture on " + lectureObj.date} />
                                        </ListItem>
                                    )
                                })}
                            </List>
                        )}
                        <Button onClick={this.handleNewLectureClick} variant="outlined" color="primary">Add Lecture</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

AllLecturesFrame.propTypes = {
    courseId: PropTypes.string
};

export default withStyles(styles)(AllLecturesFrame);
