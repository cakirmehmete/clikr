import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { observer, inject } from 'mobx-react';
import { socketioURL } from '../../constants/api';
import socketIOClient from 'socket.io-client'
import { Bar, defaults } from 'react-chartjs-2';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
const socket = socketIOClient(socketioURL)

const styles = theme => ({
    card: {
        marginBottom: 10
    }
});

@inject("profStore")
@inject("apiService")
@observer
class QuestionStats extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.state = {
            question: { id: 0 },
            data: {}
        }
        defaults.global.legend.display = false;
        defaults.global.tooltips.enabled = false;
    }

    componentDidMount() {
        socket.on('new results', () => {
            this.props.apiService.loadAnswers(this.props.selectedQuestionId).then(msg => {
                const values = []

                // FIXME: Just a temporary fix for MC questions -- this should really depend on the question type!
                const question = this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.selectedQuestionId)
                for (var j = 1; j <= question.number_of_options; j++) {
                        values[j - 1] = 0;
                }

                for (var i = 0; i < msg.length; i++) {
                    values[msg[i].answer - 1] = values[msg[i].answer - 1] + 1
                }
                
                this.setState({
                    data: {
                        datasets: [{
                            label: "Question Statistics",
                            backgroundColor: '#E9C46A',
                            borderColor: '#E9C46A',
                            data: values,
                        }]
                    }
                })
            })
        })
    }

    componentDidUpdate() {
        if (this.state.question.id !== this.props.selectedQuestionId && this.props.selectedQuestionId !== 0) {
            const question = this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.selectedQuestionId)
            socket.emit('subscribe professor', question.id)
            const labels = []
            for (var i = 0; i < question.number_of_options; i++)
                labels.push(question["option" + (i + 1)])
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
            <Card className={this.styles.card} hidden={!this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.selectedQuestionId).is_open}>
                <CardContent>
                    <Typography variant="h6" color="inherit">
                        Statistics for {this.state.question.question_title}
                    </Typography>
                    <Bar key={this.props.selectedQuestionId} data={this.state.data} options={options} />
                </CardContent>
            </Card>
        );
    }
}

export default withStyles(styles)(QuestionStats);