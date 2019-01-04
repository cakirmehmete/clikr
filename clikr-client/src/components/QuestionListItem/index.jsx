import React from 'react';
import OpenClosedButton from '../OpenClosedButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import { observer, inject } from 'mobx-react';

@inject("profStore")
@observer
class QuestionListItem extends React.Component {
    state = {
        selected: false
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
    }

    handleToUpdate = (selected) => {
        this.setState({
            selected
        })
    }

    render() {
        return (
            <ListItem selected={this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.questionObj.id).is_open} divider >
                <ListItemText primary={(this.convertQuestionIdToIndex(this.props.questionObj.id) + 1) + ". " + this.props.questionObj.question_title} />
                <OpenClosedButton parentLecture={this.props.parentLecture} questionId={this.props.questionObj.id} handleListClose={this.props.handleListClose} handleClick={this.props.handleClick} handleToUpdate={this.handleToUpdate} />
            </ListItem>
        );
    }

    convertQuestionIdToIndex(question_id) {
        for (var i = 0; i < this.props.parentLecture.questions.length; i++) {
            if (this.props.parentLecture.questions[i].id === question_id)
                return i;
        }
        return 0;
    }
}

export default QuestionListItem