import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import { inject } from 'mobx-react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import SideMenuBar from '../../components/SideMenuBar';
import TopMenuBar from '../../components/TopMenuBar';
import APIProfService from '../../services/APIProfService';
import ProfessorHome from './ProfessorHome';
import ProfessorNewCourse from './NewCourse';
import ProfessorViewLectures from './ViewLectures';
import ProfessorViewQuestions from './ViewQuestions';
import ProfessorAddMCQuestion from './AddMCQuestion';
import ProfessorAddFreeTextQuestion from './AddFreeTextQuestion';
import ProfessorAddSliderQuestion from './AddSliderQuestion';
import ProfessorAddLecture from './AddLecture';
import Home from '../Home';
import Login from '../Login';

const drawerWidth = 240;

const styles = theme => ({
    content: {
        [theme.breakpoints.up('sm')]: {
            marginLeft: drawerWidth,
        },
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
                    <CssBaseline />
                    <Route exact path='/' component={Home} />
                    <Route exact path='/login-(prof|student)' component={Login} />
                    
                    <Route path='/professor' component={TopMenuBar} />
                    <nav>
                        <Hidden xsDown implementation="css">
                            <Route path='/professor' component={SideMenuBar} />
                        </Hidden>
                    </nav>
                    
                    <main className={this.styles.content}>
                        <Route exact path='/professor' component={ProfessorHome} />
                        <Route path='/professor/new' component={ProfessorNewCourse} />
                        <Route path='/professor/:courseId/lectures' component={ProfessorViewLectures} />
                        <Route path='/professor/:courseId/new' component={ProfessorAddLecture} />
                        <Route exact path='/professor/:lectureId/questions' component={ProfessorViewQuestions} />
                        <Route path='/professor/:lectureId/questions/new-mc' component={ProfessorAddMCQuestion} />
                        <Route path='/professor/:lectureId/questions/new-free-text' component={ProfessorAddFreeTextQuestion} />
                        <Route path='/professor/:lectureId/questions/new-slider' component={ProfessorAddSliderQuestion} />
                    </main>
                </div>
            </Router>
        );
    }
}

export default withStyles(styles)(ProfessorRoutes);
