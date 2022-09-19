import React from 'react';
import PropTypes from 'prop-types';
import { InfoCircleOutlined } from '@ant-design/icons';
import { ThemeConsumer } from '../../util';
import styled from 'styled-components';

const getThemeColors = theme => {
    let color = theme?.color?.accent;
    if (!color || Oskari.util.isLightColor(color)) {
        // default to light blue if:
        // - accent color is missing
        // - color is too light to be readable
        return {
            main: '#0290ff',
            hover: 'rgba(24,144,255, 0.25)'
        };
    }
    // hover = accent with 25% opacity
    const components = Oskari.util.hexToRgb(color);
    return {
        main: color,
        //hover
        hover: `rgba(${components.r},${components.g},${components.b}, 0.25)`
    };
};

const StyledMetadataIcon = styled(InfoCircleOutlined)`
    cursor: pointer;
    color: ${props => props.theme.main};
    border-radius: 50%;
    &:hover {
        background-color: ${props => props.theme.hover};
    }
`;

/**
 * @param {Number} metadataId Metadata ID
 * @param {Number} size Font size in pixels
 * @param {Object} style Additional styles
 * @returns 
 */
export const Metadata = ThemeConsumer(({ metadataId, size = 16, style, theme }) => {
    if (!metadataId) {
        return null;
    }

    const onClick = () => {
        Oskari.getSandbox()
            .postRequestByName('catalogue.ShowMetadataRequest', [{ uuid: metadataId }]);
    };

    return (
        <StyledMetadataIcon
            className='t_icon t_metadata'
            theme={getThemeColors(theme)}
            style={{ fontSize: `${size}px`, ...style }}
            onClick={onClick}
        />
    );
});

Metadata.propTypes = {
    metadataId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    size: PropTypes.number,
    style: PropTypes.object
};
