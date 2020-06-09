
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { observer } from 'mobx-react';
import LectListItemNavEdit from '../LectListItemNavEdit';



const styles = theme => ({
    icon: {
        color: theme.palette.primary.light
    }
});

@observer
class ListOfAllLectures extends React.Component {
    state = {
        lectures: []
    }

    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.courseId  = props.courseId
        this.apiProfService = props.apiProfService
    }
    componentDidMount() {
        if (this.courseId !== undefined) {
            this.setState({
                lectures: this.profStore.getCourseLectures(this.courseId)
            })
        }
        
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.courseId !== undefined) {
            this.setState({
                lectures: this.profStore.getCourseLectures(nextProps.courseId)
            })
        }
    }

    render() {
        return (
            <List component="nav">
                {this.state.lectures.map((lectureObj, index) => {
                    return (
                        <LectListItemNavEdit key={index} profStore={this.profStore} apiProfService={this.apiProfService} lecture={lectureObj} />
                    )
                })}
            </List>
        );
    }
}

export default withStyles(styles)(ListOfAllLectures);