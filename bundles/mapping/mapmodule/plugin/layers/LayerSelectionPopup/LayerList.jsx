import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Checkbox, Message } from 'oskari-ui';
import { StyleSelect } from './StyleSelect';

export const LayerRow = styled('div')`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const LayerList = ({ layers, showMetadata, styleSelectable, setLayerVisibility, selectStyle }) => {
    if (!layers || !layers.length) {
        return null;
    }
    return (
        <React.Fragment>
            <h3><Message messageKey='plugin.LayerSelectionPlugin.chooseOtherLayers' /></h3>
            {layers.map(layer => {
                return (
                    <div key={layer.getId()}>
                        <LayerRow>
                            <Checkbox
                                checked={layer.isVisible()}
                                onChange={e => setLayerVisibility(layer, e.target.checked, false)}
                                >{layer.getName()}</Checkbox>
                            {showMetadata && (<MetadataIcon metadataId={layer.getMetadataIdentifier()} />)}
                        </LayerRow>
                            {styleSelectable && <StyleSelect layer={layer} selectStyle={selectStyle} />}
                    </div>
                );
            })}
        </React.Fragment>
    );
};

LayerList.propTypes = {
    layers: PropTypes.arrayOf(PropTypes.object),
    showMetadata: PropTypes.bool.isRequired,
    setLayerVisibility: PropTypes.func.isRequired,
    selectStyle: PropTypes.func.isRequired,
    styleSelectable: PropTypes.bool.isRequired
};
