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

const drawerWidth = 240;

const styles = theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    listtext: {
        color: theme.palette.primary.main
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

    handleClick(id) {
        this.props.history.push('/professor/' + id + '/lectures');
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
                <Grid container direction="column" alignItems="center" justify="space-around">
                    <img src={logo} alt="logo" width="50%"></img>
                </Grid>

                <Divider />
                <List>
                    {this.profStore.courses.map((courseObj, index) => {
                        return (<ListItem className={this.styles.hover} button key={index} onClick={() => this.handleClick(courseObj.id)}>
                            <ListItemText
                            disableTypography
                            primary={<Typography type="body2" className={this.styles.listtext}>{courseObj.title}</Typography>} />
                        </ListItem>)
                    })}
                </List>
            </Drawer>

        );
    }
}

export default withRouter(withStyles(styles)(SideMenuBar));