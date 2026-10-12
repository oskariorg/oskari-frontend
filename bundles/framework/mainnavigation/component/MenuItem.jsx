import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'oskari-ui';
import { showFlyout } from 'oskari-ui/components/window';
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

const StyledBadge = styled(Badge)`
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

/**
 * Default menu item behavior, independent of whether the React view is mounted.
 * Custom setActive and setBadge callbacks replace the default methods entirely.
 */
export class MenuItem {
    constructor (options) {
        this.flyoutControls = null;
        this.isActive = false;
        this.onChange = null;
        this.onClose = null;
        this.update(options);
        if (typeof options.setActive === 'function') {
            this.setActive = options.setActive;
        }
        if (typeof options.setBadge === 'function') {
            this.setBadge = options.setBadge;
        }
        if (typeof options.render === 'function') {
            this.render = options.render;
        }
    }

    connect (onChange, onClose) {
        this.onChange = onChange;
        this.onClose = onClose;
    }

    update (options) {
        this.options = { ...options };
        this.id = options.id;
        this.name = options.name;
        if (Object.hasOwn(options, 'badge')) {
            this.badge = options.badge;
        }
    }

    setActive (isActive) {
        this.isActive = isActive;
        if (!isActive) {
            const controls = this.flyoutControls;
            this.flyoutControls = null;
            controls?.close();
            return;
        }
        if (this.flyoutControls) {
            return;
        }
        const controls = showFlyout(this.name, `${this.name} flyout`, () => {
            if (this.flyoutControls !== controls) {
                return;
            }
            this.flyoutControls = null;
            this.onClose?.(this.id);
        });
        this.flyoutControls = controls;
    }

    setBadge (badge) {
        if (this.badge === badge) {
            return false;
        }
        this.badge = badge;
        this.onChange?.();
        return true;
    }

    getState () {
        return {
            ...this.options,
            isActive: this.isActive,
            badge: this.badge
        };
    }

    render (onActiveChange) {
        return <MenuItemView key={this.id} {...this.getState()} onActiveChange={onActiveChange} />;
    }

    dispose () {
        const controls = this.flyoutControls;
        this.flyoutControls = null;
        controls?.close();
        this.onChange = null;
        this.onClose = null;
    }
}

const MenuItemView = ({ id, name, tooltip, onActiveChange, isActive = false, badge, style }) => {
    const handleClick = () => {
        onActiveChange(id, !isActive);
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
            style={style}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            $isActive={isActive}
            aria-pressed={isActive}
        >
            <Title>{name}</Title>
            {typeof badge === 'number' && (
                <StyledBadge count={badge} />
            )}
        </MenuItemContainer>
    );
};

MenuItemView.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    tooltip: PropTypes.string,
    onActiveChange: PropTypes.func.isRequired,
    isActive: PropTypes.bool,
    badge: PropTypes.number,
    style: PropTypes.object
};
