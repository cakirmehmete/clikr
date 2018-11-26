import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProfessorHome from './ProfessorHome'
import StudentHome from './StudentHome'
import StudentEnroll from './StudentEnrollment'
import { Provider } from 'mobx-react';
import ClassStore from './../stores/ClassStore';
import Home from './Home';
import Login from './Login'

class App extends Component {
   
    classStore = new ClassStore()
   
    render() {  
        return (
            <div>
                <header>
                    <Router>
                        <Switch>
                            <Route exact path='/' component={Home} />
                            <Route path='/login-(prof|student)' component={Login} />
                            <Route path="/student/enroll" component={StudentEnroll} />
                            <Provider classStore={this.classStore}>
                                <Route path="/student" component={StudentHome} />
                            </Provider>
                            <Provider classStore={this.classStore}>
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
