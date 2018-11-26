import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import APIProfService from '../../../services/APIProfService';
import { observer, inject } from 'mobx-react';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({

});

@inject("profStore")
@observer
class ProfessorNewCourse extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
        this.profStore = props.profStore
        this.apiProfService = new APIProfService(this.profStore)
    }

    render() {
        return (
            <div>
                New Course
            </div>
        );
    }
}

export default withStyles(styles)(ProfessorNewCourse);
