import React from 'react'
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router';

export default class LogoutButton extends React.Component {
    state = { isLoggedIn: true };
    handleClick = (e) => {
        this.setState({
            isLoggedIn: false
        });
    }

    render() {
        if (!this.state.isLoggedIn) {
            return(
                <Redirect to="/" />
            );
        }
        else {
            return (
                <Button onClick={this.handleClick}>logout</Button>
            )
        }
    }
}
