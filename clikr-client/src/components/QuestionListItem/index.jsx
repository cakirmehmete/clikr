import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import OpenClosedButton from '../OpenClosedButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { observer, inject } from 'mobx-react';
import ViewStatsModalWrapped from '../ViewStatsModal';

const styles = theme => ({
    open: {
        marginTop: 5
    }
});

@observer
class QuestionListItem extends React.Component {
    state = {
        selected: false
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
    }

    componentDidMount() {
        if (!this.props.profStore.dataLoaded) {
            this.props.apiService.loadData().then(() => {
                this.props.profStore.dataLoaded = true
            })
        }
        if (this.props.parentLecture !== undefined && this.props.questionObj.id !== undefined) {
            this.setState({ selected: this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.questionObj.id).is_open })
        }
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if (this.props.openQuestion === this.props.questionObj.id && prevProps.openQuestion !== this.props.openQuestion) {
    //         this.setState({ selected: true })
    //     }
    //     else {
    //         if (prevProps.openQuestion === prevProps.questionObj.id && prevProps.openQuestion !== this.props.openQuestion) {
    //             this.setState({ selected: false })
    //         }
    //     }
    //     // console.log("preovOpen: " + prevProps.openQuestion + " " + "open item = " + prevProps.questionObj.is_open.toString()) 
    //     // console.log("this.open: " + this.props.openQuestion + " " + this.props.questionObj.question_title + " open item = " + this.props.questionObj.is_open.toString())

    //     // // console.log("prevProps.is_open: " + prevProps.profStore.getQuestionWithId(prevProps.parentLecture, prevProps.questionObj.id).is_open.toString() + " prevState: " + prevState.selected.toString())
    //     // console.log("this.props.is_open: " + this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.questionObj.id).is_open.toString() + " this.state: " + this.state.selected.toString())
    //     // const open = this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.questionObj.id).is_open;
    //     // if (this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.questionObj.id).is_open !== this.state.selected) {
    //     //     this.setState({ selected: open })
    //     // }
    // }

    // componentWillReceiveProps(nextProps) {
    //     console.log(nextProps.questionObj.question_title + ": " + nextProps.questionObj.is_open)
    //     //console.log("this.props.is_open: " + this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.questionObj.id).is_open.toString() )
    // }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.questionObj.id === nextProps.openQuestion && !this.state.selected) {
    //         this.setState({ selected: true })
    //     }
    //     else {
    //         // if (this.props.openQuestion && this.props.questionObj.id && " store: " + nextProps.profStore.getQuestionWithId(nextProps.parentLecture, nextProps.questionObj.id).is_open.toString()) {
    //         //     this.setState({ selected: false })
    //         // }
    //     }
    //     console.log("next:" + nextProps.questionObj.id + " " + nextProps.openQuestion + " store: " + nextProps.profStore.getQuestionWithId(nextProps.parentLecture, nextProps.questionObj.id).is_open.toString())
    //     console.log("this: " + this.props.questionObj.id + " " + this.props.openQuestion + " store: " + this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.questionObj.id).is_open.toString())
    //     // this.setState({ selected: nextProps.profStore.getQuestionWithId(nextProps.parentLecture, nextProps.questionObj.id).is_open })
    // }

    handleToUpdate = (selected) => {
        this.setState({
            selected
        })
    }


    render() {
        return (
            <ListItem selected={this.state.selected} divider > 
                <ListItemText primary={(this.props.number + 1) + ". " + this.props.questionObj.question_title} />
                <ListItemSecondaryAction>
                    <Grid container direction="row" justify="flex-end">
                        <Grid item >
                            <Tooltip title="View Stats" placement="top">
                                <ViewStatsModalWrapped index={(this.props.number + 1)} question={this.props.questionObj} parentLecture={this.props.parentLecture} />
                            </Tooltip>
                        </Grid>
                        <Grid item className={this.styles.open}>
                            <OpenClosedButton className={this.styles.open} parentLecture={this.props.parentLecture}
                                questionId={this.props.questionObj.id} handleListClose={this.props.handleListClose}
                                handleClick={this.props.handleClick} handleToUpdate={this.handleToUpdate} question={this.props.questionObj} open={this.state.selected} recentlyClosedId={this.props.recentlyClosedId} recentlyOpened={this.state.recentlyOpenedId} openQuestion={this.props.openQuestion} />
                        </Grid>
                    </Grid>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

export default withStyles(styles)(QuestionListItem)