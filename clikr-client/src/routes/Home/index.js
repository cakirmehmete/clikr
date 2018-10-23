import React, { Component } from 'react';
import logo from '../../assets/logo.svg';
import './style.css'; // Not our preferred way of importing style
import Button from '../../components/Button'

class Home extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <Button text="Test 123" />
        </header>
      </div>
    );
  }
}

export default Home;
