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
@inject("profStore")
@observer
class OpenClosedButton extends React.Component {

    state = {
        isOpen: false, 
        recentlyOpenedByListButton: false,
        questionId: "",
        openedByOCButton: false,
    }
    constructor(props) {
        super(props)
        this.styles = props.classes
    }

    componentDidMount() {
        // Make sure the questions are updated
        if (!this.props.profStore.dataLoaded) {
            this.props.apiService.loadData().then(() => {
                this.props.profStore.dataLoaded = true
            })
        }


        this.setState({ isOpen: this.props.openQuestion === this.props.questionId, questionId: this.props.questionId })
        
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.openQuestion === this.state.questionId) {
            if (!this.state.isOpen) {
                this.setState({ isOpen: true, openedByOCButton: false })
                this.props.handleToUpdate(true)
                console.log("recently opened: " + nextProps.openQuestion)
            }
            
        }
    
    
        if (nextProps.recentlyClosedId === this.state.questionId && this.state.isOpen) {
            const closed_question = nextProps.profStore.getQuestionWithId(nextProps.parentLecture, nextProps.recentlyClosedId)
            if (closed_question.is_open !== undefined) {
                if (closed_question.id === this.state.questionId) {
                    if (this.state.isOpen) {
                        this.setState({ isOpen: false, openedByOCButton: false })
                        this.props.handleToUpdate(false)
                        //console.log("recently closed: " + nextProps.recentlyClosedId)
                        console.log("recently closed: " + nextProps.recentlyClosedId)
                    }
                }
                
            }
        }
        
        
       
    }


    handleBtnClick() {
        
        if (!this.state.isOpen) {
            // Handle the "Open Question"
            this.props.apiService.openQuestion(this.props.questionId, this.props.parentLecture.id)
            socket.emit('subscribe professor', this.props.questionId)
            this.props.handleClick(this.props.questionId)
            this.props.handleToUpdate(true)
            this.setState({ isOpen: true, openedByOCButton: true })
        }
        else {
            // Handle the "Close Question"

            this.props.apiService.closeQuestion(this.props.questionId, this.props.parentLecture.id)
            this.props.handleToUpdate(false)
            this.props.handleListClose(this.props.questionId)
            this.setState({ isOpen: false, openedByOCButton: false })
        }
    }

    render() {
        return (
            <Button variant="outlined" color="primary" onClick={() => this.handleBtnClick()}
                className={this.styles.startLectureBtn}>
                {!this.state.isOpen ? "Open" : "Close"}
            </Button>
        );
    }
}

export default withStyles(styles)(OpenClosedButton);
