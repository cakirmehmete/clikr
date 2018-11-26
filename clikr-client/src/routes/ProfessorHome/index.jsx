import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { observer, inject } from 'mobx-react';
import APIProfService from '../../services/APIProfService';
import SideMenuBar from '../../components/SideMenuBar';
import TopMenuBar from '../../components/TopMenuBar';
import AllCoursesFrame from '../../components/AllCoursesFrame';
import Grid from '@material-ui/core/Grid';

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

@inject("profStore")
@observer
class ProfessorHome extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = new APIProfService(this.profStore)
    }

    componentDidMount() {
        this.apiProfService.loadAllCourses()
    }

    render() {
        return (
            <div className={this.styles.root}>
                <TopMenuBar />
                <SideMenuBar profStore={this.profStore} />
                <main className={this.styles.content}>
                    <Grid container spacing={24}>
                        <Grid item xs={6}>
                            <AllCoursesFrame profStore={this.profStore} apiProfService={this.apiProfService} />
                        </Grid>
                        <Grid item xs={6}>
                            <AllCoursesFrame profStore={this.profStore} apiProfService={this.apiProfService} />
                        </Grid>
                    </Grid>
                </main>
            </div>
        );
    }
}

export default withStyles(styles)(ProfessorHome);
