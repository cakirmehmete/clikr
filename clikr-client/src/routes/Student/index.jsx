import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import { inject } from 'mobx-react';
import APIStudentService from '../../services/APIStudentService';
import StudentHome from './StudentHome';
import StudentEnroll from './StudentEnrollment';
import QuestionPage from './StudentQuestionPage';
import CheckQuestions from './CheckQuestions';
import Home from '../Home';
import Login from '../Login';

const drawerWidth = 240;

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    content: {
        marginLeft: drawerWidth,
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
    },
});

@inject('store')
class StudentRoutes extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.store = props.store
        this.apiStudentService = new APIStudentService(this.store)
    }

    componentDidMount() {
        this.apiStudentService.loadAllCourses()
    }

    render() {
        return (
            <div>
                <Router>
                    <Switch>
                        <Route exact path='/' component={Home} />
                        <Route exact path='/login-student' component={Login} />
                        <Route exact path='/student' component={StudentHome} />
                        <Route exact path='/student/enroll' component={StudentEnroll} />
                        <Route path='/student/checkquestions' component={CheckQuestions} />
                        <Route path='/student/questions' component={QuestionPage}/>
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default withStyles(styles)(StudentRoutes);