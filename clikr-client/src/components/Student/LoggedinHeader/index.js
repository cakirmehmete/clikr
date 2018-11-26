import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Grid from '@material-ui/core/Grid';
import logo from '../../../assets/clikrlogo.png'
import LogoutButton from '../Buttons/LogoutButton';


class Header extends React.Component {
    
    render () {
        return(
            <div>
            <AppBar position="static" color='primary'>
                <Toolbar>
                    <Grid container direction="row" justify="space-between" alignItems='center'>
                        <img src = {logo} alt = "logo" width="100"></img>
                        <LogoutButton />
                    </Grid>
                </Toolbar>
            </AppBar>
            </div>
        );
    }
}
export default Header;