import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import { observer } from 'mobx-react';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    checkBox: {
        color: theme.palette.primary.dark,
    },
    checkBoxContainer: {
        height: theme.spacing.unit*4.5,
        width: theme.spacing.unit*12.5,
        justify: "center"
    }
});

@observer
class DeleteQuestionsList extends React.Component {

    state = {
        referrerLectureId: null,
        delQuestions: [],
        questions: [],
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.questions  = props.questions
    }
    componentDidMount() {
        let shouldDelete = [];
        let closed_questions = [];
        for (let i = 0; i < this.questions.length; i++) {
            if (!this.questions[i].is_open) closed_questions.push(this.questions[i]); // open questions cannot be deleted
        }
        closed_questions.slice().sort(function (a, b) {
            if (a.created_at < b.created_at) {
                return -1;
            }
            if (a.created_at > b.created_at) {
                return 1;
            }
            // a must be equal to b
            return 0;
        }).map((questionObj, index) => 
           shouldDelete.push({
            id: questionObj.id,
            checked: false,
            title: questionObj.question_title
        }))
        if (closed_questions !== undefined && closed_questions !== null) {
            this.setState({
                questions: closed_questions,
                delQuestions: shouldDelete
            })
        }
        
    }
    // looked up to here
    handleChange = id =>  event => {
        // if id in lectures, then we are unchecking; otherwise we need to uncheck
        this.state.delQuestions.find(x => x.id === id).checked = event.target.checked;
        this.setState({
            delQuestions: this.state.delQuestions
        })
        // send checked boxes back to parent
        this.props.getDeletions(this.state.delQuestions);
    }


    render() {
        return (
            this.state.questions.length > 0 ? (
                <FormControl component="fieldset" fullWidth>
                <FormGroup
                    name="delQuestions"
                    value={this.state.delQuestions}
                    onChange={this.handleChange}
                    >
                    <List component="nav">
                            {this.state.delQuestions.map((q, index) => {
                                return (
                                    <ListItem divider key={index} >
                                        <ListItemText primary={(index + 1).toString() + ". " +q.title}/>
                                        <div className={this.styles.checkBoxContainer}>
                                            <ListItemSecondaryAction>
                                                <FormControlLabel key={index} control={
                                                        <Checkbox className={this.styles.checkBox} key={q.id} checked={q.checked} onChange={this.handleChange(q.id)} value={q.id} />
                                                    }/>
                                            </ListItemSecondaryAction>
                                        </div> 
                                    </ListItem>   
                                )
                            })}
                    </List>
                </FormGroup>
            </FormControl>
            ) : (
                <Typography variant="body1" > It looks like all your questions are open... Please close questions you would like to delete. </Typography>
            )
            
        );
    }
}

export default withStyles(styles)(DeleteQuestionsList);