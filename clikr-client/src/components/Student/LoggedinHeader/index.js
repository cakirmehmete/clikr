import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid';
import logo from '../../../assets/clikrlogo.png'
import LogoutButton from '../Buttons/LogoutButton';
import { Link } from 'react-router-dom';


class Header extends React.Component {
    render () {
        return(
            <div>
            <AppBar position="static" color='primary'>
                <Toolbar>
                    <Grid container direction="row" justify="space-between" alignItems='center'>
                        <Grid item>
                            <Link to="/student">
                                <img src = {logo} alt = "logo" width="100"></img>
                            </Link>
                        </Grid>

                        <Grid item>
                            <Grid container direction="row" alignItems='right'>
                                <Typography variant="h5" color="secondary"> {this.props.userName} </Typography>

                                <LogoutButton />
                            </Grid>
                        </Grid>
                        
                    </Grid>
                </Toolbar>
            </AppBar>
            </div>
        );
    }
}

export default Header;