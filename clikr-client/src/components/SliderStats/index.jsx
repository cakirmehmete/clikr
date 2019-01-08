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
class SliderStats extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.state = {
            question: { id: 0 },
            data: {},
            responsesNumber: 0,
        }
        defaults.global.legend.display = false;
        defaults.global.tooltips.enabled = false;
    }

    componentDidMount() {
        if (this.state.question.id !== this.props.selectedQuestionId) {
            if (this.props.selectedQuestionId !== 0) {
                const question = this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.selectedQuestionId)
                socket.emit('subscribe professor', question.id)
                this.updateChartLabels(question)
            } else {
                this.setState({
                    question: { id: 0, data: { labels: [] } }
                })
            }
        }

        if (!this.props.override) {
            socket.on('new results', (msg) => {
                if (msg.question_id === this.props.selectedQuestionId) {
                    this.updateChartData(msg.answers, msg.count)
                }
            })
        } else {
            this.props.apiService.loadAnswers(this.props.selectedQuestionId).then((msg) => {
                if (msg.question_id === this.props.selectedQuestionId) {
                    this.updateChartData(msg.answers, msg.count)
                }
            })
        }
    }

    updateChartLabels(question) {
        const labels = []
        for (var i = 0; i <= 100; i++) {
            if (i % 10 === 0)
                labels.push(i)
            else 
                labels.push('')
        }

        this.setState({
            question: question,
            data: {
                labels: labels
            }
        })
    }

    updateChartData(values, count) {
        this.setState({
            data: {
                datasets: [{
                    label: "Question Statistics",
                    backgroundColor: '#E9C46A',
                    borderColor: '#E9C46A',
                    data: values,
                }]
            },
            responsesNumber: count
        })
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
            <BaseStatsComponent question={this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.selectedQuestionId)} responsesNumber={this.state.responsesNumber} timer={!this.props.override} questionTitle={this.state.question.question_title} hidden={this.props.override ? false : !this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.selectedQuestionId).is_open}  >
                <Bar key={this.props.selectedQuestionId} data={this.state.data} options={options} />
            </BaseStatsComponent>
        );
    }
}

export default SliderStats;