import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { observer } from 'mobx-react';
import ListOfAllLectures from '../ListOfAllLectures'

const styles = theme => ({
    card: {
        minWidth: 275,
    },
});

@observer
class AllLecturesFrame extends React.Component {
    state = {
        newLecture: false
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = props.apiProfService
        this.parentCourse = props.parentCourse
    }

    handleNewLectureClick = () => {
        this.setState(() => ({
            newLecture: true
        }))
    }
    render() {
        // Handle routes
        if (this.state.newLecture) {
            return <Redirect from="/professor/view-lectures" to={{pathname:"/professor/add-lecture", state:{courseObj: this.parentCourse}}} push />
        }
        
        return (
            <div>
                <Typography variant="subtitle1" color="textPrimary">
                    Here are your lectures:
                </Typography>
                <Card className={this.styles.card}>
                    <CardContent>
                        <Typography variant="h6" color="inherit">
                            Lectures for {this.parentCourse.title}
                        </Typography>
                        <ListOfAllLectures profStore={this.profStore} courseObj={this.courseObj}/>
                        <Button onClick={this.handleNewLectureClick} variant="outlined" color="primary">Add Lecture</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default withStyles(styles)(AllLecturesFrame);
