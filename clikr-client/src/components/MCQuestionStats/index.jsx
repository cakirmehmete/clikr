import React from 'react';
import { observer, inject } from 'mobx-react';
import { socketioURL } from '../../constants/api';
import socketIOClient from 'socket.io-client'
import { Bar, defaults } from 'react-chartjs-2';
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
            data: {},
            responsesNumber: 0
        }
        defaults.global.legend.display = false;
        defaults.global.tooltips.enabled = false;
    }

    componentDidMount() {
        if (this.state.question.id !== this.props.selectedQuestionId && this.props.selectedQuestionId !== 0) {
            const question = this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.selectedQuestionId)
            socket.emit('subscribe professor', question.id)
            const labels = []
            for (var i = 0; i < question.number_of_options; i++) {
                let currLabel = question["option" + (i + 1)]
                if (currLabel.length > 10)
                    currLabel = "Option " + (i + 1)
                labels.push(currLabel)
            }

            this.setState({
                question: question,
                data: {
                    labels: labels
                }
            })
        }

        if (this.state.question.id !== this.props.selectedQuestionId && this.props.selectedQuestionId === 0) {
            this.setState({
                question: { id: 0, data: { labels: [] } }
            })
        }
        if (!this.props.override) {
            socket.on('new results', (msg) => {

                if (msg.question_id === this.props.selectedQuestionId) {
                    const values = []

                    const question = this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.selectedQuestionId)
                    for (var i = 1; i <= question.number_of_options; i++) {
                        values[i - 1] = msg.answers[i]
                        if (msg.answers[i] === undefined)
                            values[i - 1] = 0;
                    }

                    this.setState({
                        data: {
                            datasets: [{
                                label: "Question Statistics",
                                backgroundColor: '#E9C46A',
                                borderColor: '#E9C46A',
                                data: values,
                            }]
                        },
                        responsesNumber: msg.count
                    })
                }
            })
        } else {
            this.props.apiService.loadAnswers(this.props.selectedQuestionId).then((msg) => {
                if (msg.question_id === this.props.selectedQuestionId) {
                    const values = []

                    const question = this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.selectedQuestionId)
                    for (var i = 1; i <= question.number_of_options; i++) {
                        values[i - 1] = msg.answers[i]
                        if (msg.answers[i] === undefined)
                            values[i - 1] = 0;
                    }

                    this.setState({
                        data: {
                            datasets: [{
                                label: "Question Statistics",
                                backgroundColor: '#E9C46A',
                                borderColor: '#E9C46A',
                                data: values,
                            }]
                        },
                        responsesNumber: msg.count
                    })
                }
            })
        }
    }

    componentWillUnmount() {
        if (!this.props.override) {
            socket.removeAllListeners("new results");
        }
    }

    render() {
        const options = {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        userCallback: function (label, index, labels) {
                            // when the floored value is the same as the value we have a whole number
                            if (Math.floor(label) === label) {
                                return label;
                            }

                        },
                    }
                }],
            }
        }

        return (
            <BaseStatsComponent question={this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.selectedQuestionId)}
                responsesNumber={this.state.responsesNumber}
                timer={!this.props.override} questionTitle={this.state.question.question_title}
                hidden={this.props.override ? false : !this.props.profStore.getQuestionWithId(this.props.parentLecture,
                    this.props.selectedQuestionId).is_open} >
                <Bar key={this.props.selectedQuestionId} data={this.state.data} options={options} />
            </BaseStatsComponent>
        );
    }
}

export default MCQuestionStats;