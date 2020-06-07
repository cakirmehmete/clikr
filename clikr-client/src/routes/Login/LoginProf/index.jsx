import React, {Component} from "react"
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import logoprof from '../../../assets/clikrlogo2.png';
import background from '../../../assets/holder_hall.jpg';

import { inject } from 'mobx-react';

const styles = theme => ({
   profTypography: {
     color: theme.palette.primary.main,
   },
   gridContainer: {
      paddingTop: theme.spacing.unit*8
   },
   gridItem: {
         align: 'center',
         textAlign: 'center',
         paddingTop: theme.spacing.unit*4
   },
   root: {
     flexGrow: 1,
     height: '100vh',
     width: '100vw',
     backgroundImage: 'url(' + background + ')',
     backgroundSize: 'cover',
     backgroundRepeat: 'no-repeat',
     backgroundPosition: 'center center',
   },
   appBar: {
     top: 'auto',
     bottom: 0,
   },
   loginCard: {
     backgroundColor: theme.palette.secondary.main,
     [theme.breakpoints.up('xs')]: {
       maxWidth: 400,
     },
     [theme.breakpoints.down('xs')]: {
       maxWidth: 300,
     },
   },
 });

@inject("apiLoginService")
class LoginProf extends Component {
   constructor(props) {
      super(props)
      this.state = {
         username: "",
         password: "",
         login: false,
         createAccount: false
      }

      this.apiLoginService = props.apiLoginService;

      this.styles = props.classes
      this.handleChange = this.handleChange.bind(this)
      this.handleLoginProfessor = this.handleLoginProfessor.bind(this)
      this.handleCreateNewProfessor = this.handleCreateNewProfessor.bind(this)
   }

   handleChange(event) {
      const {name, value} = event.target

      this.setState({ [name]: value })
   }

   handleLoginProfessor() {
      this.apiLoginService.loginProfessor(this.state.username, this.state.password)
         .then(valid_login => {
            if (valid_login) {
               this.setState({ login: valid_login })
            } else {
               this.setState({ password: "" })
            }
         })
   }

   handleCreateNewProfessor() {
      this.setState({ createAccount: true })
   }

   render() {
      if (this.state.login) {
         return <Redirect to={'/professor'} push />
      }

      if (this.state.createAccount) {
         return <Redirect to={'/login/create-prof'} push />
      }

      return (
         <div className={this.styles.root}>
            <Grid container spacing={24} justify="center" className={this.styles.gridContainer}>
               <Grid item className={this.styles.clickGrid}>
                  <Card className={this.styles.loginCard}>
                     <Grid item align="center">
                        <img src={logoprof} alt="logo" width={100}></img>
                     </Grid>

                     <Grid item className={this.styles.gridItem}>
                        <Typography variant="h6" color="primary" align="center"> Username </Typography>
                        <TextField
                                 name = 'username'
                                 value={this.state.username}
                                 onChange={this.handleChange}
                        />
                     </Grid>

                     <Grid item className={this.styles.gridItem}>
                        <Typography variant="h6" color="primary" align="center"> Password </Typography>
                        <TextField
                                 name = 'password'
                                 type = 'password'
                                 value={this.state.password}
                                 onChange={this.handleChange}
                        />
                     </Grid>

                     <Grid item className={this.styles.gridItem}>

                     </Grid>

                     <CardActionArea onClick={this.handleLoginProfessor}>
                        <CardContent>
                           <Grid item container direction="column" spacing={8}>
                              <Grid item align="center">
                                 <Typography variant="h5" gutterBottom className={this.styles.profTypography}>
                                    Login
                                 </Typography>
                              </Grid>
                           </Grid>
                        </CardContent>
                     </CardActionArea>

                     <CardActionArea onClick={this.handleCreateNewProfessor}>
                        <CardContent>
                           <Grid item container direction="column" spacing={8} >
                              <Grid item align="center">
                                 <Typography variant="h5" gutterBottom className={this.styles.profTypography}>
                                    Create New Account
                                 </Typography>
                              </Grid>
                           </Grid>
                        </CardContent>
                     </CardActionArea>

                  </Card>
               </Grid>
            </Grid>

            <AppBar position="fixed" color="primary" className={this.styles.appBar}>
               <Grid
                  container
                  direction="row"
                  justify="center"
               >
                  <Typography color="inherit">
                  {"Created by mecakir, zsyang, afeng, lheimes, and czye."}
                  </Typography>
               </Grid>
            </AppBar>
         </div>
      )
   }
}

export default withStyles(styles)(LoginProf);
