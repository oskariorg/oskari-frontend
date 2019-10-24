import React from 'react';
import PropTypes from 'prop-types';

/**
 * name: getName();
 * organizationName: getOrganizationName();
 * opacity: getOpacity();
 * visible: isVisible();
 * layerType: getLayerType();
 * isInScale: isInScale();
 * srs: isSupportedSrs();
 */

export const LayerBox = ({ layer }) => {
    const name = layer.getName();
    const organizationName = layer.getOrganizationName();
    const opacity = layer.getOpacity();
    const visible = layer.isVisible();
    const layerType = layer.getLayerType();
    const isInScale = layer.isInScale().toString();
    const srs = layer.isSupportedSrs().toString();
    const activeFeats = layer.getActiveFeatures().length;
    return (
        <div>
            Name: {name} <br />
            Opacity: {opacity} <br />
            Org: {organizationName} <br />
            Visible: {visible.toString()} <br />
            LayerType: {layerType} <br />
            isInScale: {isInScale} <br />
            srsSupported: {srs} <br />
            activeFeats: {activeFeats} <br />
            <br />
        </div>
    );
};

LayerBox.propTypes = {
    layer: PropTypes.shape({})
};
