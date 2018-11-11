// Handle Route Creation here
import React, {Component} from 'react';
import { Route, Switch } from 'react-router-dom';
import { Router } from 'react-router';
import createHistory from 'history/createBrowserHistory';

import Home from "./Home";
import Login from "./Login";
import StudentDashboard from './StudentDashboard'

import typeographytheme from '../components/Themes/typeographytheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

const history = createHistory();

class App extends Component {
    render() {
        return (
            <MuiThemeProvider theme={typeographytheme}>
                <Router history={history}>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/student/login" component={Login} />
                        <Route path="/student/dashboard" component={StudentDashboard} />
                    </Switch>
                </Router>
            </MuiThemeProvider>
        );
    }
}
export default App;

