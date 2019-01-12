import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';
import { withRouter } from "react-router";
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import { observer, inject } from 'mobx-react';
import logo from '../../assets/clikrlogo2.png';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';

const drawerWidth = 240;

const styles = theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    listtext: {
        color: theme.palette.primary.main
    },
    nestedListtext: {
        color: theme.palette.primary.main,
        paddingLeft: theme.spacing.unit*2,
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: theme.palette.secondary.main,
    },
    hover: {
        "&:hover": {
            backgroundColor: theme.palette.secondary.dark
          }
    },
    toolbar: theme.mixins.toolbar,
});

@inject('profStore')
@observer
class SideMenuBar extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
    }

    state = {
        open: null,
    }

    handleCourseClick(id) {
        this.props.history.push('/professor/' + id + '/lectures');
    }

    handleLectureClick(id) {
        this.props.history.push('/professor/' + id + '/questions');
    }

    handleExpand(id) {
        var open = this.state.open;
        if (open === id) {
            open = null;
        } else {
            open = id;
        }

        this.setState({
            open: open,
        })
    }

    render() {
        return (
            <Drawer
                className={this.styles.drawer}
                variant="permanent"
                classes={{
                    paper: this.styles.drawerPaper,
                }}
                anchor="left"
            >
                <Grid container direction="column">
                    <Grid item><Grid container direction="row" justify="center" ><img src={logo} alt="logo" height={80}/></Grid></Grid>
                    <Grid item><Divider /></Grid>
                    <Grid item>
                        <List>
                            {this.profStore.courses.map((courseObj, index) => {
                                var lectures = this.profStore.getCourseLectures(courseObj.id);
                                return (
                                    <div key={"div" + index}>
                                        <ListItem className={this.styles.hover} button key={index} onClick={() => this.handleCourseClick(courseObj.id)}>
                                            <ListItemText disableTypography primary={<Typography type="body2" className={this.styles.listtext}>{courseObj.title}</Typography>} />
                                            <ListItemSecondaryAction>
                                                <IconButton color="primary" disabled={lectures.length === 0} onClick={() => this.handleExpand(courseObj.id)}>
                                                    {lectures.length > 0 && this.state.open === courseObj.id ? <ExpandLess /> : <ExpandMore />}
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Collapse in={this.state.open === courseObj.id} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                {lectures.map((lectureObj, innerIndex) => {
                                                    return (
                                                        <ListItem button key={courseObj.id + "_lecture_" + innerIndex} onClick={() => this.handleLectureClick(lectureObj.id)}>
                                                            <ListItemText disableTypography primary={<Typography type="body2" className={this.styles.nestedListtext}> {lectureObj.title} </Typography>} />
                                                        </ListItem>
                                                    )
                                                })}
                                            </List>
                                        </Collapse>
                                    </div>
                                )
                            })}
                        </List>
                    </Grid>
                </Grid>
            </Drawer>
        );
    }
}

export default withRouter(withStyles(styles)(SideMenuBar));