import React, { Component } from 'react';
import './style.css'; // Not our preferred way of importing style
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import logoprof from '../../assets/clikrlogo2.png';
import logostudent from '../../assets/clikrlogo.png';
import background from '../../assets/boathouse.jpeg';


const styles = theme => ({
  studentTypography: {
    color: theme.palette.secondary.main,
  },
  profTypography: {
    color: theme.palette.primary.main,
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
  studentcard: {
    backgroundColor: theme.palette.primary.main,
    [theme.breakpoints.up('xs')]: {
      maxWidth: 400,
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: 300,
    },
  },
  profcard: {
    backgroundColor: theme.palette.secondary.main,
    [theme.breakpoints.up('xs')]: {
      maxWidth: 400,
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: 300,
    },
    marginBottom: 16,
  }
});


class Home extends Component {

  state = {
    toStudent: false,
    toProf: false
  }

  constructor(props) {
    super(props)
    this.styles = props.classes
  }

  handleLoginProf = () => {
    this.setState({
      toProf: true
    })
  }

  handleLoginStudent = () => {
    this.setState({
      toStudent: true
    })
  }

  render() {
    if (this.state.toProf) {
      return <Redirect to={'/login/prof'} push />
    }
    
    if (this.state.toStudent) {
      return <Redirect to={'/login/student'} push />
    }

    return (
      <div className={this.styles.root}>
        <Grid container spacing={24} justify="center">
          <Grid item className={this.styles.clickGrid}>
            <Card className={this.styles.studentcard}>
              <CardActionArea onClick={this.handleLoginStudent}>
                <CardContent>
                  <Grid item container direction="column" spacing={16} >
                    <Grid item align="center">
                      <img src={logostudent} alt="logo" width={100}></img>
                    </Grid>
                    <Grid item align="center">
                      <Typography variant="h2" gutterBottom className={this.styles.studentTypography}>
                        STUDENT LOGIN
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item className={this.styles.clickGrid}>
            <Card className={this.styles.profcard}>
              <CardActionArea onClick={this.handleLoginProf}>
                <CardContent>
                  <Grid item container direction="column" spacing={16} >
                    <Grid item align="center">
                      <img src={logoprof} alt="logo" width={100}></img>
                    </Grid>
                    <Grid item align="center">
                      <Typography variant="h2" gutterBottom className={this.styles.profTypography}>
                        TEACHER LOGIN
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
    );
  }
}

export default withStyles(styles)(Home);
