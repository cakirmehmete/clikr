
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
class ListOfArchivedCourses extends React.Component {
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
            return !courseObj.is_current
        })

        // Handle routes
        if (this.state.referrerCourseId !== null) {
            return <Redirect to={'/professor/' + this.state.referrerCourseId + '/lectures'} push />
        }
        return (
            <List component="nav">
                {courses.map((courseObj, index) => {
                    return (
                        <CourseListItemNavEdit 
                            key={index} 
                            archive={true}
                            profStore={this.profStore} 
                            apiProfService={this.apiProfService} 
                            courseId={courseObj.id}
                            courseTitle={courseObj.title} 
                            courseYear={courseObj.year}
                            courseTerm={courseObj.term}
                            joinCode={courseObj.enroll_code} 
                        />
                    )
                })}
            </List>
        );
    }
}

export default withStyles(styles)(ListOfArchivedCourses);