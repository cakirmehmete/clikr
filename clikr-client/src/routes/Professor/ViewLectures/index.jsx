import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { observer, inject } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import APIProfService from '../../../services/APIProfService';
import AllLecturesFrame from '../../../components/AllLecturesFrame';
import TopLecturesFrame from '../../../components/TopLecturesFrame';
import queryString from 'query-string'
const styles = theme => ({

});

@inject("profStore")
@observer
class ProfessorViewLectures extends React.Component {
    
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = new APIProfService(this.profStore)
    }
    componentDidMount () {
        this.apiProfService.loadLecturesForCourse(this.props.match.params.id)
        
    }
    state = {
        parentCourseId: this.props.match.params.id,
        parentTitle: this.props.location.state.title
    }


    render() {
        return (
            <Grid container spacing={24}>
                <Grid item xs={8}>
                    <AllLecturesFrame profStore={this.profStore} apiProfService={this.apiProfService} parentCourse={this.props.location.state}/>
                </Grid>
                <Grid item xs={4}>
                    <TopLecturesFrame profStore={this.profStore} apiProfService={this.apiProfService} parentCourse={this.props.location.state} />
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(ProfessorViewLectures);
