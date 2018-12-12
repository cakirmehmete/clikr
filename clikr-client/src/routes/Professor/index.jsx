import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
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
import ProfessorAddFreeTextQuestion from './AddFreeTextQuestion';
import ProfessorAddLecture from './AddLecture';

const drawerWidth = 240;

const styles = theme => ({
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
            <Router>
                <div>
                    <Route path='/professor' component={TopMenuBar} />
                    <Route path='/professor' component={SideMenuBar} />
                    <main className={this.styles.content}>
                        <Route exact path='/professor' component={ProfessorHome} />
                        <Route path='/professor/new' component={ProfessorNewCourse} />
                        <Route path='/professor/:courseId/lectures' component={ProfessorViewLectures} />
                        <Route path='/professor/:courseId/new' component={ProfessorAddLecture} />
                        <Route exact path='/professor/:lectureId/questions' component={ProfessorViewQuestions} />
                        <Route path='/professor/:lectureId/questions/new-mc' component={ProfessorAddMCQuestion} />
                        <Route path='/professor/:lectureId/questions/new-free-text' component={ProfessorAddFreeTextQuestion} />
                    </main>
                </div>
            </Router>
        );
    }
}

export default withStyles(styles)(ProfessorRoutes);
