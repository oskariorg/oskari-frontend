import React from 'react';
import PropTypes from 'prop-types';
import { styled } from 'styled-components';

const ACTIVATION_KEYS = ['Enter', ' '];

const MenuItemContainer = styled('div')`
    display: block;
    box-sizing: content-box;
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 2.214286em;
    border: 0;
    border-top: 0.071429em solid #484846;
    border-bottom: 0.071429em solid ${({ $isActive }) => $isActive ? '#fff' : '#212121'};
    background: ${({ $isActive }) => $isActive ? '#fff' : 'linear-gradient(#30302e, #2a2a2c)'};
    color: ${({ $isActive }) => $isActive ? '#333438' : '#fff'};
    font: inherit;
    font-size: 0.875rem;
    line-height: 1.214286em;
    text-align: left;
    cursor: pointer;

    &:hover {
        border-top-color: ${({ $isActive }) => $isActive ? '#484846' : '#585856'};
        background: ${({ $isActive }) => $isActive ? '#fff' : 'linear-gradient(#40403e, #3a3a3c)'};
    }
`;

const Title = styled('span')`
    display: inline-block;
    margin: 0.6364em 0 0.6364em 1.4545em;
    padding: 0;
    width: 10.1818em;
    max-width: calc(100% - 4em);
    font-weight: bold;
    font-size: 0.785714em;
    text-transform: uppercase;
    overflow-wrap: anywhere;
    user-select: none;
`;

const Status = styled('span')`
    float: right;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: content-box;
    min-width: 1.8182em;
    height: 1.7273em;
    margin: 0.5455em 0.0909em 0.0909em;
    padding: 0.0909em;
    font-size: 0.785714em;
    font-weight: bold;
    line-height: 1.7273em;
    text-align: center;
`;

const Badge = styled('span')`
    display: inline-block;
    padding: 0.090909em 0.636364em 0.181818em;
    border-radius: 0.818182em;
    background-color: #999;
    color: #fff;
    font-weight: bold;
    line-height: 1;
    white-space: nowrap;
    text-shadow: 0 -0.090909em 0 rgba(0, 0, 0, 0.25);
`;

export const MenuItem = ({ id, name, tooltip, active, isActive = false, badge }) => {
    const handleClick = () => {
        if (typeof active === 'function') {
            active(id);
        }
    };

    const handleKeyDown = (event) => {
        if (ACTIVATION_KEYS.includes(event.key)) {
            event.preventDefault();
            handleClick();
        }
    };

    return (
        <MenuItemContainer
            role="button"
            tabIndex={0}
            title={tooltip}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            $isActive={isActive}
            aria-pressed={isActive}
        >
            <Title>{name}</Title>
            {typeof badge === 'number' && (
                <Status>
                    <Badge>{badge}</Badge>
                </Status>
            )}
        </MenuItemContainer>
    );
};

MenuItem.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    tooltip: PropTypes.string,
    active: PropTypes.func,
    isActive: PropTypes.bool,
    badge: PropTypes.number
};
