import React from 'react';
import PropTypes from 'prop-types';
import { withContext } from 'oskari-ui/util';
// TODO: change to use general oskari react button and pass props.handleClick = handleManualClassification

const handleManualClassification = ({ indicators, mutator, manualView, indicatorData }) => {
    const view = manualView.view;
    if (indicators.active.series && indicators.serieStats && indicators.serieStats.serie) {
        view.setData(indicators.serieStats.serie);
    } else if (indicatorData.data) {
        view.setData(indicatorData.data);
    } else {
        // failed to get serie or data -> don't open
    }
    manualView.setAnimating(false);
    view.openEditor(bounds => mutator.updateClassification('manualBounds', bounds));
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
    disabled: PropTypes.bool.isRequired,
    mutator: PropTypes.object.isRequired,
    indicators: PropTypes.object.isRequired,
    manualView: PropTypes.object.isRequired,
    indicatorData: PropTypes.object.isRequired,
    loc: PropTypes.func.isRequired
};
const contextWrapped = withContext(ManualClassification);
export { contextWrapped as ManualClassification };
