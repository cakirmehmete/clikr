import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProfessorHome from './ProfessorHome'
import { Provider } from 'mobx-react';
import CourseStore from './../stores/CourseStore';
import Home from './Home';
import Login from './Login'

class App extends Component {
    courseStore = new CourseStore()

    render() {
        return (
            <div>
                <header>
                    <Router>
                        <Switch>
                            <Route exact path='/' component={Home} />
                            <Route exact path='/login-prof' component={Login} />
                            <Route exact path="/student" />
                            <Provider courseStore={this.courseStore}>
                                <Route exact path="/professor" component={ProfessorHome} />
                            </Provider>
                        </Switch>
                    </Router>
                </header>
            </div>
        );
    }
}

export default App;
