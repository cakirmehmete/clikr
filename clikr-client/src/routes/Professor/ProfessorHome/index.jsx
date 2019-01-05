import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import APIProfService from '../../../services/APIProfService';
import { observer, inject } from 'mobx-react';
import AllCoursesFrame from '../../../components/AllCoursesFrame';

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
            <AllCoursesFrame profStore={this.profStore} apiProfService={this.apiProfService} />
        );
    }
}

export default withStyles(styles)(ProfessorHome);
