import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AllLecturesFrame from '../../../components/AllLecturesFrame';
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
            <AllLecturesFrame profStore={this.profStore} apiProfService={this.apiProfService} courseId={this.props.match.params.courseId} />
        );
    }
}

export default withStyles(styles)(ProfessorViewLectures);
