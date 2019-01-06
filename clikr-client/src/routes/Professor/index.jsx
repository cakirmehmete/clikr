import React from 'react';
import { Route, Switch } from "react-router-dom";
import { Provider } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import SideMenuBar from '../../components/SideMenuBar';
import TopMenuBar from '../../components/TopMenuBar';
import ProfessorStore from '../../stores/ProfessorStore';
import APIProfService from '../../services/APIProfService';
import ProfessorHome from './ProfessorHome';
import ProfessorNewCourse from './NewCourse';
import ProfessorViewLectures from './ViewLectures';
import ProfessorViewQuestions from './ViewQuestions';
import ProfessorAddMCQuestion from './AddMCQuestion';
import ProfessorAddFreeTextQuestion from './AddFreeTextQuestion';
import ProfessorAddSliderQuestion from './AddSliderQuestion';
import ProfessorAddLecture from './AddLecture';
import NoMatch from '../../components/NoMatch';


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

class ProfessorRoutes extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = new ProfessorStore()
        this.apiProfService = new APIProfService(this.profStore)
    }

    componentDidMount() {
        if (!this.props.profStore.dataLoaded) {
            this.apiProfService.loadData().then(() => {
                this.props.profStore.dataLoaded = true
            })
        }
    }

    render() {
        return (
            <Provider profStore={this.profStore} apiService={this.apiProfService}>
                <div>
                    <CssBaseline />
                    <Route path='/professor' component={TopMenuBar} />
                    <nav>
                        <Hidden xsDown implementation="css">
                            <Route path='/professor' component={SideMenuBar} />
                        </Hidden>
                    </nav>
                    
                    <main className={this.styles.content}>
                        <Switch>
                            <Route exact path='/professor' component={ProfessorHome} />
                            <Route path='/professor/new' component={ProfessorNewCourse} />
                            <Route path='/professor/:courseId/lectures' component={ProfessorViewLectures} />
                            <Route path='/professor/:courseId/new' component={ProfessorAddLecture} />
                            <Route exact path='/professor/:lectureId/questions' component={ProfessorViewQuestions} />
                            <Route path='/professor/:lectureId/questions/new-mc' component={ProfessorAddMCQuestion} />
                            <Route path='/professor/:lectureId/questions/new-free-text' component={ProfessorAddFreeTextQuestion} />
                            <Route path='/professor/:lectureId/questions/new-slider' component={ProfessorAddSliderQuestion} />
                            <Route component={NoMatch} />
                        </Switch>
                    </main>
                </div>
            </Provider>
        );
    }
}

export default withStyles(styles)(ProfessorRoutes);
