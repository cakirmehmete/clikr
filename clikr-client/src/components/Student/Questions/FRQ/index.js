import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { observer, inject } from 'mobx-react';
import APIStudentService from '../../../../services/APIStudentService'
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    gridContainer: {
        margin: theme.spacing.unit,
    },
    gridItem: {
        paddingRight: theme.spacing.unit*2,
    },
    buttonContainer: {
        padding: theme.spacing.unit*1.5,
    }
});
@inject("store")
@observer    
class FRQ extends Component {
    
    constructor(props) {
        super(props)
        this.store = this.props.store
        this.styles = props.classes
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
            <div>
                <Grid container direction="column" className={this.styles.gridContainer}>
                    <Grid item className={this.styles.gridItem}>
                        <form noValidate autoComplete="off">
                            <TextField
                                id="full-width"
                                helperText="Enter Response"
                                name = 'answer'
                                value={this.state.answer}
                                onChange={e => this.handleChange(e)}
                                fullWidth  
                            />
                        </form>
                    </Grid>
                </Grid>
                <Grid container direction='row' justify="flex-end" className={this.styles.buttonContainer}>
                    <Button onClick={this.handleClick} disabled={this.state.disabled} variant="contained" color="secondary">
                    submit
                    </Button>
                </Grid>   
            </div>
        );
    }
}
export default withStyles(styles)(FRQ);