import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Message } from 'oskari-ui';
import './header.scss';

const getTitleComponent = (selected, indicators, controller, title) => {
    if (indicators.length > 1) {
        return (
            <select value={selected} onChange={evt => controller.setActiveIndicator(evt.target.value)}>
                {indicators.map(opt => <option key={opt.hash} value={opt.hash}>{opt.title}</option>)}
            </select>
        );
    }
    return (
        <div className = "title">{title}</div>
    );
};

export const Header = ({ selected, indicators, isEdit, toggleEdit, controller }) => {
    const headerClass = indicators.length > 1 ? 'active-header multi-selected' : 'active-header single-selected';
    const buttonClass = isEdit ? 'edit-button edit-active' : 'edit-button';
    const { title = '' } = indicators.find(indicator => indicator.hash === selected) || {};

    return (
        <div className={headerClass} data-selected-indicator={title}>
            {getTitleComponent(selected, indicators, controller, title)}
            <Tooltip placement='topRight' title={<Message messageKey={`classify.edit.${isEdit ? 'close' : 'open'}`}/>}>
                <div className={buttonClass} onMouseUp = {toggleEdit}/>
            </Tooltip>
        </div>
    );
};

Header.propTypes = {
    selected: PropTypes.string.isRequired,
    indicators: PropTypes.array.isRequired,
    isEdit: PropTypes.bool.isRequired,
    toggleEdit: PropTypes.func.isRequired,
    controller: PropTypes.object.isRequired
};
