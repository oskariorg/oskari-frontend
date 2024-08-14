import React from 'react';
import { Dropdown, Tooltip, Message } from 'oskari-ui';
import { LayersIcon } from 'oskari-ui/components/icons';
import styled from 'styled-components';
import { MapModuleTextButton, BUTTON_WIDTH } from '../../MapModuleTextButton';
import PropTypes from 'prop-types';

const BUNDLE_KEY = 'MapModule';

const ButtonsContainer = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const BackgroundLayerSelectionButtonText = styled('div')`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;
const isWiderThanMap = (mapWidth, numberOfLayers) => {
    return (numberOfLayers * BUTTON_WIDTH) >= mapWidth;
};

export const BackgroundLayerSelection = ({ isMobile = false, baseLayers, selectedId, mapWidth, ...rest }) => {
    if (isMobile || (mapWidth && isWiderThanMap(mapWidth, baseLayers.length))) {
        const title = baseLayers.find(({ id }) => id === selectedId)?.title || <Message bundleKey={BUNDLE_KEY} messageKey='plugin.BackgroundLayerSelectionPlugin.emptyOption' />;
        return (
            <ButtonsContainer className='layerSelection'>
                <Dropdown items={baseLayers}>
                    <MapModuleTextButton
                        visible={true}
                        icon={<LayersIcon />}
                        $isDropdown={true}
                        data-layerid={selectedId}
                        {...rest}
                    >
                        <BackgroundLayerSelectionButtonText>{title}</BackgroundLayerSelectionButtonText>
                    </MapModuleTextButton>
                </Dropdown>
            </ButtonsContainer>
        );
    }
    return (
        <ButtonsContainer className='layerSelection'>
            {baseLayers.map(({ id, title, action }) => (
                <Tooltip key={id} title={title}>
                    <MapModuleTextButton
                        visible={true}
                        onClick={action}
                        icon={null}
                        active={selectedId === id}
                        loading={false}
                        $isDropdown={false}
                        $minWidth={BUTTON_WIDTH}
                        data-layerid={id}
                        {...rest}
                    >
                        <BackgroundLayerSelectionButtonText>{title}</BackgroundLayerSelectionButtonText>
                    </MapModuleTextButton>
                </Tooltip>
            ))}
        </ButtonsContainer>
    );
};

BackgroundLayerSelection.propTypes = {
    isMobile: PropTypes.bool,
    baseLayers: PropTypes.array,
    selectedId: PropTypes.string,
    mapWidth: PropTypes.number
};
