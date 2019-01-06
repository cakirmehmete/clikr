import React, { Component } from 'react';
import './style.css'; // Not our preferred way of importing style
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import logoprof from '../../assets/clikrlogo2.png';
import logostudent from '../../assets/clikrlogo.png';

const styles = theme => ({
  profPaper: {
    backgroundColor: theme.palette.secondary.main,
    maxWidth: 500,
  },
  clickGrid: {
    maxWidth: 500,
  },
  profTypography: {
    color: theme.palette.primary.main,
    padding: theme.spacing.unit*2,
  },
  studentPaper: {
    backgroundColor: theme.palette.primary.main,
    maxWidth:500,
    minWidth: 400,
  },
  studentTypography: {
    color: theme.palette.secondary.main,
    padding: theme.spacing.unit*2,
  },
  root: {
    flexGrow: 1
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
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
      return <Redirect to={'/login-prof'} push />
    }
    if (this.state.toStudent) {
      return <Redirect to={'/login-student'} push />
    }
    return (
      <div className={this.styles.root}>
        <Grid container spacing={24} justify="center">
          <Grid item className={this.styles.clickGrid}>
            <Button onClick={this.handleLoginStudent}>
              <Paper elevation={3} className={this.styles.studentPaper}>
                <Grid item container direction="column" spacing={16} >
                  <Grid item xs={12}>
                    <img src={logostudent} alt="logo" width={100}></img>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h2" gutterBottom className={this.styles.studentTypography}>
                      Student Login
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Button>
          </Grid>
          <Grid item className={this.styles.clickGrid} style={{marginBottom: "16px"}}>
            <Button onClick={this.handleLoginProf}>
              <Paper elevation={3} className={this.styles.profPaper}>
                <Grid item container direction="column" spacing={16} >
                  <Grid item xs={12}>
                    <img src={logoprof} alt="logo" width={100}></img>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h2" gutterBottom className={this.styles.profTypography}>
                      Instructor Login
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Button>
          </Grid>
        </Grid>
        <AppBar position="fixed" color="primary" className={this.styles.appBar}>
          <Grid
            container
            direction="row"
            justify="center"
          >
            <Typography color="inherit">
              {"Created by mecakir, zsyang, afeng, and lheimes."}
            </Typography>
          </Grid>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(Home);
