import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { LayerBox } from './LayerBox';

export const SelectedLayers = ({ layers }) => {
    return (
        <Fragment>
            {layers.map(layer => (
                <LayerBox
                    key={layer.getId()}
                    layer={layer}
                />
            ))}
        </Fragment>
    );
};

SelectedLayers.propTypes = {
    layers: PropTypes.arrayOf(PropTypes.shape({}))
};
