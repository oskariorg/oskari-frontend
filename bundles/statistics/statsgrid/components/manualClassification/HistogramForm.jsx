import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { showPopup } from 'oskari-ui/components/window';
import { Message, Select, Option } from 'oskari-ui';
import { PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { manualClassificationEditor } from './editor';
import { getEditOptions } from '../../helper/ClassificationHelper';
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
    const ref = useRef();
    const [activeBound, setActiveBound] = useState();
    const { activeIndicator, indicators } = state;
    const { classification: { editEnabled } } = pluginState;
    useEffect(() => {
        // editor appends content to ref element, clear content
        ref.current.innerHTML = '';
        if (error) {
            return;
        }
        manualClassificationEditor(ref.current, bounds, dataAsList, colors, activeBound, fractionDigits, base, onBoundChange, !editEnabled);
    }, [editEnabled]);
    const { classifiedData, classification, data} = indicators.find(ind => ind.hash === activeIndicator) || {};
    if (!classifiedData || !classification || !data) {
        // TODO: something common like InactiveLegend error: 'noData'
        return null;
    }
    const { method, fractionDigits, base } = classification;
    const { groups = [], bounds, error } = classifiedData;
    // TODO: getMethdodOptions(data.uniqueCount);
    const { methods } = getEditOptions(classification, data);

    const colors = groups.map(group => group.color);
    const dataAsList = data.seriesValues ? data.seriesValues : data.dataByRegions.map(d => d.value);
    const onMethodChange = method => controller.updateClassification({ method });
    const onBoundChange = (manualBounds, index) => {
        if (index !== activeBound) {
            setActiveBound(index);
        }
        if (bounds[index] === manualBounds[index]) {
            // nothing to update
            return;
        }
        const updated = { manualBounds };
        if (method !== 'manual') {
            updated.method = 'manual';
        }
        controller.updateClassification(updated);
    };
    return (
        <Content>
            <label><b><Message messageKey={'classify.labels.method' } bundleKey={BUNDLE_KEY} /></b></label>
            <StyledSelect
                className='t_option-method'
                value = {method}
                disabled={!editEnabled}
                onChange={value => onMethodChange(value)}>
                {methods.map(({ label, ...rest }, i) => (
                    <Option key={`option-${i}`} {...rest}>
                        {label}
                    </Option>
                ))}
            </StyledSelect>
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
