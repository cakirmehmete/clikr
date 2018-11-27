import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ToolbarGroup from '@material-ui/core/Toolbar';
import DropDownMenu from '@material-ui/core/Toolbar';
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
                    <ToolbarGroup firstChild={true}>
                        <Link to={'/professor'}>
                            <IconButton color="primary">
                                <SvgIcon>
                                    <path fill="#FFEA00"
                                    d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
                                </SvgIcon>
                            </IconButton>
                        </Link>
                    </ToolbarGroup>

                    <ToolbarGroup style={{
                        float       : 'none',
                        width       : '200px',
                        marginLeft  : 'auto',
                        marginRight : 'auto'
                    }}>
                    </ToolbarGroup>

                    <ToolbarGroup lastChild={true} float="right">
                        <DropDownMenu>
                            
                        </DropDownMenu>
                    </ToolbarGroup>
                </Toolbar>
            </AppBar>

        );
    }
}

export default withStyles(styles)(TopMenuBar);
