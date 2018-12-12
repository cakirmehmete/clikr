import React from 'react'
import { Link } from 'react-router-dom'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles'


const styles = theme => ({
    linktext: {
      color: "white",
      textDecoration: "none",
    },
    button: {
        marginRight: theme.spacing.unit*2,
    }
});

class AddCourseButton extends React.Component {
  constructor(props) {
    super(props)
    this.styles = props.classes
  }
  state = {
    link: '/student/enroll'
  };

  render() {
    return (
      <Link to={this.state.link} className={this.styles.linktext}>
        <Fab color="secondary" aria-label="Add" className={this.styles.button}>
          <AddIcon />
        </Fab>
      </Link>
      
    )
  }
}
export default withStyles(styles)(AddCourseButton);