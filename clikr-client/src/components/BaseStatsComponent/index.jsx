import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { observer } from 'mobx-react';

const styles = theme => ({
    card: {
        marginBottom: 10
    }
});

@observer
class BaseStatsComponent extends React.Component {
    constructor(props) {
        super(props)
        this.styles = props.classes
    }

    render() {
        return (
            <Card className={this.styles.card} hidden={this.props.hidden}>
                <CardContent>
                    <Typography variant="h6" color="inherit">
                        Statistics for {this.props.questionTitle}
                    </Typography>
                    {this.props.children}
                    <Typography variant="body1" color="inherit">
                        Total Responses: {this.props.responsesNumber}
                    </Typography>
                </CardContent>
            </Card>
        );
    }
}

export default withStyles(styles)(BaseStatsComponent);