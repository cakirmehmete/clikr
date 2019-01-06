import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { observer, inject } from 'mobx-react';
import AddQuestionModalWrapped from '../AddQuestionModal';
import QuestionListItem from '../QuestionListItem';
import PropTypes from 'prop-types';

const styles = theme => ({
    card: {
        minWidth: 275,
    },
    startLectureBtn: {
        float: "right"
    },
    title: {
        margin: theme.spacing.unit,
    },
});

@inject('profStore')
@inject("apiService")
@observer
class AllQuestionsFrame extends React.Component {
    state = {
        toNewQuestion: false,
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

    render() {
        // Handle routes
        if (this.state.toNewQuestion === true) {
            return <Redirect to='/professor/TODO' push />
        }

        return (
            <Card className={this.styles.card}>
                <CardContent>
                    <Grid container direction='row' justify='space-between' alignItems='stretch'>
                        <Grid item>
                            <Typography className={this.styles.title} variant="h6" color="inherit">
                                Questions for {this.props.parentLecture.title + " Lecture"}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Grid container direction="row" justify="flex-end">
                                <Grid item>
                                    <AddQuestionModalWrapped lectureId={this.props.parentLecture.id} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <List component="nav">
                        {this.props.parentLecture.questions.map((questionObj, index) => {
                            return (<QuestionListItem handleListClose={this.props.handleListClose} handleClick={this.props.handleClick} parentLecture={this.props.parentLecture} questionObj={questionObj} key={index} openQuestion={this.props.selectedQuestionId} />
                            )
                        })}
                    </List>
                </CardContent>
            </Card>
        );
    }
}

AllQuestionsFrame.propTypes = {
    parentLecture: PropTypes.object
};

export default withStyles(styles)(AllQuestionsFrame);