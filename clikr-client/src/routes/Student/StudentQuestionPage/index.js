import React, { Component } from 'react';
//import './style.css'; // Not our preferred way of importing style
import Header from '../../../components/Student/LoggedinHeader';  
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import APIStudentService from '../../../services/APIStudentService';
import { observer, inject } from 'mobx-react';
import FRQ from '../../../components/Student/Questions/FRQ';
import MCQ from '../../../components/Student/Questions/MCQ';

@inject("store")
@observer
class QuestionPage extends Component {
    constructor(props) {
        super(props)
        this.store = this.props.store
        this.apiStudentService = new APIStudentService(this.store)
    }

    componentDidMount() {
        const { course_id } = this.props.location.state.course_id  
        this.apiStudentService.loadAllQuestions(course_id)
    }

    state = {
        has_question: false,
        question_text:"This course has no open questions at the moment ...",
        question_type:""
    }
    render() {
        return (
            <Grid container direction='column' spacing={Number("16")}>
                <Header/>
                {this.store.questions.map(q => {
                    if (q.question_type === 'free_text') {
                        return (
                            <Grid item>
                                <Paper style={{paddingTop:"1%", paddingBottom:"1%"}}>
                                    <Typography variant="h5" color="secondary" style={{width:"98%", paddingLeft:"1%", paddingRight:"1%"}}> {q.question_text} </Typography>
                                    <FRQ question={{question: q}}/>
                                </Paper>
                            </Grid>

                        )
                    }
                    else {
                        return (
                            <Grid item>
                                <Paper style={{paddingTop:"1%", paddingBottom:"1%"}}>
                                    <Typography variant="h5" color="secondary" style={{width:"98%", paddingLeft:"1%", paddingRight:"1%"}}> {q.question_text} </Typography>
                                    <MCQ question={{question: q}}/>
                                </Paper>
                            </Grid>
                        )
                    }

                })}
                
            </Grid>
        )
        
    }
}
export default QuestionPage;