import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import { Provider } from 'mobx-react';
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

    render() {
        return(
            <div>
                <Provider apiLoginService={this.apiLoginService}>
                    <Switch>
                        <Route path='/login/prof' component={LoginProf} />
                        <Route path='/login/student' component={LoginStudent} />
                        <Route path='/login/create-prof' component={CreateProf} />
                        <Route path='/login/create-student' component={CreateStudent} />
                        <Route component={NoMatch} />
                    </Switch>
                </Provider>
            </div>
        )
    }
}

export default withStyles(styles)(LoginRoutes);
