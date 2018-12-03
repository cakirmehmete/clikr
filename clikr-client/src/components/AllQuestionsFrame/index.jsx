import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { observer } from 'mobx-react';
import AddQuestionModalWrapped from '../AddQuestionModal';

const styles = theme => ({
    card: {
        minWidth: 275,
    },
});

@observer
class AllQuestionsFrame extends React.Component {
    state = {
        toNewQuestion: false,
        questionId: ""
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = props.apiProfService
        this.parentLecture = props.parentLecture
    }

    componentDidMount() {
        this.apiProfService.loadQuestionsForLecture(this.parentLecture.id)
    }

    handleNewQuestionClick = () => {
        this.setState(() => ({
            toNewQuestion: true
        }))
    }

    handleQuestionClick = QuestionObj => () => {
        this.setState(() => ({
            questionId: QuestionObj.id
        }))
    }

    render() {
        // Handle routes
        if (this.state.toNewQuestion === true) {
            return <Redirect to='/professor/TODO' push />
        }

        return (
            <div>
                <Typography variant="subtitle1" color="textPrimary">
                    Here are your questions:
                </Typography>
                <Card className={this.styles.card}>
                    <CardContent>
                        <Typography variant="h6" color="inherit">
                            Questions for "{this.parentLecture.title}" Lecture
                        </Typography>
                        <List component="nav">
                            {this.profStore.questions.map((questionObj, index) => {
                                return (
                                    <ListItem divider button key={index} onClick={this.handleQuestionClick(questionObj)} >
                                        <ListItemText primary={questionObj.question_title} />
                                    </ListItem>
                                )
                            })}
                        </List>
                        <AddQuestionModalWrapped profStore={this.profStore} parentLecture={this.parentLecture}/>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default withStyles(styles)(AllQuestionsFrame);
