import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AllLecturesFrame from '../../../components/AllLecturesFrame';
import TopLecturesFrame from '../../../components/TopLecturesFrame';

const styles = theme => ({

});

class ProfessorViewLectures extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
    }

    render() {
        return (
            <Grid container spacing={24}>
                <Grid item xs={8}>
                    <AllLecturesFrame courseId={this.props.match.params.courseId} />
                </Grid>
                <Grid item xs={4}>
                    <TopLecturesFrame />
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(ProfessorViewLectures);
