import React from 'react';
import { observer, inject } from 'mobx-react';
import { socketioURL } from '../../constants/api';
import socketIOClient from 'socket.io-client'
import Typography from '@material-ui/core/Typography';
import BaseStatsComponent from '../BaseStatsComponent';
const socket = socketIOClient(socketioURL)

@inject("profStore")
@inject("apiService")
@observer
class SliderStats extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.state = {
            question: { id: 0 },
            responsesNumber: 0,
            correctNumber: 0,
            wrongNumber: 0
        }
    }

    componentDidMount() {
        socket.on('new results', (msg) => {
            if (msg.question_id === this.props.selectedQuestionId) {
                this.setState({
                    responsesNumber: msg.count,
                    correctNumber: msg.answers.correct,
                    wrongNumber: msg.answers.wrong,
                })
            }
        })
    }

    componentDidUpdate() {
        if (this.state.question.id !== this.props.selectedQuestionId && this.props.selectedQuestionId !== 0) {
            const question = this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.selectedQuestionId)
            socket.emit('subscribe professor', question.id)
            this.setState({
                question: question,
            })
        }

        if (this.state.question.id !== this.props.selectedQuestionId && this.props.selectedQuestionId === 0) {
            this.setState({
                question: { id: 0 }
            })
        }
    }

    render() {
        return (
            <BaseStatsComponent responsesNumber={this.state.responsesNumber} questionTitle={this.state.question.question_title} hidden={!this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.selectedQuestionId).is_open} >
                <Typography variant="subtitle1" color="inherit">
                    Correct: {this.state.correctNumber}
                </Typography>
                <Typography variant="subtitle1" color="inherit">
                    Wrong: {this.state.wrongNumber}
                </Typography>
            </BaseStatsComponent>
        );
    }
}

export default SliderStats;