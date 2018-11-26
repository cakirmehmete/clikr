import React from 'react'
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

export default class LogoutButton extends React.Component {

    render() {
        return (
            <Link to='/' style={{"color":"black", "text-decoration": "none"}}>
                <Button>logout</Button>
            </Link>
           
        );
    }
}

