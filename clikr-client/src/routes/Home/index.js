import React, { Component } from 'react';
import './style.css'; // Not our preferred way of importing style
import Button from '@material-ui/core/Button';
import colortheme from '../../constants/Themes/colortheme';
import HomePageHeader from '../../components/Header/HomePageHeader';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';


class Home extends Component {


      handleClick = (e) => {
          this.props.history.replace('/student/login')
      }
  

    render() {
        return (
            <MuiThemeProvider theme={colortheme}>
            <HomePageHeader/>
            <div style={{display: 'flex', justifyContent:'center', alignItems:'center', height: '50vh'}}>
                <Button size="large" color='secondary' onClick={this.handleClick}>Student Login</Button>
                <Button size="large" color='secondary'>Instructor Login</Button>
            </div>
            </MuiThemeProvider>
            
            );
        }
    }

export default Home;
