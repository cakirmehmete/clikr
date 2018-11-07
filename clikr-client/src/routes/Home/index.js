import React, { Component } from 'react';
import logo from '../../assets/logo.svg';
import './style.css'; // Not our preferred way of importing style
import Button from '@material-ui/core/Button'

class Home extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Button variant="contained" color="primary">
            Go to Student Page
          </Button>
          <Button variant="contained" color="primary">
            Go to Professor Page
          </Button>
        </header>
      </div>
    );
  }
}

export default Home;
