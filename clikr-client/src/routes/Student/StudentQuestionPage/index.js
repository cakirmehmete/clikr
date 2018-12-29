import React, { Component } from 'react';
//import './style.css'; // Not our preferred way of importing style
import Header from '../../../components/Student/LoggedinHeader';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import APIStudentService from '../../../services/APIStudentService';
import { observer, inject } from 'mobx-react';
import FRQ from '../../../components/Student/Questions/FRQ';
import MCQ from '../../../components/Student/Questions/MCQ';
import PrevMCQ from '../../../components/Student/Questions/PrevMCQ';
import PrevFRQ from '../../../components/Student/Questions/PrevFRQ';
import { withStyles } from '@material-ui/core/styles';
import SocketIOStudentService from '../../../services/SocketIOStudentService';

const styles = theme => ({
    gridContainer: {
        padding: theme.spacing.unit,
    },
    gridItem: {
        padding: theme.spacing.unit,
    },
    paper: {
        padding: theme.spacing.unit,
    }

});

@inject("store")
@observer
class QuestionPage extends Component {

    state = {
<<<<<<< HEAD
        show_previous_questions: false,
        show_last_question: true,
        last_question: null,
=======
        number_of_open_questions: 0,
        show_previous_questions: false,
        show_last_question: false,
>>>>>>> b0cf22b259e598d8964b1c4ae8bb59d6983abb38
    }
    
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.store = this.props.store
        this.apiStudentService = new APIStudentService(this.store)
        this.socketIOStudentService = new SocketIOStudentService(this.store)  
    }

    componentDidMount() {
        this.socketIOStudentService.reset();

        const { course_id } = this.props.location.state
        
        this.socketIOStudentService.subscribe(course_id);

        this.socketIOStudentService.detectOpenQuestion();
        
        this.socketIOStudentService.detectCloseQuestion();

        this.socketIOStudentService.getAllQuestions();

        this.socketIOStudentService.listen();

    }

    

    handleClick = () => {
        const { course_id } = this.props.location.state;

        if (!this.state.show_previous_questions) {
            this.apiStudentService.loadAllPrevQuestions(course_id);
            this.setState({
                show_previous_questions: true,
                show_last_question: false,
            });
        } else {
            this.setState({
                show_previous_questions: false,
                show_last_question: true,
            }); 
        }
    };

    handleClick = () => {
        const { course_id } = this.props.location.state;

        if (!this.state.show_previous_questions) {
            this.apiStudentService.loadAllPrevQuestions(course_id);
            this.setState({
                show_previous_questions: true,
                show_last_question: false,
            });
        } else {
            this.setState({
                show_previous_questions: false,
            }); 
        }
    };

    render() {
        return (
            <Grid container direction='column' spacing={Number("16")}>
                <Header />
                <Grid className={this.styles.gridContainer}>
                    <Paper className={this.styles.paper} style={{backgroundColor: "secondary"}}>
                        <Typography variant="h5" color="secondary"> {this.socketIOStudentService.getNumberOfQuestions() !== 0 ? "Open Questions" : "No Open Questions..."} </Typography>
                        {this.socketIOStudentService.getNumberOfQuestions() !== 0 ? (
                            <Grid>
                                {this.store.questions.map(q => {
                                    if (q.question_type === 'free_text') {
                                        return (
                                            <Grid item className={this.styles.gridItem} key={q.id}>
                                                <FRQ questionId={q.id} />
                                            </Grid>
            
                                        )
                                    }
                                    else {
                                        // TODO: handle slider and drag-and-drop questions!
                                        return (
                                            <Grid item className={this.styles.gridItem} key={q.id}>
                                                <MCQ questionId={q.id} />
                                            </Grid>
                                        )
                                    }
            
                                })}
            
                            </Grid>
                        ) : null} 

                    </Paper>
                </Grid>
                <Grid className={this.styles.gridContainer}>
                    <Paper className={this.styles.paper}>
                        <Typography variant="h5" color="secondary"> {this.state.show_last_question ? "Recently Closed" : "Previous Questions"} </Typography>
                        {this.state.show_last_question ? (
                            <Grid className={this.styles.gridContainer}>
                                {this.store.lastQuestion !== null ? (
                                    this.store.lastQuestion.question_type === "multiple_choice" ? (
                                        <PrevMCQ isLast={true} />
                                    ) : (
                                        <PrevFRQ isLast={true} />
                                    ) // TODO: handle new question types
                                ) : (
                                    <Typography color="secondary"> None </Typography>
                                )} 
                            </Grid>
                        ) : null}
                        <Grid className={this.styles.gridContainer}>
                            <Button onClick={this.handleClick} variant="outlined" color="secondary">
                                {this.state.show_previous_questions ? "Hide Previous Questions" : "Show All Previous Questions"}
                            </Button>
                        </Grid>
                        <Grid >
                            {this.state.show_previous_questions ? (
                                this.store.prevQuestions.length > 1 ? (
                                    this.store.prevQuestions.map(q => {
                                        if (q.question_type === 'free_text') {
                                            return (
                                                <Grid item className={this.styles.gridItem} key={q.id}>
                                                    <PrevFRQ questionId={q.id} />
                                                </Grid>
            
                                            )
                                        }
                                        else {
                                            // TODO: handle slider and drag-and-drop questions!
                                            return (
                                                <Grid item className={this.styles.gridItem} key={q.id}>
                                                    <PrevMCQ questionId={q.id}/>
                                                </Grid>
                                            )
                                        }
            
                                    })) : 
                                    <Typography color="secondary"> There are no previous questions </Typography>
                                ) : null}
                        </Grid>
                    </Paper>
                </Grid>
                

            </Grid>
        );

    }
}
export default withStyles(styles)(QuestionPage);