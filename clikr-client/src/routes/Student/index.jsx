import React from 'react';
import { Route, Switch } from "react-router-dom";
import { Provider } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import StudentStore from '../../stores/StudentStore';
import APIStudentService from '../../services/APIStudentService';
import StudentHome from './StudentHome';
import QuestionPage from './StudentQuestionPage';
import CheckQuestions from './CheckQuestions';
import NoMatch from '../../components/NoMatch';


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

class StudentRoutes extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.store = new StudentStore()
        this.apiStudentService = new APIStudentService(this.store)
    }

    componentDidMount() {
        this.apiStudentService.loadAllCourses()
    }

    render() {
        return (
            <div>
                <Provider store={this.store}>
                    <Switch>
                        <Route exact path='/student' component={StudentHome} />
                        <Route path='/student/checkquestions' component={CheckQuestions} />
                        <Route path='/student/questions' component={QuestionPage}/>
                        <Route component={NoMatch} />
                    </Switch>
                </Provider>
            </div>
        );
    }
}

export default withStyles(styles)(StudentRoutes);