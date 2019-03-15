import React from 'react';
import PropTypes from 'prop-types';
import {withContext} from '../../../../../src/react/util.jsx';
import ManualClassificationView from './View';

// TODO: change to use general oskari react button and pass props.handleClick = handleManualClassification

const update = (stateService, bounds) => {
    stateService.updateActiveClassification('manualBounds', bounds);
};

const handleManualClassification = ({service, indicators}) => {
    const {series, state, classification, color} = service.getAllServices();
    const ind = indicators.active;
    const view = new ManualClassificationView(classification, color, ind.classification);

    if (ind.series && indicators.serieStats && indicators.serieStats.serie) {
        view.setData(indicators.serieStats.serie);
    } else if (indicators.data) {
        view.setData(indicators.data);
    } else {
        return; // failed to get serie or data -> don't open
    }
    series.setAnimating(false);
    view.openEditor(bounds => update(state, bounds));
};

const ManualClassification = props => {
    return (
        <div className="classification-manual">
            <input className="oskari-formcomponent oskari-button"
                type="button"
                disabled = {props.disabled}
                value={props.loc('classify.edit.title')}
                onClick={evt => handleManualClassification(props)}/>
        </div>
    );
};

ManualClassification.propTypes = {
    disabled: PropTypes.bool,
    service: PropTypes.object,
    indicators: PropTypes.object,
    loc: PropTypes.func
};
const contextWrapped = withContext(ManualClassification);
export {contextWrapped as ManualClassification};
