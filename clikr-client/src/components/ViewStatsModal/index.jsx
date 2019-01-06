import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import InsertChartOutlined from '@material-ui/icons/InsertChartOutlined';
import Modal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import MCQuestionStats from '../../components/MCQuestionStats';
import FreeTextStats from '../../components/FreeTextStats';
import SliderStats from '../../components/SliderStats';


function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const styles = theme => ({
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
    }
});

class ViewStatsModal extends React.Component {
    state = {
        open: false,
    };

    constructor(props) {
        super(props);
        this.styles = props.classes;
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        const { classes } = this.props;

        let stats;

        if (this.props.question.question_type === "multiple_choice") {
            stats = (<MCQuestionStats key={this.props.index} parentLecture={this.props.parentLecture} selectedQuestionId={this.props.question.id} override={true} />)
        }
        else if (this.props.question.question_type === "free_text") {
            stats = (<FreeTextStats key={this.props.index} parentLecture={this.props.parentLecture} selectedQuestionId={this.props.question.id} override={true} />)
        }
        else if (this.props.question.question_type === "slider") {
            stats = (<SliderStats key={this.props.index} parentLecture={this.props.parentLecture} selectedQuestionId={this.props.question.id} override={true} />)
        }

        return (
            <div>
                <IconButton color="secondary" onClick={this.handleOpen}>
                    <InsertChartOutlined />
                </IconButton>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <div style={getModalStyle()} className={classes.paper}>
                        {stats}
                    </div>
                </Modal>
            </div>
        );
    }
}

// We need an intermediary variable for handling the recursive nesting.
const ViewStatsModalWrapped = withStyles(styles)(ViewStatsModal);

export default ViewStatsModalWrapped;