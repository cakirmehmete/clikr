import React from 'react'
import Menu from '@material-ui/core/Menu';
import DropDownMenu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import { styles } from '@material-ui/core/styles';

import { Link } from 'react-router-dom';

export default class TopMenuBarDropdown extends React.Component {

    state = {
        anchorEl: null,
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { anchorEl } = this.state;

        return (
            <div>
            <IconButton
              aria-label="More"
              aria-haspopup="true"
              onClick={this.handleClick}
              color="#212121"
            >
                <MoreVertIcon color="#212121"/>
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleClose}
              >

                <MenuItem onClick={this.handleClose}>
                    <Link to='/' style={{"color":"black", "text-decoration": "none"}}>
                        LOGOUT
                    </Link>
                </MenuItem>
            </Menu>
            </div>
        );
    }
}
