
import React from 'react'
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import APIStudentService from '../../../../services/APIStudentService'
import { observer, inject } from 'mobx-react';

@inject("store")
@observer  
class LogoutButton extends React.Component {
    
    constructor(props) {
        super(props)
        this.store = this.props.store
        this.apiStudentService = new APIStudentService(this.store)
    }
    handleLogout = () => {
        this.apiStudentService.getLogoutStudent();
    }

    render() {
        return (

            <Link to='/login-student' style={{"color":"black", "text-decoration": "none"}}>
                <Button onClick={this.handleLogout}>logout</Button>
            <Link to='/' style={{"color":"black", "text-decoration": "none"}}>
                <Button>logout</Button>
            </Link>
           
        );
    }
}
export default LogoutButton;