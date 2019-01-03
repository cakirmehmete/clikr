import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { socketioURL } from '../../constants/api';
import socketIOClient from 'socket.io-client'
import { observer, inject } from 'mobx-react';
const socket = socketIOClient(socketioURL)

const styles = theme => ({
    startLectureBtn: {
        float: "right"
    }
});

@inject("apiService")
@inject("profStore")
@observer
class OpenClosedButton extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
    }

    componentDidMount() {
        // Make sure the questions are updated
        this.props.apiService.loadData()
    }

    handleBtnClick() {
        if (!this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.questionId).is_open) {
            // Handle the "Open Question"
            this.props.apiService.openQuestion(this.props.questionId, this.props.parentLecture.id)
            socket.emit('subscribe professor', this.props.questionId)
            this.props.handleToUpdate(true)
        }
        else {
            // Handle the "Close Question"
            this.props.apiService.closeQuestion(this.props.questionId, this.props.parentLecture.id)
            this.props.handleToUpdate(false)
        }
    }

    render() {
        return (
            <Button variant="outlined" color="primary" onClick={() => this.handleBtnClick()}
                className={this.styles.startLectureBtn}>
                {!this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.questionId).is_open ? "Open" : "Close"}
            </Button>
        );
    }
}

export default withStyles(styles)(OpenClosedButton);
