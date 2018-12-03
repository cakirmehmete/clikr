import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import { inject } from 'mobx-react';
import SideMenuBar from '../../components/SideMenuBar';
import TopMenuBar from '../../components/TopMenuBar';
import APIProfService from '../../services/APIProfService';
import ProfessorHome from './Home';
import ProfessorNewCourse from './NewCourse';
import ProfessorViewLectures from './ViewLectures';
import ProfessorViewQuestions from './ViewQuestions';
import ProfessorAddMCQuestion from './AddMCQuestion';
import ProfessorAddLecture from './AddLecture';

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

@inject('profStore')
class ProfessorRoutes extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = new APIProfService(this.profStore)
    }

    componentDidMount() {
        this.apiProfService.loadData()
    }

    render() {
        return (
            <div className={this.styles.root}>
                <TopMenuBar />
                <SideMenuBar profStore={this.props.profStore} />
                <main className={this.styles.content}>
                    <Router>
                        <Switch>
                            <Route exact path='/professor' component={ProfessorHome} />
                            <Route path='/professor/new' component={ProfessorNewCourse} />
                            <Route path='/professor/:courseId/lectures' component={ProfessorViewLectures} />
                            <Route path='/professor/:courseId/new' component={ProfessorAddLecture} />
                            <Route exact path='/professor/:lectureId/questions' component={ProfessorViewQuestions} />
                            <Route path='/professor/:lectureId/questions/new-mc' component={ProfessorAddMCQuestion} />
                        </Switch>
                    </Router>
                </main>
            </div>
        );
    }
}

export default withStyles(styles)(ProfessorRoutes);
