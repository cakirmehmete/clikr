import React, { Component } from 'react';
import './style.css'; // Not our preferred way of importing style
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import ProfessorHome from '../ProfessorHome'
import { Provider } from 'mobx-react';
import ClassStore from '../../stores/ClassStore';
import { baseURL } from '../../constants/api';
import Login from '../Login';

export const fakeAuth = {
  isAuthenticated() {
    return true;
  }
}

class Home extends Component {
  render() {
    return (
      <div>
        <header>
          <Router>
            <Switch>
              <Route path='/login-prof' component={Login} />
              <PrivateRouteStudent exact path="/student" />
              <Provider classStore={new ClassStore()}>
                <PrivateRouteProf path="/professor" component={ProfessorHome} />
              </Provider>
            </Switch>
          </Router>
        </header>
      </div>
    );
  }
}

const PrivateRouteProf = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    fakeAuth.isAuthenticated() === true
      ? <Component {...props} />
      : <Redirect to={{ pathname: "/login-prof", state: { from: props.location } }} />
  )} />
)

const PrivateRouteStudent = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    fakeAuth.isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to={baseURL + "/student/login"} />
  )} />
)

export default Home;
