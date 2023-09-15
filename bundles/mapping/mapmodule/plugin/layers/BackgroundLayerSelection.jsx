import React from 'react';
import { Dropdown, Tooltip } from 'oskari-ui';
import { LayersIcon } from 'oskari-ui/components/icons';
import styled from 'styled-components';
import { MapModuleTextButton } from '../../MapModuleTextButton';
import PropTypes from 'prop-types';

const BUTTON_WIDTH = 150;
const ButtonsContainer = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const ButtonText = styled('span')`
    overflow: hidden;
    text-overflow: ellipsis;
`;

const getDropDownItems = (layers = []) => {
    return layers.map(layer => ({
        title: layer.title,
        action: () => layer.onClick(layer.id)
    }));
};

const isWiderThanMap = (mapWidth, numberOfLayers) => {
    return (numberOfLayers * BUTTON_WIDTH) >= mapWidth;
};

export const BackgroundLayerSelection = ({ isMobile = false, layers, current, mapWidth, ...rest }) => {
    if (isMobile || (mapWidth && isWiderThanMap(mapWidth, layers.length))) {
        return (
            <ButtonsContainer className='layerSelection'>
                <Dropdown items={getDropDownItems(layers)}>
                    <MapModuleTextButton
                        visible={true}
                        icon={<LayersIcon />}
                        $isDropdown={true}
                        data-layerid={current?.getId()}
                        text={<ButtonText>{current?.getName()}</ButtonText>}
                        {...rest}
                    />
                </Dropdown>
            </ButtonsContainer>
        );
    }
    return (
        <ButtonsContainer className='layerSelection'>
            {layers.map(layer => (
                <Tooltip key={layer.id} title={layer.title}>
                    <MapModuleTextButton
                        visible={true}
                        onClick={() => layer.onClick(layer.id)}
                        icon={null}
                        text={<ButtonText>{layer.title}</ButtonText>}
                        active={Number.parseInt(layer.id, 10) === current?.getId()}
                        loading={false}
                        $isDropdown={false}
                        $minWidth={BUTTON_WIDTH}
                        data-layerid={layer.id}
                        {...rest}
                    />
                </Tooltip>
            ))}
        </ButtonsContainer>
    );
};

BackgroundLayerSelection.propTypes = {
    isMobile: PropTypes.bool,
    layers: PropTypes.array,
    current: PropTypes.object,
    mapWidth: PropTypes.number
}