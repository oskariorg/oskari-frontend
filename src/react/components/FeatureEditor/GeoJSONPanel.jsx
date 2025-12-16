import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, CollapsePanel } from 'oskari-ui';

export const GeoJSONPanel = ({ feature = {} }) => {
    return (
        <Collapse>
            <CollapsePanel header="GeoJSON">
                <pre>{JSON.stringify(feature, null, 2)}</pre>
            </CollapsePanel>
        </Collapse>);
};

GeoJSONPanel.propTypes = {
    feature: PropTypes.object
};
