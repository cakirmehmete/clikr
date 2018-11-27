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
        referrerQuestionIndex: -1
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = props.apiProfService
        this.parentLecture = this.profStore.getLectureWithId(this.profStore.lecture_id)
    }

    componentDidMount() {
        this.apiProfService.loadQuestionsForLecture(this.parentLecture.id)
    }

    handleNewQuestionClick = () => {
        this.setState(() => ({
            toNewQuestion: true
        }))
    }

    handleQuestionClick = index => () => {
        this.setState(() => ({
            referrerQuestionIndex: index
        }))
    }

    render() {
        // Handle routes
        if (this.state.toNewQuestion === true) {
            return <Redirect to='/professor/TODO' />
        }

        return (
            <div>
                <Typography variant="subtitle1" color="textPrimary">
                    Here are your questions:
                </Typography>
                <Card className={this.styles.card}>
                    <CardContent>
                        <Typography variant="h6" color="inherit">
                            Questions for {this.parentLecture.title + " Lecture"}
                        </Typography>
                        <List component="nav">
                            {this.profStore.questions.map((questionObj, index) => {
                                return (
                                    <ListItem divider button key={index} onClick={this.handleQuestionClick(questionObj.id)} >
                                        <ListItemText primary={questionObj.question_title} />
                                    </ListItem>
                                )
                            })}
                        </List>
                        <AddQuestionModalWrapped profStore={this.profStore} />
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default withStyles(styles)(AllQuestionsFrame);
