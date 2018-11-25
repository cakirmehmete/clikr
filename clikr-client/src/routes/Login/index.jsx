import React, { Component } from 'react';
import { baseURL } from '../../constants/api';

class Login extends Component {
    componentDidMount() {
        window.location.replace(baseURL + 'professor/login?service=' + window.location.href.substring(0, window.location.href.length - 11) + '/professor')
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
