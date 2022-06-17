import React from 'react';
import PropTypes from 'prop-types';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'oskari-ui';
import styled from 'styled-components';


const StyledInfoIcon = styled(QuestionCircleOutlined)`
    cursor: pointer;
    color: #0290ff;
    border-radius: 50%;
    &:hover {
        background-color: rgba(24,144,255, 0.25);
    }
`;

/**
 * 
 * @param {String} title Icon tooltip
 * @param {Number} size Font size in pixels
 * @param {Object} style Additional styles
 * @param {Function} onClick onClick
 * @returns 
 */
export const Info = ({ children, title, size = 16, style, onClick }) => {

    return (
        <Tooltip title={title || children}>
            <StyledInfoIcon
                className='t_icon t_info'
                style={{ fontSize: `${size}px`, ...style }}
                onClick={onClick}
            />
        </Tooltip>
    );
};

Info.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    size: PropTypes.number,
    style: PropTypes.object,
    onClick: PropTypes.func
};
