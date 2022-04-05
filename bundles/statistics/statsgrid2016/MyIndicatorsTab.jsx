import React from 'react';
import PropTypes from 'prop-types';
import { MyIndicatorsList } from './MyIndicatorsList';

export const MyIndicatorsTab = ({ state, controller }) => {
    return (
        <MyIndicatorsList
            controller={controller}
            data={state.data}
        />
    );
}

MyIndicatorsTab.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired
}
