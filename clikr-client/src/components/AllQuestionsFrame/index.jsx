import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { observer, inject } from 'mobx-react';
import AddQuestionModalWrapped from '../AddQuestionModal';
import PropTypes from 'prop-types';

const styles = theme => ({
    card: {
        minWidth: 275,
    },
});

@inject('profStore')
@observer
class AllQuestionsFrame extends React.Component {
    state = {
        toNewQuestion: false,
        referrerQuestionId: -1,
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
    }

    handleNewQuestionClick = () => {
        this.setState(() => ({
            toNewQuestion: true
        }))
    }

    handleQuestionClick = id => () => {
        this.setState(() => ({
            referrerQuestionId: id
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
                            Questions for {this.props.parentLecture.title + " Lecture"}
                        </Typography>
                        <List component="nav">
                            {this.props.parentLecture.questions.map((questionObj, index) => {
                                return (
                                    <ListItem divider button key={index} onClick={this.handleQuestionClick(questionObj.id)} >
                                        <ListItemText primary={questionObj.question_title} />
                                    </ListItem>
                                )
                            })}
                        </List>
                        <AddQuestionModalWrapped lectureId={this.props.parentLecture.id} />
                    </CardContent>
                </Card>
            </div>
        );
    }
}

AllQuestionsFrame.propTypes = {
    parentLecture: PropTypes.object
};

export default withStyles(styles)(AllQuestionsFrame);
