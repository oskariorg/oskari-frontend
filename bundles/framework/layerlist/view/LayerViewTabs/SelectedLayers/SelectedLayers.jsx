import React from 'react';
import PropTypes from 'prop-types';
import { LayerBox } from './LayerBox';

export const SelectedLayers = ({ layers }) => {
    console.log(layers);
    return (
        <div>
            {layers.map(layer => {
                const id = layer.getId();
                return (
                    <LayerBox
                        key={id}
                        layer={layer}
                    />
                );
            })}
        </div>
    );
};

SelectedLayers.propTypes = {
    layers: PropTypes.arrayOf(PropTypes.shape({}))
};
