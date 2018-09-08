import React from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core';

const styles = {
    root: {
        margin: 24,
        marginTop: 80,
    },
}

const Container = ({ classes, children }) => (
    <Paper elevation={4} className={classes.root} >
        {children}
    </Paper>
)

Container.propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([ // eslint-disable-line
        PropTypes.arrayOf(PropTypes.element),
        PropTypes.element,
    ]),
}

export default withStyles(styles)(Container)
