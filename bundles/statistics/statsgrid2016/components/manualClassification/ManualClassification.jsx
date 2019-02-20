import React from "react";
import ManualClassificationView from './View';
import {withContext} from '../../../../../src/reactUtil/genericContext';

const update = (stateService, bounds) => {
    stateService.updateActiveClassification('manualBounds', bounds);
};

const handleManualClassification = ({service, indicators, plugin}) => {
    const {series, state, classification, color} = service.getAllServices();
    const ind = indicators.active;
    const view = new ManualClassificationView(classification, color, ind.classification);

    if (ind.series && indicators.serieStats && indicators.serieStats.serie) {
        view.setData(indicators.serieStats.serie);
    } else if (indicators.data) {
        view.setData(indicators.data);
    } else {
        return; //failed to get serie or data -> don't open
    }
    series.setAnimating(false);
    view.openEditor(bounds => update(state, bounds));
};

const ManualClassification = props => {
    return (
        <div className={props.properties.class}>
            <input className="oskari-formcomponent oskari-button"
                type="button"
                disabled = {props.disabled}
                value={props.properties.label}
                onClick={evt => handleManualClassification(props)}/>
        </div>
    );
};

export default withContext(ManualClassification);
