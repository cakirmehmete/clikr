import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import ProfessorHome from './ProfessorHome'
import StudentHome from './StudentHome'
import StudentEnroll from './StudentEnrollment'
import { Provider } from 'mobx-react';
import ProfessorStore from './../stores/ProfessorStore';
import StudentStore from './../stores/StudentStore';
import Home from './Home';
import Login from './Login'

class App extends Component {
    professorStore = new ProfessorStore()
    studentStore = new StudentStore()

    render() {
        return (
            <div>
                <header>
                    <Router>
                        <div>
                            <Route exact path='/' component={Home} />
                            <Route exact path='/login-(prof|student)' component={Login} />
                            <Route exact path="/student/enroll" component={StudentEnroll} />
                            <Provider store={this.professorStore}>
                                <Route exact path="/professor" component={ProfessorHome} />
                            </Provider>
                            <Provider store={this.studentStore}>
                                <Route exact path="/student" component={StudentHome} />
                            </Provider>
                        </div>
                    </Router>
                </header>
            </div>
        );
    }
}

// <Route component={NotFound} />
export default App;
