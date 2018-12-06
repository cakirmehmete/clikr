import React from 'react'
import { Link } from 'react-router-dom'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

export default class AddCourseButton extends React.Component {
  state = {
    link: '/student/enroll'
  }; 

  render() {
    return (
      <Link to={this.state.link} style={{color:"white", "textDecoration": "none"}}>
        <Fab color="secondary" aria-label="Add">
          <AddIcon />
        </Fab>
      </Link>
      
    )
  }
}