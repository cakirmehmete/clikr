import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { observer, inject } from 'mobx-react';
import APIService from '../../services/APIService';
import SideMenuBar from '../../components/SideMenuBar';
import TopMenuBar from '../../components/TopMenuBar';
import AllCoursesFrame from '../../components/AllCoursesFrame';

const drawerWidth = 240;

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
    content: {
        marginLeft: drawerWidth,
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
    },
});

@inject("courseStore")
@observer
class ProfessorHome extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.courseStore = props.courseStore
        this.apiService = new APIService(this.courseStore)
    }

    componentDidMount() {
        this.apiService.loadAllCourses()
    }

    render() {
        return (
            <div>
                <TopMenuBar />
                <SideMenuBar courseStore={this.courseStore} />
                <main className={this.styles.content}>
                    <AllCoursesFrame courseStore={this.courseStore} apiService={this.apiService} />
                </main>
            </div>
        );
    }
}

export default withStyles(styles)(ProfessorHome);
