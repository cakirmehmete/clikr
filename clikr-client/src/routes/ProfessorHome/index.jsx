import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import { observer, inject } from 'mobx-react';
import APIService from '../../services/APIService';
import AddCourseModalWrapped from '../../components/addCourseModal';

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
                <AppBar position="static" color="primary" className={this.styles.appBar}>
                    <Toolbar>
                        <Typography variant="h6" color="inherit">
                            Professor Home Page
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={this.styles.drawer}
                    variant="permanent"
                    classes={{
                        paper: this.styles.drawerPaper,
                    }}
                    anchor="left"
                >
                    <div className={this.styles.toolbar} />
                    <Divider />
                    <List>
                        {this.courseStore.courses.map(function (courseObj, index) {
                            return (<ListItem button key={index} >
                                <ListItemText primary={courseObj.name} />
                            </ListItem>)
                        })}
                    </List>
                </Drawer>
                <main className={this.styles.content}>
                    <Typography variant="h6" color="inherit">
                        Courses
                </Typography>
                    <List component="nav">
                        {this.courseStore.courses.map(function (courseObj, index) {
                            return (<ListItem button key={index} >
                                <ListItemText primary={courseObj.name} />
                            </ListItem>)
                        })}
                    </List>
                    <AddCourseModalWrapped apiService={this.apiService}></AddCourseModalWrapped>
                </main>
            </div>
        );
    }
}

export default withStyles(styles)(ProfessorHome);
