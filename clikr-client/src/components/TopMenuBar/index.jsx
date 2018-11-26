import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const drawerWidth = 240;

const styles = theme => ({
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    }
});

class TopMenuBar extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
    }

    render() {
        return (
            <AppBar position="static" color="primary" className={this.styles.appBar}>
                <Toolbar>
                    <Typography variant="h6" color="inherit">
                        Professor Home Page
                        </Typography>
                </Toolbar>
            </AppBar>

        );
    }
}

export default withStyles(styles)(TopMenuBar);
