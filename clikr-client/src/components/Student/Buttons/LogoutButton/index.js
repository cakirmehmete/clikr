import React from 'react'
import Button from '@material-ui/core/Button';
import APIStudentService from '../../../../services/APIStudentService'
import { observer, inject } from 'mobx-react';
import { Redirect } from 'react-router-dom';

@inject("store")
@observer
class LogoutButton extends React.Component {

    constructor(props) {
        super(props)
        this.store = this.props.store
        this.apiStudentService = new APIStudentService(this.store)
    }

    state = {
        logout: false
    }

    handleLogout = () => {
        this.apiStudentService.getLogoutStudent();
        this.setState({
            logout: true
        })
    }

    render() {
        if (this.state.logout) {
            return <Redirect to={'/'} push />
        }
        return (
          
            <Button onClick={this.handleLogout}>logout</Button>
            
        );
    }
}
export default LogoutButton;