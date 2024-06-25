import React, { useState } from 'react';
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
    showHistogram,
    controller,
    state,
    pluginState
}) => {
    const [isEdit, setEdit] = useState(false);
    const { layer, classification: { transparent, editEnabled } } = pluginState;
    const { activeIndicator, indicators } = state;
    const current = indicators.find(ind => ind.hash === activeIndicator);
    if (!current) {
        return null;
    }
    const { classification, classifiedData, data } = current;

    const toggleEdit = () => setEdit(!isEdit);

    return (
        <Container className={transparent && !isEdit ? 'transparent-classification' : ''}>
            <Header
                selected = {current}
                isEdit = {isEdit}
                toggleEdit = {toggleEdit}
                indicators = {indicators}
                onChange = {controller.setActiveIndicator}/>
            <ContentWrapper>
                {isEdit &&
                    <EditClassification
                        data = {data}
                        values = {classification}
                        editEnabled = {editEnabled}
                        controller = {controller}
                        showHistogram = {showHistogram}/>
                }
                <LegendContainer className = "classification-legend">
                    <Legend
                        classifiedData = {classifiedData}
                        mapStyle = {classification.mapStyle}
                        transparency = {classification.transparency} />
                </LegendContainer>
            </ContentWrapper>
        </Container>
    );
};

Classification.propTypes = {
    state: PropTypes.object.isRequired,
    pluginState: PropTypes.object.isRequired,
    showHistogram: PropTypes.func.isRequired,
    controller: PropTypes.object.isRequired
};

export const showClassificationContainer = (state, viewState, controller, options, showHistogram, onClose) => {
    const Component = (
        <LocaleProvider value={{ bundleKey: 'StatsGrid' }}>
            <Classification
                pluginState={viewState}
                state={state}
                controller={controller}
                showHistogram={showHistogram}
            />
        </LocaleProvider>
    );

    const controls = showMovableContainer(Component, onClose, options);
    return {
        ...controls,
        update: (state, viewState) => {
            controls.update(
                <LocaleProvider value={{ bundleKey: 'StatsGrid' }}>
                    <Classification
                        pluginState={viewState}
                        state={state}
                        controller={controller}
                        showHistogram={showHistogram}
                    />
                </LocaleProvider>
            );
        }
    };
};
