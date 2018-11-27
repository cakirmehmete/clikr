import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import { observer } from 'mobx-react';
import logo from '../../assets/clikrlogo.png';
const drawerWidth = 240;

const styles = theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
});

@observer
class SideMenuBar extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
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
                <img src = {logo} alt = "logo" width="50%"></img>
            </Grid>

                <Divider />
                <List>
                    {this.profStore.courses.map(function (courseObj, index) {
                        return (<ListItem button key={index} >
                            <ListItemText primary={courseObj.title} />
                        </ListItem>)
                    })}
                </List>
            </Drawer>

        );
    }
}

export default withStyles(styles)(SideMenuBar);
