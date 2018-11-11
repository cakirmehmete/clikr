import React, { Component } from 'react';
import logo from '../../assets/logo.svg';
import './style.css'; // Not our preferred way of importing style
import Button from '@material-ui/core/Button'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ProfessorHome from '../ProfessorHome/'

class Home extends Component {
  render() {
    return (
      <div>
        <header>
          <Router>
            <div>
              <Route exact path="/student" />
              <Route path="/professor" component={ProfessorHome} />
            </div>
          </Router>
        </header>
      </div>
    );
  }
}

export default Home;
