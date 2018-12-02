import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import APIProfService from '../../../services/APIProfService';
import { observer, inject } from 'mobx-react';
import AllCoursesFrame from '../../../components/AllCoursesFrame';
import Grid from '@material-ui/core/Grid';
import TopCoursesStatFrame from '../../../components/TopCoursesStatFrame';

const styles = theme => ({

});

@inject("profStore")
@observer
class ProfessorHome extends React.Component {
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
                    <AllCoursesFrame profStore={this.profStore} apiProfService={this.apiProfService} />
                </Grid>
                <Grid item xs={4}>
                    <TopCoursesStatFrame profStore={this.profStore} apiProfService={this.apiProfService} />
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(ProfessorHome);
