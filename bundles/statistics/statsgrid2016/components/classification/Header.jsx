import React from 'react';
import PropTypes from 'prop-types';
import { withContext } from 'oskari-ui/util';
import './header.scss';

const handleIndicatorChange = (mutator, value) => {
    mutator.setActiveIndicator(value);
};

const getTitleComponent = (indicators, active, mutator, title) => {
    if (indicators.length > 1) {
        return (
            <select value={active.hash} onChange={evt => handleIndicatorChange(mutator, evt.target.value)}>
                {indicators.map(opt => <option key={opt.id} value={opt.id}>{opt.title}</option>)}
            </select>
        );
    }
    return (
        <div className = "title">{title}</div>
    );
};

const Header = props => {
    const { indicators, active, mutator } = props;
    const headerClass = indicators.length > 1 ? 'active-header multi-selected' : 'active-header single-selected';
    const { title } = indicators.find(indicator => active.hash === indicator.id) || { title: '' };
    let buttonClass = 'edit-button';
    let buttonTooltip = 'classify.edit.open';
    if (props.isEdit) {
        buttonClass = 'edit-button edit-active';
        buttonTooltip = 'classify.edit.close';
    }

    return (
        <div className={headerClass} data-selected-indicator={title}>
            {getTitleComponent(indicators, active, mutator, title)}
            <div className={buttonClass} title={props.loc(buttonTooltip)} onMouseUp = {props.handleClick}/>
        </div>
    );
};

Header.propTypes = {
    indicators: PropTypes.array.isRequired,
    active: PropTypes.object.isRequired,
    isEdit: PropTypes.bool.isRequired,
    handleClick: PropTypes.func.isRequired,
    mutator: PropTypes.object.isRequired,
    loc: PropTypes.func.isRequired
};

const contextWrapped = withContext(Header);
export { contextWrapped as Header };
