import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProfessorRoutes from './Professor'
import StudentRoutes from './Student'
import NoMatch from '../components/NoMatch';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Home from './Home';
import Login from './Login'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#E9C46A',
            dark: '#F4A261',
            light: '#2A9D8F',
        },
        secondary: {
            main: '#264653'
        },
        accent: {
            main: '#E76F51',
        },
        type: 'light'
    },
        typography: {
        useNextVariants: true,
    },
});

class App extends Component {

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Router>
                    <div>
                        <Switch>
                            <Route exact path='/' component={Home} />
                            <Route exact path='/login-(prof|student)' component={Login} />
                            <Route path="/professor" component={ProfessorRoutes} />
                            <Route path="/student" component={StudentRoutes} />
                            <Route component={NoMatch} />
                        </Switch>
                    </div>
                </Router>
            </MuiThemeProvider>
        );
    }
}

export default App;
