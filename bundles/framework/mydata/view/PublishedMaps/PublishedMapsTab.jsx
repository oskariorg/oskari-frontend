import React from 'react';
import PropTypes from 'prop-types';
import { PublishedMapsList } from './PublishedMapsList';

export const PublishedMapsTab = ({ controller, state }) => {

    return (
        <PublishedMapsList
            controller={controller}
            data={state.data}
            loading={state.loading}
        />
    )
};

PublishedMapsTab.tabSortOrder = 30;

PublishedMapsTab.propTypes = {
    controller: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired
}
