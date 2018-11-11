import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import logo from '../../assets/clikrlogo.png'


const HomePageHeader = () => {
    return(
        <div>
        <AppBar position="static" color='primary'>
            <Toolbar>
                    <img src = {logo} alt = "logo" width="100"></img>
            </Toolbar>
        </AppBar>
        </div>
    )
}
export default HomePageHeader;