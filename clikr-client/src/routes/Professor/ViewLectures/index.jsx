import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AllLecturesFrame from '../../../components/AllLecturesFrame';
import TopLecturesFrame from '../../../components/TopLecturesFrame';
import APIProfService from '../../../services/APIProfService';
import { observer, inject } from 'mobx-react';

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

    render() {
        return (
            <Grid container spacing={24}>
                <Grid item xs={8}>
                    <AllLecturesFrame profStore={this.profStore} apiProfService={this.apiProfService} courseId={this.props.match.params.courseId} />
                </Grid>
                <Grid item xs={4}>
                    <TopLecturesFrame />
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(ProfessorViewLectures);
