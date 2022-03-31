import React from 'react';
import PropTypes from 'prop-types';
import { MyViewsList } from './MyViewsList';

export const MyViewsTab = ({ controller, data }) => {

    return (
        <MyViewsList
            controller={controller}
            data={data}
        />
    )
};

MyViewsTab.propTypes = {
    controller: PropTypes.object.isRequired,
    data: PropTypes.arrayOf(PropTypes.object)
}
