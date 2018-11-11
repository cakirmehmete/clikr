import React from 'react'
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'

export default class StudentAddCourseButton extends React.Component {
  state = {
    link: '/student/addcourse'
  };

  render() {
    return (
      <Button variant="fab" color="secondary" aria-label="Add" style={{"font-size":"xx-large"}}>
        <Link to={this.state.link} style={{color:"white", "text-decoration": "none"}}>+</Link>
      </Button>
    )
  }
}