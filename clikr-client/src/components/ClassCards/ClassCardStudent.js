import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import typeographytheme from '../../constants/Themes/typeographytheme'

class ClassCardStudent extends React.Component {
    state = {
        courseName: "Physics 104",
        isInSession: true, 
        sessionString:"",
    }
    componentWillMount() {
        if (this.state.isInSession) {
            this.setState({sessionString:"class in session"});
        }
        else {
            this.setState({sessionString:"not in session"});
        }
    }

    render () {
        return (
            <MuiThemeProvider theme={typeographytheme}>
                <Card style={{width:'98%', background:"#E76F51"}}>
                <CardContent>
                    <Typography variant="h4">
                        {this.state.courseName}
                    </Typography>
                    <Typography marginbottom="12" color="textSecondary">
                        {this.state.sessionString}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" disabled={!this.state.isInSession}> Join </Button>
                </CardActions>
                </Card>
            </MuiThemeProvider>
          );
    }
}
export default ClassCardStudent;