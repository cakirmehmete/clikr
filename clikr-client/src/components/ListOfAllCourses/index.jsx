
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import List from '@material-ui/core/List';
import { observer } from 'mobx-react';
import CourseListItemNavEdit from '../CourseListItemNavEdit';

const styles = theme => ({
    card: {
        minWidth: 275,
    },
});

@observer
class ListOfAllCourses extends React.Component {
    state = {
        referrerCourseId: null,
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = props.apiProfService
    }
   
    handleCourseClick = id => () => {
        this.setState(() => ({
            referrerCourseId: id
        }))
    }

    render() {
        var courses = this.profStore.courses.filter((courseObj) => {
            return courseObj.is_current
        })

        debugger;

        // Handle routes
        if (this.state.referrerCourseId !== null) {
            return <Redirect to={'/professor/' + this.state.referrerCourseId + '/lectures'} push />
        }

        var courseList = courses.map((courseObj, index) => {
            return (
                <CourseListItemNavEdit 
                    key={index}
                    archive={false}
                    profStore={this.profStore}
                    apiProfService={this.apiProfService} 
                    courseId={courseObj.id}
                    courseTitle={courseObj.title}
                    courseYear={courseObj.year}
                    courseTerm={courseObj.term}
                    courseCode={courseObj.enroll_code}
                />
            )
        })

        return (
            <List component="nav">
                {courseList}
            </List>
        );
    }
}

export default withStyles(styles)(ListOfAllCourses);