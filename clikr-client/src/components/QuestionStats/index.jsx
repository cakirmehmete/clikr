import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { observer, inject } from 'mobx-react';
import { socketioURL } from '../../constants/api';
import socketIOClient from 'socket.io-client'
import { Bar } from 'react-chartjs-2';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
const socket = socketIOClient(socketioURL)

const styles = theme => ({

});

@inject("profStore")
@inject("apiService")
@observer
class QuestionStats extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.state = {
            question: {}
        }
    }

    componentDidMount() {
        socket.on('new results', (msg) => {
            var data = JSON.stringify(msg);
            console.log(data)
        })

    }

    componentDidUpdate() {
        if (this.state.question.id !== this.props.selectedQuestionId && this.props.selectedQuestionId !== 0) {
            this.setState({
                question: this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.selectedQuestionId)
            })
        }

        if (this.state.question.id !== this.props.selectedQuestionId && this.props.selectedQuestionId === 0) {
            this.setState({
                question: { id: 0 }
            })
        }
    }

    render() {
        const data = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                label: "My First dataset",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [0, 10, 5, 2, 20, 30, 45],
            }]
        }

        return (
            <div>
                <Typography variant="subtitle1" color="textPrimary">
                    Statistics:
                </Typography>
                <Card className={this.styles.card}>
                    <CardContent>
                        <Typography variant="h6" color="inherit">
                            Statistics for {this.state.question.question_title}
                        </Typography>
                        <Bar data={data} />
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default withStyles(styles)(QuestionStats);