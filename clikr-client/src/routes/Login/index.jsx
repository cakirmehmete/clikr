import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import { Provider } from 'mobx-react';
import { baseURL } from '../../constants/api';
import { withStyles } from '@material-ui/core/styles';
import LoginProf from "./LoginProf"
import CreateProf from "./CreateProf"
import LoginStudent from "./LoginStudent"
import CreateStudent from "./CreateStudent"
import APILoginService from '../../services/APILoginService';
import NoMatch from '../../components/NoMatch';

const styles = theme => ({});

class LoginRoutes extends Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.apiLoginService = new APILoginService()
    }

    componentDidMount() {
        var url_add_on_1 = 'student/login?service=';
        var url_add_on_2 = '/student';
        var end_sub = 14;
        if (window.location.href.split('login/')[1].valueOf() === 'prof'.valueOf()) {
            url_add_on_1 = 'professor/login?service=';
            url_add_on_2 = '/professor';
            end_sub = 11;
        }

        window.location.replace(baseURL + url_add_on_1 + window.location.href.substring(0, window.location.href.length - end_sub) + url_add_on_2);
    }

    render() {
        return(
            <div>
                Logging In...
            </div>
        )
    }
}

export default withStyles(styles)(LoginRoutes);
