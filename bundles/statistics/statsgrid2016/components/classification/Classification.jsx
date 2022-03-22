import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { EditClassification } from './editclassification/EditClassification';
import { Legend } from './Legend';
import { Header } from './Header';

const Container = styled.div`
    background-color: #FFFFFF;
    width: 300px;
    border: 1px solid rgba(0,0,0,0.2);
    pointer-events: auto;
    text-align: left;

    &.transparent-classification {
        background-color: transparent;
        border: 1px solid transparent;
        .classification-header {
            border: 1px solid black;
            border-radius: 2px;
            background-color: #FFFFFF;
            padding: 0px;
        }
        .classification-legend span {
            color: #FFFFFF;
            text-shadow:
                -1px -1px 0 #000,
                1px -1px 0 #000,
                -1px 1px 0 #000,
                1px 1px 0 #000;
        }
    }
`;

const LegendContainer = styled.div`
    margin-bottom: 6px;
    cursor: grab;
`;

export const Classification = ({
    activeIndicator,
    indicators,
    editOptions,
    pluginState,
    classifiedDataset,
    handleManualView,
    onRenderChange,
    controller
}) => {
    const [isEdit, setEdit] = useState(false);
    const { classification, hash } = activeIndicator;
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

    return (
        <Container className={transparent && !isEdit ? 'transparent-classification' : ''}>
            <Header
                selected = {hash}
                isEdit = {isEdit}
                toggleEdit = {toggleEdit}
                indicators = {indicators}
                onChange = {controller.setActiveIndicator}/>
            <div style={getContentWrapperStyle()}>
                {isEdit &&
                    <EditClassification
                        options = {editOptions}
                        values = {classification}
                        editEnabled = {editEnabled}
                        controller = {controller}
                        handleManualView = {handleManualView}/>
                }
                <LegendContainer className = "classification-legend">
                    <Legend
                        classifiedDataset = {classifiedDataset}
                        mapStyle = {classification.mapStyle}
                        transparency = {classification.transparency}
                    />
                </LegendContainer>
            </div>
        </Container>
    );
};

Classification.propTypes = {
    activeIndicator: PropTypes.object.isRequired,
    indicators: PropTypes.array.isRequired,
    editOptions: PropTypes.object.isRequired,
    pluginState: PropTypes.object.isRequired,
    classifiedDataset: PropTypes.object.isRequired,
    handleManualView: PropTypes.func.isRequired,
    onRenderChange: PropTypes.func.isRequired,
    controller: PropTypes.object.isRequired
};
