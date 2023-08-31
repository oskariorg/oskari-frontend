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
        background-color: rgba(${props => props.$bgColor[0]}, ${props => props.$bgColor[1]}, ${props => props.$bgColor[2]}, 0.25);
    }
`;

const ThemedMetadata = ThemeConsumer(({ theme = {}, size, style, onClick }) => {
    const helper = getNavigationTheme(theme);
    const hover = helper.getButtonHoverColor();
    const bgColor = Oskari.util.hexToRgb(hover);

    return (
        <StyledMetadataIcon
            className='t_icon t_metadata'
            style={{ fontSize: `${size}px`, ...style }}
            onClick={onClick}
            $hoverColor={hover}
            $bgColor={bgColor}
        />
    );
});

/**
 * @param {Number} metadataId Metadata ID
 * @param {Number} size Font size in pixels
 * @param {Object} style Additional styles
 * @returns 
 */
export const Metadata = ({ metadataId, size = 16, style }) => {

    if (!metadataId) return null;

    const onClick = () => {
        Oskari.getSandbox().postRequestByName('catalogue.ShowMetadataRequest', [
            {uuid: metadataId}
    ]);
    };

    return (
        <ThemedMetadata
            size={size}
            style={style}
            onClick={onClick}
        />
    );
};

Metadata.propTypes = {
    metadataId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    size: PropTypes.number,
    style: PropTypes.object
};
