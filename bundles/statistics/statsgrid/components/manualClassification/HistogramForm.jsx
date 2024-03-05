import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { showPopup } from 'oskari-ui/components/window';
import { Message, Select } from 'oskari-ui';
import { PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { manualClassificationEditor } from './editor';
import { getMethodOptions } from '../../helper/ClassificationHelper';
import '../../../statsgrid2016/resources/scss/manualClassification.scss';

const BUNDLE_KEY = 'StatsGrid';

const Content = styled.div`
    padding: 24px;
`;
const StyledSelect = styled(Select)`
    margin-left: 10px;
    min-width: 150px;
    margin-bottom: 10px;
`;

const Form = ({
    state,
    pluginState,
    controller,
    onClose
}) => {
    const { activeIndicator, indicators } = state;
    const indicator = indicators.find(ind => ind.hash === activeIndicator);
    if (!indicator) {
        return (
            <Content>
                <Message bundleKey={BUNDLE_KEY} messageKey='legend.noActive'/>
            </Content>
        );
    }
    const ref = useRef();
    const [activeBound, setActiveBound] = useState();
    const disabled = !pluginState.classification.editEnabled;
    const error = indicator.classifiedData?.error;

    useEffect(() => {
        // editor appends content to ref element, clear content
        ref.current.innerHTML = '';
        if (!indicator || error) {
            return;
        }
        manualClassificationEditor(ref.current, indicator, activeBound, disabled, onBoundChange);
    }, [indicator, activeBound, disabled]);

    const onBoundChange = (manualBounds, index) => {
        const { bounds = [] } = indicator.classifiedData;
        if (index !== activeBound) {
            setActiveBound(index);
        }
        if (bounds[index] === manualBounds[index]) {
            // nothing to update
            return;
        }
        const updated = { manualBounds };
        if (indicator.classification.method !== 'manual') {
            updated.method = 'manual';
        }
        controller.updateClassification(updated);
    };

    return (
        <Content>
            <label><b><Message messageKey={'classify.labels.method' } bundleKey={BUNDLE_KEY} /></b></label>
            <StyledSelect
                className='t_option-method'
                value={indicator.classification.method}
                disabled={disabled}
                onChange={method => controller.updateClassification({ method })}
                options={getMethodOptions(indicator)}/>
            <div ref={ref} className="manual-class-view"/>
            {error && <Message messageKey={'legend.noEnough' } bundleKey={BUNDLE_KEY} />}
            <ButtonContainer>
                <PrimaryButton type='close' onClick={onClose}/>
            </ButtonContainer>
        </Content>
    );
};

Form.propTypes = {
    state: PropTypes.object.isRequired,
    pluginState: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired
};

export const showHistogramPopup = (state, viewState, controller, onClose) => {
    const controls = showPopup(
        <Message messageKey='classify.edit.title' bundleKey={BUNDLE_KEY} />,
        <Form state={state} pluginState={viewState} controller={controller} onClose={onClose} />,
        onClose,
        { id: 'statsgrid-histogram' }
    );
    return {
        ...controls,
        update: (state, viewState) =>
            controls.update(
                <Message messageKey='classify.edit.title' bundleKey={BUNDLE_KEY} />,
                <Form state={state} pluginState={viewState} controller={controller} onClose={onClose} />
            )
    };
};
