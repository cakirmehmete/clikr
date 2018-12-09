import React from 'react';
import OpenClosedButton from '../OpenClosedButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';

export default class QuestionListItem extends React.Component {
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
            <ListItem selected={this.props.questionObj.id === this.props.openQuestion || this.state.selected} divider >
                <ListItemText primary={this.props.questionObj.question_title} />
                <OpenClosedButton questionId={this.props.questionObj.id} handleToUpdate={this.handleToUpdate} />
            </ListItem>
        );
    }
}