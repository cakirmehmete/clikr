import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom'
import { observer, inject } from 'mobx-react';
import APIStudentService from '../../../services/APIStudentService';
import PropTypes from 'prop-types';

const ClassCard = inject("classStore")(observer(class ClassCard extends React.Component {

    constructor(props) {
        super(props)
        this.apiStudentService = new APIStudentService()
    }

    render() {
        return (
            <Card style={{ width: '98%', margin: '2%', background: "#E76F51" }}>
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
                        <Link to='/student/question' style={{ "color": "black", "text-decoration": "none" }}> Join </Link>
                    </Button>
                </CardActions>
            </Card>
        );
    }
}))

ClassCard.propTypes = {
    name: PropTypes.string,
    number: PropTypes.string
}

export default ClassCard;