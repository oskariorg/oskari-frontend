import React from 'react';
import PropTypes from 'prop-types';

export const Layer = ({model}) => {
    return (
        <div className="layer">
            <div className="custom-tools"></div>
            <input type="checkbox" disabled={model.isSticky()} />
            <div className="layer-tools">
                <div className="layer-not-supported icon-warning-light" title="" ></div>
                <div className="layer-backendstatus-icon backendstatus-unknown" title=""></div>
                <div className="layer-icon-secondary"></div>
                <div className={`layer-icon ${model.getIconClassname()}`}></div>
                <div className="layer-info"></div>
            </div>
            <div className="layer-title">
                {model.getName()}
            </div>
        </div>
    );
};

Layer.propTypes = {
    model: PropTypes.any
};
