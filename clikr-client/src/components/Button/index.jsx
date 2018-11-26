import React from 'react'
import styles from './Button.module.css'
import Button from '@material-ui/core/Button'

export default class ButtonTest extends React.Component {
  render() {
    return (
      <Button variant="contained" color="primary">
        Go to Professor Page
      </Button>
    )
  }
}