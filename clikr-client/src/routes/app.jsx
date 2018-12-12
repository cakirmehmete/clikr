import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import ProfessorRoutes from './Professor'
import StudentRoutes from './Student'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Provider } from 'mobx-react';
import ProfessorStore from './../stores/ProfessorStore';
import StudentStore from './../stores/StudentStore';
import APIProfService from './../services/APIProfService';
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
    professorStore = new ProfessorStore()
    profApiService = new APIProfService(this.professorStore)

    studentStore = new StudentStore()

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Router>
                    <div>
                        <Route exact path='/' component={Home} />
                        <Route exact path='/login-(prof|student)' component={Login} />
                        <Provider profStore={this.professorStore} apiService={this.profApiService}>
                            <Route path="/professor" component={ProfessorRoutes} />
                        </Provider>
                        <Provider store={this.studentStore}>
                            <Route path="/student" component={StudentRoutes} />
                        </Provider>
                    </div>
                </Router>
            </MuiThemeProvider>
        );
    }
}

// <Route component={NotFound} />
export default App;
