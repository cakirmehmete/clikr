import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ToolbarGroup from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import TopMenuBarDropdown from '../TopMenuBarDropdown';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import { Link } from 'react-router-dom';


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
            <AppBar position="static" color="white" className={this.styles.appBar}>
                <Toolbar>
                    <Grid container direction="row" justify="space-between" alignItems='marginLeft'>
                        <Link to={'/professor'}>
                            <IconButton color="primary">
                                <SvgIcon>
                                    <path fill="#FFEA00"
                                    d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
                                </SvgIcon>
                            </IconButton>
                        </Link>
                    </Grid>
                    <TopMenuBarDropdown />
                    {/*<ToolbarGroup firstChild={true}>

                    </ToolbarGroup>

                    <ToolbarGroup style={{
                        float       : 'none',
                        marginLeft  : 'auto',
                        marginRight : 'auto'
                    }}>
                    </ToolbarGroup>

                    <ToolbarGroup lastChild={true} float="right">
                        <TopMenuBarDropdown />
                    </ToolbarGroup>*/}
                </Toolbar>
            </AppBar>

        );
    }
}

export default withStyles(styles)(TopMenuBar);
