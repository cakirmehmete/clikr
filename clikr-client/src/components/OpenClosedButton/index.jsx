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
@observer
class OpenClosedButton extends React.Component {
    state = {
        btnStatus: 0,
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
    }

    handleBtnClick() {
        switch (this.state.btnStatus) {
            case 0:
                // Handle the "Open Question"
                this.props.apiService.openQuestion(this.props.questionId)
                socket.emit('subscribe professor', this.props.questionId)
                this.setState({ btnStatus: 1 })
                this.props.handleToUpdate(true)
                break;

            case 1:
                // Handle the "Close Question"
                this.props.apiService.closeQuestion(this.props.questionId)
                this.setState({ btnStatus: 0 })
                this.props.handleToUpdate(false)
                break;

            default:
                break;
        }
    }

    render() {
        return (
            <Button variant="outlined" color="primary" onClick={() => this.handleBtnClick()}
                className={this.styles.startLectureBtn} disabled={this.state.btnStatus === 2}>
                {this.state.btnStatus === 0 ? "Open" :
                    this.state.btnStatus === 1 ? "Close" :
                        "Closed"
                }
            </Button>
        );
    }
}

export default withStyles(styles)(OpenClosedButton);
