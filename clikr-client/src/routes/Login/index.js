import React, { Component } from 'react';
//import './style.css'; // Not our preferred way of importing style
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import colortheme from '../../components/Themes/colortheme';
import TextField from '@material-ui/core/TextField';
import HomePageHeader from '../../components/Header/HomePageHeader';  
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

class Login extends Component {
    state = {
      name: 'username',
      password: '',

    };
    handleClick = (e) => {
       this.props.history.replace('/student/dashboard');

    }

    render() {
  
      return (
        <MuiThemeProvider theme={colortheme}>
            <HomePageHeader/>
                <form noValidate autoComplete="off">
                    <Grid container justify="center" direction='row' alignItems='center' spacing={Number('16')} style={{height:'50vh'}}>
                        <Grid item>
                        <TextField
                            id="username"
                            label="username"
                            value={this.state.name}
                            margin="normal"
                            variant="outlined"
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                id="password"
                                label="password"
                                defaultValue="password"
                                margin="normal"
                                variant="outlined"
                                />
                        </Grid>
                        <Grid item>
                            <Button  onClick={this.handleClick}>Login</Button>
                        </Grid>
                    </Grid>
                </form>
          </MuiThemeProvider>
      );
    }
  }

  export default Login;