import React from 'react';
import { observer, inject } from 'mobx-react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { socketioURL } from '../../constants/api';
import socketIOClient from 'socket.io-client'
import BaseStatsComponent from '../BaseStatsComponent';
const socket = socketIOClient(socketioURL)

@inject("profStore")
@inject("apiService")
@observer
class MCQuestionStats extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.state = {
            question: { id: 0 },
            responsesNumber: 0,
            responses: {}
        }
    }

    componentDidMount() {
        if (this.state.question.id !== this.props.selectedQuestionId && this.props.selectedQuestionId !== 0) {
            const question = this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.selectedQuestionId)
            socket.emit('subscribe professor', question.id)
            this.setState({
                question: question,
            })
        }
        
        socket.on('new results', (msg) => {
            if (msg.question_id === this.props.selectedQuestionId) {
                this.setState({
                    responsesNumber: msg.count,
                    responses: msg.answers
                })
            }
        })
    }

    render() {
        return (
            <BaseStatsComponent responsesNumber={this.state.responsesNumber} questionTitle={this.state.question.question_title} hidden={!this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.selectedQuestionId).is_open} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Response</TableCell>
                            <TableCell align="right">Frequency</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(this.state.responses).map((response, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        {response}
                                    </TableCell>
                                    <TableCell align="right">{this.state.responses[response]}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </BaseStatsComponent>
        );
    }
}

export default MCQuestionStats;