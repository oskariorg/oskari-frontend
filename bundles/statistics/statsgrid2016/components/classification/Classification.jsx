import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { EditClassification } from './editclassification/EditClassification';
import { Legend } from './Legend';
import { Header } from './Header';
import './classification.scss';

export const Classification = ({
    activeIndicator,
    indicators,
    editOptions,
    pluginState,
    classification,
    data,
    manualView,
    onRenderChange,
    controller
}) => {
    const [isEdit, setEdit] = useState(false);
    const { classification: values, hash } = activeIndicator;
    const { transparent, editEnabled } = pluginState;

    useEffect(() => {
        onRenderChange(isEdit);
    });

    const toggleEdit = () => setEdit(!isEdit);
    const getContentWrapperStyle = () => {
        const docHeight = document.documentElement.offsetHeight;
        return {
            maxHeight: docHeight - 50 + 'px', // header + border,
            overflowY: 'auto'
        };
    };
    let containerClass = 'statsgrid-classification-container';
    if (transparent) {
        containerClass += ' transparent-classification';
    }
    return (
        <div className={containerClass}>
            <Header
                selected = {hash}
                isEdit = {isEdit}
                toggleEdit = {toggleEdit}
                indicators = {indicators}
                controller = {controller}/>
            <div className="classification-content-wrapper" style={getContentWrapperStyle()}>
                {isEdit &&
                    <EditClassification
                        options = {editOptions}
                        values={values}
                        data={data}
                        editEnabled = {editEnabled}
                        controller = {controller}
                        manualView = {manualView}/>
                }
                <Legend classification = {classification} values = {values} />
            </div>
        </div>
    );
};

Classification.propTypes = {
    activeIndicator: PropTypes.object.isRequired,
    indicators: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired,
    editOptions: PropTypes.object.isRequired,
    pluginState: PropTypes.object.isRequired,
    classification: PropTypes.object.isRequired,
    manualView: PropTypes.object,
    seriesStats: PropTypes.object,
    onRenderChange: PropTypes.func.isRequired,
    controller: PropTypes.object.isRequired
};
