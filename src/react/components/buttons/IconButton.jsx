import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../Button';
import { Tooltip } from '../Tooltip';
import styled from 'styled-components';

const StyledButton = styled(Button)`
    border: none;
    background: none;
    width: 16px;
    height: 16px;
    &:hover {
        color: #ffd400;
        background: none;
    }
`;

export const IconButton = ({ title, icon, onClick, ...rest }) => {
    if (title) {
        return (
            <Tooltip title={title}>
                <StyledButton icon={icon} onClick={onClick} { ...rest }/>
            </Tooltip>
        );
    } else {
        return (
            <StyledButton
                icon={icon}
                onClick={onClick}
                { ...rest }
            />
        );
    }
};

IconButton.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    icon: PropTypes.node.isRequired,
    onClick: PropTypes.func
};
