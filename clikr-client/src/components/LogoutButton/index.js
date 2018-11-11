import React from 'react'
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

export default class LogoutButton extends React.Component {

    render() {
        return (
            <Button onClick={this.handleClick}>
                <Link to='/' style={{"color":"black", "text-decoration": "none"}}>logout</Link>
            </Button>
        );
    }
}

