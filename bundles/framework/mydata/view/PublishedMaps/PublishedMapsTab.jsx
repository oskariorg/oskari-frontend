import React from 'react';
import PropTypes from 'prop-types';
import { PublishedMapsList } from './PublishedMapsList';

export const PublishedMapsTab = ({ controller, state }) => {

    return (
        <PublishedMapsList
            controller={controller}
            data={state.data}
        />
    )
};

PublishedMapsTab.propTypes = {
    controller: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired
}
