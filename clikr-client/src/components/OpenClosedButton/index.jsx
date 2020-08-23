import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
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

    state = {
        isOpen: false, 
        questionId: "",
    }
    constructor(props) {
        super(props)
        this.styles = props.classes
    }

    componentDidMount() {

        this.setState({ isOpen: this.props.open, questionId: this.props.questionId })
        
    }

    // this is to detect if the scrolling question button has opened or closed a question
    componentWillReceiveProps(nextProps) {
        
        if (nextProps.parentLecture.id !== this.props.parentLecture.id) {
            this.setState({ isOpen: nextProps.open, questionId: nextProps.questionId })
        }
        else {
            if (nextProps.recentlyOpenedId !== undefined) {
                if (nextProps.recentlyOpenedId === this.state.questionId && !this.state.isOpen) {
                    this.props.handleToUpdate(true);
                    this.setState({ isOpen: true })
                }
            }
            if (nextProps.recentlyClosedId !== undefined) {
                if (nextProps.recentlyClosedId === this.state.questionId && this.state.isOpen) {
                    this.props.handleToUpdate(false);
                    this.setState({ isOpen: false })
                }
            }
        }
    }

    handleBtnClick() {
        
        if (!this.state.isOpen) {
            // Handle the "Open Question"
            console.log("openeint the quesiton in button")
            this.props.apiService.openQuestion(this.props.questionId, this.props.parentLecture.id)
            socket.emit('subscribe professor', this.props.questionId)
            this.props.handleClick(this.props.questionId)
            this.props.handleToUpdate(true)
            this.setState({ isOpen: true })
        }
        else {
            // Handle the "Close Question"
            console.log("closing question in button")
            this.props.apiService.closeQuestion(this.props.questionId, this.props.parentLecture.id)
            this.props.handleToUpdate(false)
            this.props.handleListClose(this.props.questionId)
            this.setState({ isOpen: false })
        }
    }

    render() {
        return (
            <Collapse in={!this.props.parentLecture.scheduled}>
                <Button variant="outlined" color="primary" onClick={() => this.handleBtnClick()}
                    className={this.styles.startLectureBtn}>
                    {!this.state.isOpen ? "Open" : "Close"}
                </Button>
            </Collapse>
        );
    }
}

export default withStyles(styles)(OpenClosedButton);