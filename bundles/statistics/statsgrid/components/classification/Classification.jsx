import React, { useState, useEffect } from 'react';
import { showMovableContainer } from 'oskari-ui/components/window';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { EditClassification } from './editclassification/EditClassification';
import { Legend } from './Legend';
import { Header } from './Header';
import { LocaleProvider } from 'oskari-ui/util';

const Container = styled.div`
    background-color: #FFFFFF;
    width: 300px;
    border: 1px solid rgba(0,0,0,0.2);
    pointer-events: auto;
    text-align: left;
    max-height: 100vh;
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
const ContentWrapper = styled.div`
    overflow-y: auto;
    max-height: 80vh;
`;
const LegendContainer = styled.div`
    margin-bottom: 6px;
    cursor: grab;
`;

export const Classification = ({
    activeIndicator,
    indicators = [],
    editOptions,
    classifiedDataset,
    startHistogramView,
    onRenderChange,
    controller,
    state
}) => {
    const [isEdit, setEdit] = useState(false);
    const { classification, hash } = activeIndicator;
    const { transparent, editEnabled } = state.pluginState;

    useEffect(() => {
        onRenderChange(isEdit);
    });

    const toggleEdit = () => setEdit(!isEdit);

    return (
        <Container className={transparent && !isEdit ? 'transparent-classification' : ''}>
            <Header
                selected = {hash}
                isEdit = {isEdit}
                toggleEdit = {toggleEdit}
                indicators = {indicators}
                onChange = {controller.setActiveIndicator}/>
            <ContentWrapper>
                {isEdit &&
                    <EditClassification
                        options = {editOptions}
                        values = {classification}
                        editEnabled = {editEnabled}
                        controller = {controller}
                        startHistogramView = {startHistogramView}/>
                }
                <LegendContainer className = "classification-legend">
                    <Legend
                        classifiedDataset = {classifiedDataset}
                        mapStyle = {classification.mapStyle}
                        transparency = {classification.transparency}
                    />
                </LegendContainer>
            </ContentWrapper>
        </Container>
    );
};

Classification.propTypes = {
    activeIndicator: PropTypes.object.isRequired,
    indicators: PropTypes.array.isRequired,
    editOptions: PropTypes.object.isRequired,
    pluginState: PropTypes.object.isRequired,
    classifiedDataset: PropTypes.object.isRequired,
    startHistogramView: PropTypes.func.isRequired,
    onRenderChange: PropTypes.func.isRequired,
    controller: PropTypes.object.isRequired
};

export const showClassificationContainer = (indicators, activeIndicator, state, controller, onClose, options) => {
    const Component = (
        <LocaleProvider value={{ bundleKey: 'StatsGrid' }}>
            <Classification
                {...state}
                activeIndicator={activeIndicator}
                indicators={indicators}
                state={state}
                controller={controller}
                startHistogramView={() => controller.showHistogramPopup()}
                onRenderChange={() => {/** ??? */}}
            />
        </LocaleProvider>
    );

    const controls = showMovableContainer(Component, onClose, options);
    return {
        ...controls,
        update: (indicators, activeIndicator, state) => {
            controls.update(
                <LocaleProvider value={{ bundleKey: 'StatsGrid' }}>
                    <Classification
                        {...state}
                        activeIndicator={activeIndicator}
                        indicators={indicators}
                        state={state}
                        controller={controller}
                        startHistogramView={() => controller.showHistogramPopup()}
                        onRenderChange={() => {/** ??? */}}
                    />
                </LocaleProvider>
            )
        }
    };
};
