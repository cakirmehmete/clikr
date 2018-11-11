import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import typeographytheme from '../Themes/typeographytheme'

class ClassCardStudent extends React.Component {
    render () {
        return (
            <MuiThemeProvider theme={typeographytheme}>
                <Card style={{width:'98%', background:"#E76F51"}}>
                <CardContent>
                    <Typography variant="h4">
                    Physics 104
                    </Typography>
                    <Typography marginbottom="12" color="textSecondary">
                    class in session
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small"> Join </Button>
                </CardActions>
                </Card>
            </MuiThemeProvider>
          );
    }
}
export default ClassCardStudent;