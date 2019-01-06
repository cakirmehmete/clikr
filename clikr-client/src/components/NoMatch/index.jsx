import React from 'react';
import Typography from '@material-ui/core/Typography';

class NoMatch extends React.Component {

    render() {
        return (
            <Typography variant="h5">
                Woops! This page does not exist.
            </Typography>
        );
    }

}

export default NoMatch;
