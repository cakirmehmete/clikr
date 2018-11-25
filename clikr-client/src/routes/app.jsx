import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProfessorHome from './ProfessorHome'
import { Provider } from 'mobx-react';
import ClassStore from './../stores/ClassStore';
import Home from './Home';
import Login from './Login'

class App extends Component {
    render() {
        return (
            <div>
                <header>
                    <Router>
                        <Switch>
                            <Route exact path='/' component={Home} />
                            <Route path='/login-prof' component={Login} />
                            <Route exact path="/student" />
                            <Provider classStore={new ClassStore()}>
                                <Route path="/professor" component={ProfessorHome} />
                            </Provider>
                        </Switch>
                    </Router>
                </header>
            </div>
        );
    }
}

export default App;
