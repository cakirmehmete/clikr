import React from 'react'
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'

export default class AddCourseButton extends React.Component {
  state = {
    link: '/student/enroll'
  }; 

  render() {
    return (
      <Link to={this.state.link} style={{color:"white", "text-decoration": "none"}}>
        <Button variant="fab" color="secondary" aria-label="Add" style={{"font-size":"xx-large"}}>+</Button>
      </Link>
      
    )
  }
}