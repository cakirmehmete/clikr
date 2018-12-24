import React, { Component } from 'react';
import './style.css'; // Not our preferred way of importing style
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import logoprof from '../../assets/clikrlogo2.png';
import logostudent from '../../assets/clikrlogo.png';

const styles = theme => ({
  profPaper: {
    backgroundColor: theme.palette.secondary.main,
  },
  profTypography: {
    color: theme.palette.primary.main,
    padding: theme.spacing.unit*2
  },
  studentPaper: {
    backgroundColor: theme.palette.primary.main,
  },
  studentTypography: {
    color: theme.palette.secondary.main,
    padding: theme.spacing.unit*2
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
      return <Redirect to={'/login-prof'} push />
    }
    if (this.state.toStudent) {
      return <Redirect to={'/login-student'} push />
    }
    return (
      <Grid container direction="row" spacing={24}>
        <Grid item xs>
          <Button onClick={this.handleLoginProf}>
            <Paper elevation={3} className={this.styles.profPaper}>
              <Grid container direction="column">
                <Grid item>
                  <img src={logoprof} alt="logo" width="25%"></img>
                </Grid>
                <Grid item>
                  <Typography component="h2" variant="h1" gutterBottom className={this.styles.profTypography}>
                    Instructor Login
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Button>
        </Grid>
        <Grid item xs>
        <Button onClick={this.handleLoginStudent}>
            <Paper elevation={3} className={this.styles.studentPaper}>
              <Grid container direction="column">
                <Grid item>
                  <img src={logostudent} alt="logo" width="25%"></img>
                </Grid>
                <Grid item>
                  <Typography component="h2" variant="h1" gutterBottom className={this.styles.studentTypography}>
                    Student Login
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Home);
