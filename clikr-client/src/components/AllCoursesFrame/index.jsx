import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { observer } from 'mobx-react';
import ListOfAllCourses from '../ListOfAllCourses';

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
        // Handle routes
        if (this.state.toNewCourse === true) {
            return <Redirect to='/professor/new' push />
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
                        <ListOfAllCourses profStore={this.profStore} />
                        <Button onClick={this.handleNewCourseClick} variant="outlined" color="primary">Add Class</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default withStyles(styles)(AllCoursesFrame);
