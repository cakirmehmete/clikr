import React, { Component } from 'react';
import './style.css'; // Not our preferred way of importing style
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProfessorHome from '../ProfessorHome/'

class Home extends Component {
  render() {
    return (
      <div>
        <header>
          <Router>
            <Switch>
              <Route exact path="/student" />
              <Route path="/professor" component={ProfessorHome} />
            </Switch>
          </Router>
        </header>
      </div>
    );
  }
}

export default Home;
