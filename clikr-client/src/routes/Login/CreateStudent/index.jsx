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
import logostudent from '../../../assets/clikrlogo.png';
import background from '../../../assets/nassau_hall.jpg';

import { inject } from 'mobx-react';

const styles = theme => ({
   studentTypography: {
     color: theme.palette.secondary.main,
   },
   gridContainer: {
      paddingTop: theme.spacing.unit*8
   },
   gridItem: {
         align: 'center',
         textAlign: 'center',
         paddingTop: theme.spacing.unit*3
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
     backgroundColor: theme.palette.primary.main,
     [theme.breakpoints.up('xs')]: {
       maxWidth: 400,
     },
     [theme.breakpoints.down('xs')]: {
       maxWidth: 300,
     },
   },
 });

@inject("apiLoginService")
class CreateStudent extends Component {
   constructor(props) {
      super(props)
      this.state = {
         username: "",
         password: "",
         checkPassword: "",
         firstName: "",
         lastName: "",
         createAccount: false
      }

      this.apiLoginService = props.apiLoginService;

      this.styles = props.classes
      this.handleChange = this.handleChange.bind(this)
      this.handleCreateNewStudent = this.handleCreateNewStudent.bind(this)
   }

   handleChange(event) {
      const {name, value} = event.target

      this.setState({ [name]: value })
   }

   handleCreateNewStudent() {
      if (this.state.password === this.state.checkPassword) {
         this.apiLoginService.createStudent(this.state.username, this.state.password, this.state.firstName, this.state.lastName)
            .then(user_created => {
               this.setState({ createAccount: user_created })
            })
      } else {
         this.setState({ password: "",  checkPassword: ""})
      }
   }

   render() {
      if (this.state.createAccount) {
         return <Redirect to={'/login/student'} push />
      }

      return (
         <div className={this.styles.root}>
            <Grid container spacing={24} justify="center" className={this.styles.gridContainer}>
               <Grid item className={this.styles.clickGrid}>
                  <Card className={this.styles.loginCard}>
                     <Grid item align="center">
                        <img src={logostudent} alt="logo" width={100}></img>
                     </Grid>

                     <Grid item className={this.styles.gridItem}>
                        <Typography variant="h8" color="secondary" align="center"> Username </Typography>
                        <TextField
                                 name = 'username'
                                 value={this.state.username}
                                 onChange={this.handleChange}
                        />
                     </Grid>

                     <Grid item className={this.styles.gridItem}>
                        <Typography variant="h8" color="secondary" align="center"> First Name </Typography>
                        <TextField
                                 name = 'firstName'
                                 value={this.state.firstName}
                                 onChange={this.handleChange}
                        />
                     </Grid>

                     <Grid item className={this.styles.gridItem}>
                        <Typography variant="h8" color="secondary" align="center"> Last Name </Typography>
                        <TextField
                                 name = 'lastName'
                                 value={this.state.lastName}
                                 onChange={this.handleChange}
                        />
                     </Grid>

                     <Grid item className={this.styles.gridItem}>
                        <Typography variant="h8" color="secondary" align="center"> Password </Typography>
                        <TextField
                                 name = 'password'
                                 type = 'password'
                                 value={this.state.password}
                                 onChange={this.handleChange}
                        />
                     </Grid>

                     <Grid item className={this.styles.gridItem}>
                        <Typography variant="h8" color="secondary" align="center"> Enter Password Again </Typography>
                        <TextField
                                 name = 'checkPassword'
                                 type = 'password'
                                 value={this.state.checkPassword}
                                 onChange={this.handleChange}
                        />
                     </Grid>

                     <Grid item className={this.styles.gridItem}>

                     </Grid>

                     <CardActionArea onClick={this.handleCreateNewStudent}>
                        <CardContent>
                           <Grid item container direction="column" spacing={8} >
                              <Grid item align="center">
                                 <Typography variant="h5" gutterBottom className={this.styles.studentTypography}>
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

export default withStyles(styles)(CreateStudent);
