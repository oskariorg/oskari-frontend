import React from 'react';
import PropTypes from 'prop-types';
import { withContext } from 'oskari-ui/util';
import './header.scss';

const handleIndicatorChange = (service, value) => {
    service.getStateService().setActiveIndicator(value);
};

const getTitleComponent = (indicators, active, service, title) => {
    if (indicators.length > 1) {
        return (
            <select value={active.hash} onChange={evt => handleIndicatorChange(service, evt.target.value)}>
                {indicators.map(opt => <option key={opt.id} value={opt.id}>{opt.title}</option>)}
            </select>
        );
    }
    return (
        <div className = "title">{title}</div>
    );
};

const Header = props => {
    const { indicators, active, service } = props;
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
            {getTitleComponent(indicators, active, service, title)}
            <div className={buttonClass} title={props.loc(buttonTooltip)} onMouseUp = {props.handleClick}/>
        </div>
    );
};

Header.propTypes = {
    indicators: PropTypes.array,
    active: PropTypes.object,
    isEdit: PropTypes.bool,
    handleClick: PropTypes.func,
    service: PropTypes.object,
    loc: PropTypes.func
};

const contextWrapped = withContext(Header);
export { contextWrapped as Header };
