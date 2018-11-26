import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { observer, inject } from 'mobx-react';
import APIProfService from '../../services/APIProfService';
import SideMenuBar from '../../components/SideMenuBar';
import TopMenuBar from '../../components/TopMenuBar';
import AllCoursesFrame from '../../components/AllCoursesFrame';

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

@inject("store")
@observer
class ProfessorHome extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.store = props.store
        this.apiService = new APIProfService(this.store)
    }

    componentDidMount() {
        this.apiService.loadAllCourses()
    }

    render() {
        return (
            <div className={this.styles.root}>
                <TopMenuBar />
                <SideMenuBar store={this.store} />
                <main className={this.styles.content}>
                    <AllCoursesFrame store={this.store} apiService={this.apiService} />
                </main>
            </div>
        );
    }
}

export default withStyles(styles)(ProfessorHome);
