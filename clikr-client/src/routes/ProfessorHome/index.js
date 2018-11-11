import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = {
    root: {
        flexGrow: 1,
    },
};


class ProfessorHome extends Component {
    render() {
        return (
            <div>
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <Typography variant="h6" color="inherit">
                            Professor Home Page
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

ProfessorHome.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProfessorHome);
