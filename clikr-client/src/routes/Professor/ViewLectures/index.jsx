import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { observer, inject } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import APIProfService from '../../../services/APIProfService';

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
            <div>
                View Lectures
            </div>
        );
    }
}

export default withStyles(styles)(ProfessorViewLectures);
