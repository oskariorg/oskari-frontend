import React from 'react';
import PropTypes from 'prop-types';
import { StyleSelect } from './StyleSelect';
import { Controller } from 'oskari-ui/util';

export const AdminStyleForm = (props) => {
    return (
        <StyleSelect styleList={ props.controller.composeStyleList() } />
    );
};

AdminStyleForm.propTypes = {
    oskariStyle: PropTypes.object,
    controller: PropTypes.instanceOf(Controller).isRequired
};
