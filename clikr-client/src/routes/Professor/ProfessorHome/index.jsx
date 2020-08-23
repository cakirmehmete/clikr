import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import APIProfService from '../../../services/APIProfService';
import { observer, inject } from 'mobx-react';
import AllCoursesFrame from '../../../components/AllCoursesFrame';
import ArchivedCoursesFrame from '../../../components/ArchivedCoursesFrame';

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
            <div>
                <AllCoursesFrame profStore={this.profStore} apiProfService={this.apiProfService} />
                <ArchivedCoursesFrame profStore={this.profStore} apiProfService={this.apiProfService} />
            </div>
        );
    }
}

export default withStyles(styles)(ProfessorHome);
