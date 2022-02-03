import React from 'react';
import PropTypes from 'prop-types';
import { StyleEditor } from 'oskari-ui/components/StyleEditor';

export const VisualizationTab = ({ style, updateStyle }) => (
    <StyleEditor
        oskariStyle={ style }
        onChange={ updateStyle }
    />
);
VisualizationTab.propTypes = {
    style: PropTypes.object.isRequired,
    updateStyle: PropTypes.func.isRequired
};
