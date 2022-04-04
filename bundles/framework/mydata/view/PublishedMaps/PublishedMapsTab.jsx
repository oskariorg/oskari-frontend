import React from 'react';
import PropTypes from 'prop-types';
import { PublishedMapsList } from './PublishedMapsList';

export const PublishedMapsTab = ({ controller, data }) => {

    return (
        <PublishedMapsList
            controller={controller}
            data={data}
        />
    )
};

PublishedMapsTab.propTypes = {
    controller: PropTypes.object.isRequired,
    data: PropTypes.arrayOf(PropTypes.object)
}
