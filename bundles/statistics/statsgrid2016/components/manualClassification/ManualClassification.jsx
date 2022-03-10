import React from 'react';
import PropTypes from 'prop-types';
// TODO: change to use general oskari react button and pass props.handleClick = handleManualClassification

const handleManualClassification = ({ seriesStats, controller, manualView, data }) => {
    const view = manualView.view;
    if (seriesStats && seriesStats.serie) {
        view.setData(seriesStats.serie);
    } else if (data) {
        view.setData(data);
    } else {
        // failed to get serie or data -> don't open
    }
    manualView.setAnimating(false);
    view.openEditor(bounds => controller.updateClassification('manualBounds', bounds));
};
// TODO: use Button and Message from oskari-ui and remove btnLabel
export const ManualClassification = (props) => {
    return (
        <div className="classification-manual">
            <input className="oskari-formcomponent oskari-button"
                type="button"
                disabled = {props.disabled}
                value={props.manualView.btnLabel}
                onClick={() => handleManualClassification(props)}/>
        </div>
    );
};

ManualClassification.propTypes = {
    disabled: PropTypes.bool.isRequired,
    controller: PropTypes.object.isRequired,
    seriesStats: PropTypes.object,
    manualView: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired
};
