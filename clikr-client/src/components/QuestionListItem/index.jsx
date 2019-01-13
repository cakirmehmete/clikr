import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import OpenClosedButton from '../OpenClosedButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { observer } from 'mobx-react';
import ViewStatsModalWrapped from '../ViewStatsModal';
import EditFRQDialog from '../EditFRQDialog';
import EditMCQDialog from '../EditMCQDialog';
import EditSLQDialog from '../EditSLQDialog';


const styles = theme => ({
    open: {
        marginTop: 5
    }
});

@observer
class QuestionListItem extends React.Component {
    state = {
        selected: false,
        open: false,
        editMode: false
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
    }

    componentDidMount() {
        if (!this.props.profStore.dataLoaded) {
            this.props.apiProfService.loadData().then(() => {
                this.props.profStore.dataLoaded = true
            })
        }
        if (this.props.parentLecture !== undefined && this.props.questionObj.id !== undefined) {
            this.setState({ selected: this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.questionObj.id).is_open })
        }
        this.setState({ editMode: this.props.mode === "editMode" })
    }
    componentDidUpdate(prevProps) {
        if(prevProps.parentLecture.id !== this.props.parentLecture.id) {
            this.setState({ selected: this.props.profStore.getQuestionWithId(this.props.parentLecture, this.props.questionObj.id).is_open })
        }
    }

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
                            {this.props.mode === "viewingMode" ? (<OpenClosedButton className={this.styles.open} parentLecture={this.props.parentLecture}
                                questionId={this.props.questionObj.id} handleListClose={this.props.handleListClose}
                                handleClick={this.props.handleClick} handleToUpdate={this.handleToUpdate} open={this.props.questionObj.is_open} 
                                recentlyClosedId={this.props.recentlyClosedId} recentlyOpenedId={this.props.recentlyOpenedId} />) 
                                : ( this.props.questionObj.question_type === 'free_text' ? 
                                    (<EditFRQDialog questionObj={this.props.questionObj} getEdits={this.props.getEdits} is_open={this.state.selected}/>) 
                                    : (this.props.questionObj.question_type === 'multiple_choice' ? 
                                        (<EditMCQDialog questionObj={this.props.questionObj} getEdits={this.props.getEdits} is_open={this.state.selected}/>) 
                                        : (<EditSLQDialog questionObj={this.props.questionObj} getEdits={this.props.getEdits} is_open={this.state.selected}/> )) 
                                )
                            }
                            
                        </Grid>
                    </Grid>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

export default withStyles(styles)(QuestionListItem)