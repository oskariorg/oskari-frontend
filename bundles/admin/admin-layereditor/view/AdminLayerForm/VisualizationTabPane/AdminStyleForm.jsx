import React from 'react';
import PropTypes from 'prop-types';
import { StyleSelect } from './StyleSelect';
import { Controller } from 'oskari-ui/util';

export const AdminStyleForm = (props) => {
    return (
        <StyleSelect layer={ props.layer } controller={ props.controller } />
    );
};

AdminStyleForm.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
