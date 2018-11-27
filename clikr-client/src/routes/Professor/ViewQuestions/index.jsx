import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { observer, inject } from 'mobx-react';
import APIProfService from '../../../services/APIProfService';
import AllQuestionsFrame from '../../../components/AllQuestionsFrame';

const styles = theme => ({

});

@inject("profStore")
@observer
class ProfessorViewQuestions extends React.Component {
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
                    <AllQuestionsFrame profStore={this.profStore} apiProfService={this.apiProfService} />
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(ProfessorViewQuestions);
