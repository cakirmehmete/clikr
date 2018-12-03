import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { observer, inject } from 'mobx-react';

const styles = theme => ({
    card: {
        minWidth: 275,
    },
});

@inject("profStore") // props.profStore
@inject("apiService") // props.apiService
@observer
class TopLecturesFrame extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
    }

    render() {
        return (
            <div>
                <Typography variant="subtitle1" color="textPrimary">
                    What are your top lectures?
                </Typography>
                <Card className={this.styles.card}>
                    <CardContent>
                        <Typography variant="h6" color="inherit">
                            Your Top Lectures
                        </Typography>
                        Todo
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default withStyles(styles)(TopLecturesFrame);
