import React from 'react';
import PropTypes from 'prop-types';
import { LayerBox } from './LayerBox';

export const SelectedLayers = ({ layers }) => {
    return (
        <React.Fragment>
            {layers.map(layer => {
                const id = layer.getId();
                return (
                    <LayerBox
                        key={id}
                        layer={layer}
                    />
                );
            })}
        </React.Fragment>
    );
};

SelectedLayers.propTypes = {
    layers: PropTypes.arrayOf(PropTypes.shape({}))
};
