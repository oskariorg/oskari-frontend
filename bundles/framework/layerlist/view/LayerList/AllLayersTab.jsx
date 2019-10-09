import React from 'react';
import PropTypes from 'prop-types';
import { LayerFilters } from './LayerFilters';
import { LayerCollapse } from './LayerCollapse';

export const AllLayersTab = ({ filter, collapse, locale }) => {
    return (
        <React.Fragment>
            <LayerFilters {...filter} locale={locale.filter} />
            <LayerCollapse {...collapse} locale={locale}/>
        </React.Fragment>
    );
};

AllLayersTab.propTypes = {
    filter: PropTypes.object.isRequired,
    collapse: PropTypes.object.isRequired,
    locale: PropTypes.object.isRequired
};
