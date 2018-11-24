import React, { Component } from 'react';
import { baseURL } from '../../constants/api';
import { fakeAuth } from '../Home'

class Login extends Component {
    login = () => {
        fakeAuth.authenticate(() => {
            
        })
    }

    componentDidMount() {
        window.location.replace(baseURL + 'professor/login?service=' + window.location.href.substring(0, window.location.href.length - 11) + this.props.location.state.from.pathname)
    }

    render() {
        return (
            <div>
                Logging In
            </div>
        )
    }
}

export default Login;
