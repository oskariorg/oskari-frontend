import React from 'react';
import PropTypes from 'prop-types';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'oskari-ui';
import styled from 'styled-components';
import { ThemeProvider, ThemeConsumer } from 'oskari-ui/util';
import { getNavigationTheme } from 'oskari-ui/theme';


const StyledInfoIcon = styled(QuestionCircleOutlined)`
    cursor: pointer;
    color: #0290ff;
    border-radius: 50%;
    &:hover {
        color: ${props => props.$hoverColor};
        background-color: rgba(${props => props.$bgColor[0]}, ${props => props.$bgColor[1]}, ${props => props.$bgColor[2]}, 0.25);
    }
`;

const ThemedInfo = ThemeConsumer(({ theme = {}, title, children, size, style }) => {
    const helper = getNavigationTheme(theme);
    const hover = helper.getButtonHoverColor();
    const bgColor = Oskari.util.hexToRgb(hover);

    return (
        <Tooltip title={title || children}>
            <StyledInfoIcon
                className='t_icon t_info'
                style={{ fontSize: `${size}px`, ...style }}
                $hoverColor={hover}
                $bgColor={bgColor}
            />
        </Tooltip>
    );
});

/**
 * 
 * @param {String} title Icon tooltip
 * @param {Number} size Font size in pixels
 * @param {Object} style Additional styles
 * @returns 
 */
export const Info = ({ children, title, size = 16, style }) => {

    return (
        <ThemeProvider>
            <ThemedInfo
                children={children}
                title={title}
                size={size}
                style={style}
            />
        </ThemeProvider>
    );
};

Info.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    size: PropTypes.number,
    style: PropTypes.object
};
