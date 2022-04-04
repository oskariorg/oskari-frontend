import React from 'react';
import PropTypes from 'prop-types';
import { MyIndicatorsList } from './MyIndicatorsList';

export const MyIndicatorsTab = ({ controller, data = [] }) => {
    return (
        <MyIndicatorsList
            controller={controller}
            data={data}
        />
    );
}

MyIndicatorsTab.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object)
}
