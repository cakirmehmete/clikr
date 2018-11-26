import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import typeographytheme from '../../../constants/themes/typographytheme'
import { Link } from 'react-router-dom'
import { observer, inject } from 'mobx-react';
import APIService from '../../../services/APIService';
import PropTypes from 'prop-types';

const ClassCard = inject("classStore")(observer(class ClassCard extends React.Component {

    constructor(props) {
        super(props)
        this.apiService = new APIService()
    }

    render () {
        return (
            <MuiThemeProvider theme={typeographytheme}>
                <Card style={{width:'98%', margin:'2%', background:"#E76F51"}}>
                <CardContent>
                    <Typography variant="h4">
                        {this.props.name}
                    </Typography>
                    <Typography marginbottom="12" color="textSecondary">
                        {this.props.number}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">
                        <Link to='/student/question' style={{"color":"black", "text-decoration": "none"}}> Join </Link>
                    </Button>
                </CardActions>
                </Card>
            </MuiThemeProvider>
            );
        }
}))

ClassCard.propTypes = {
    name: PropTypes.string,
    number: PropTypes.string
}

export default ClassCard;