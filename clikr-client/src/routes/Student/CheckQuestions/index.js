import React, { Component } from 'react';
//import './style.css'; // Not our preferred way of importing style
import Header from '../../../components/Student/LoggedinHeader';  
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import APIStudentService from '../../../services/APIStudentService';
import { observer, inject } from 'mobx-react';
import { isNullOrUndefined } from 'util';
import { Link } from 'react-router-dom'

@inject("store")
@observer
class CheckQuestions extends Component {
    constructor(props) {
        super(props)
        this.store = this.props.store
        this.apiStudentService = new APIStudentService(this.store)        
    }

    componentDidMount() {
        const { course_id } = this.props.location.state
        this.apiStudentService.loadAllQuestions(course_id)
        this.setState({
            course_id: this.props.location.state
        })
    }
    state = {
        course_id: ""
    }

    render() {
        if (this.store.questions['length'] !== 0) {
            return (
             <Grid container direction='column' spacing={Number("16")}>
                <Header/>
                
                <Grid container direction='column' justify='center'>
                    <Paper style={{padding:"2%"}}>
                    <Button size="large" variant="contained" color="secondary" width="100%">
                        <Link to={{
                            pathname: '/student/questions',
                            state : {
                                course_id: this.state.course_id
                            }
                        }} style={{ "color": "white", "textDecoration": "none" }}> Open Questions </Link>

                    </Button>
                    </Paper>
                </Grid>
            </Grid>
            )
        } 
        else {
            return (
             <Grid container direction='column' spacing={Number("16")}>
                <Header/>
                {}

                <Grid item>
                    <Paper style={{paddingTop:"1%", paddingBottom:"1%"}}>
                        <Typography variant="h5" color="secondary" style={{width:"98%", paddingLeft:"1%", paddingRight:"1%"}}> There are no questions for this course at the moment... </Typography> 
                    </Paper>
                </Grid>
            </Grid>
            )

        }
    }
}
export default CheckQuestions;