import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom'
import { observer, inject } from 'mobx-react';
import APIStudentService from '../../../services/APIStudentService';

@inject("store")
@observer
class ClassCard extends React.Component {

    constructor(props) {
        super(props)
        this.store = props.store
        this.apiStudentService = new APIStudentService(this.store)
        
        
    }
    state = {
        link:'student/questions',
        course_id: ''
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
                    <Link to={{
                        pathname: '/student/questions',
                        state : {
                            course_id: this.props.id,
                        }
                    }} style={{ "color": "black", "textDecoration": "none" }}>
                        <Button size="small" >
                            Join 
                        </Button>
                    </Link>
                </CardActions>
            </Card>
        );
    }
}

export default ClassCard;