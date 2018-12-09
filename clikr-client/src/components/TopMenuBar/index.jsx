import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ToolbarGroup from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import { Link, Redirect } from 'react-router-dom';
import { withRouter } from "react-router";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import APIProfService from '../../services/APIProfService'

const drawerWidth = 240;

const styles = theme => ({
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
});

class TopMenuBar extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.store  = props.store
        this.apiProfService = new APIProfService(this.store)
    }

    state = {
      anchorEl: null,
      goHome: false,
      logout: false
    };

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
      this.setState({ 
          anchorEl: null,
          logout: true
        });
    };

    handleHome = () => {
        this.props.history.push('/professor');
    }

    render() {
        const { classes } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);
        if (this.state.logout) {
            this.apiProfService.getLogoutProf()
            return <Redirect to='/login-prof'/>
        }
      
        return (
            <AppBar position="static" color="inherit" className={this.styles.appBar}>
                <Toolbar>
                    <IconButton className={classes.homeButton} onClick={this.handleHome} color="primary">
                        <SvgIcon>
                            <path fill="secondary"
                                d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
                        </SvgIcon>
                    </IconButton>
                    <ToolbarGroup style={{
                        float: 'none',
                        marginRight: 'auto'
                    }}>
                    </ToolbarGroup>
                    <IconButton
                        aria-haspopup="true"
                        onClick={this.handleMenu}
                        color="primary"
                        float="right"
                    >
                        <SvgIcon style={{ "width": "24px", "height": "24px" }} viewBox="0 0 24 24">
                            <path color="secondary"
                                d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z" />
                        </SvgIcon>
                    </IconButton>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={open}
                        onClose={this.handleClose}
                    >
                        <MenuItem onClick={this.handleClose}>
                            LOGOUT
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>



        );
    }
}

export default withRouter(withStyles(styles)(TopMenuBar));