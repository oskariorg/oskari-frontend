import React from 'react';
import PropTypes from 'prop-types';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'oskari-ui';
import styled from 'styled-components';
import { ThemeConsumer } from 'oskari-ui/util';
import { getNavigationTheme } from 'oskari-ui/theme';

const StyledInfoIcon = styled(QuestionCircleOutlined)`
    cursor: pointer;
    color: #0290ff;
    border-radius: 50%;
    margin-left: ${props => props.$space ? '10px' : '0px'};
    &:hover {
        color: ${props => props.$hoverColor};
        background-color: rgba(${props => props.$bgColor.r}, ${props => props.$bgColor.g}, ${props => props.$bgColor.b}, 0.25);
    }
`;

/**
 * @param {String} title Icon tooltip
 * @param {Number} size Font size in pixels
 * @param {Object} style Additional styles
 * @returns
 */
export const Info = ThemeConsumer(({ theme = {}, children, title, size = 16, style, space = true, placement = 'top' }) => {
    const helper = getNavigationTheme(theme);
    const hover = helper.getButtonHoverColor();
    const bgColor = Oskari.util.hexToRgb(hover);

    return (
        <Tooltip title={title || children} placement={placement}>
            <StyledInfoIcon
                className='t_icon t_info'
                $space={space}
                style={{ fontSize: `${size}px`, ...style }}
                $hoverColor={hover}
                $bgColor={bgColor}
            />
        </Tooltip>
    );
});

Info.propTypes = {
    title: PropTypes.any,
    size: PropTypes.number,
    style: PropTypes.object,
    space: PropTypes.bool
};
