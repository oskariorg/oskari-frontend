import React from 'react';
import PropTypes from 'prop-types';
import { InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ThemeConsumer } from 'oskari-ui/util';
import { getNavigationTheme } from 'oskari-ui/theme';

const StyledMetadataIcon = styled(InfoCircleOutlined)`
    cursor: pointer;
    color: #0290ff;
    border-radius: 50%;
    &:hover {
        color: ${props => props.$hoverColor};
        background-color: rgba(${props => props.$bgColor.r}, ${props => props.$bgColor.g}, ${props => props.$bgColor.b}, 0.25);
    }
`;

/**
 * @param {Number} metadataId Metadata ID
 * @param {Number} size Font size in pixels
 * @param {Object} style Additional styles
 * @returns
 */
export const Metadata = ThemeConsumer(({ theme = {}, metadataId, layerId, size = 16, style }) => {
    if (!metadataId || !Oskari.getSandbox().hasHandler('catalogue.ShowMetadataRequest')) return null;

    const helper = getNavigationTheme(theme);
    const hover = helper.getButtonHoverColor();
    const bgColor = Oskari.util.hexToRgb(hover);

    const onClick = () => {
        Oskari.getSandbox().postRequestByName('catalogue.ShowMetadataRequest', [
            { layerId }
        ]);
    };

    return (
        <StyledMetadataIcon
            className='t_icon t_metadata'
            style={{ fontSize: `${size}px`, ...style }}
            onClick={(evt) => {
                onClick();
                evt.stopPropagation();
            }}
            $hoverColor={hover}
            $bgColor={bgColor}
        />
    );
});

Metadata.propTypes = {
    metadataId: PropTypes.any,
    size: PropTypes.number,
    style: PropTypes.object
};
