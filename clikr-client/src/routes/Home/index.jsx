import React, { Component } from 'react';
import './style.css'; // Not our preferred way of importing style
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProfessorHome from '../ProfessorHome'
import { Provider } from 'mobx-react';
import ClassStore from '../../stores/ClassStore';

class Home extends Component {
  render() {
    return (
      <div>
        <header>
          <Router>
            <Switch>
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

export default Home;
