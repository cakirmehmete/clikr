import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { observer, inject } from 'mobx-react';
import APIStudentService from '../../../../services/APIStudentService'


@inject("store")
@observer    
class FRQ extends Component {
    
    constructor(props) {
        super(props)
        this.store = this.props.store
        this.apiStudentService = new APIStudentService(this.store)
    }

    state = {
        answer: "",
        disabled: false
    }
    handleClick = (e) => {
        this.apiStudentService.postAnswer(this.state.answer, this.props.question.question.id)
        this.setState({
            disabled: true
        })
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
      }


    render() {

        return (
            <Grid item>
                <form noValidate autoComplete="off">
                    <TextField
                        id="full-width"
                        style={{width:"98%", paddingLeft:"1%"}}
                        helperText="Enter Response"
                        name = 'answer'
                        value={this.state.answer}
                        onChange={e => this.handleChange(e)}
                        margin="normal"  
                    />
                </form>
                <Grid container justify="flex-end" style={{"paddingRight":"1%"}}>
                <Button onClick={this.handleClick} disabled={this.state.disabled} variant="contained" color="secondary">
                   submit
                </Button>
            </Grid>
            </Grid>
            
        );
    }
}
export default FRQ;