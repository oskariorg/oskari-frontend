import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { showPopup } from 'oskari-ui/components/window';
import { Message, Select, Option } from 'oskari-ui';
import { PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { manualClassificationEditor } from './editor';
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
    classifiedDataset,
    data,
    editOptions,
    onClose
}) => {
    const ref = useRef();
    const [activeBound, setActiveBound] = useState();
    const { editEnabled } = state?.pluginState;
    useEffect(() => {
        // editor appends content to ref element, clear content
        ref.current.innerHTML = '';
        if (error) {
            return;
        }
        manualClassificationEditor(ref.current, bounds, dataAsList, colors, activeBound, fractionDigits, base, onBoundChange, !editEnabled);
    }, [editEnabled]);
    const { activeIndicator: { classification }, seriesStats, controller } = state;
    const { method, fractionDigits, base } = classification;
    const { methods } = editOptions;
    const { groups = [], bounds, error } = classifiedDataset;

    const colors = groups.map(group => group.color);
    const dataAsList = Object.values(seriesStats ? seriesStats.serie : data);
    const onMethodChange = method => controller.updateClassification('method', method);
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
        controller.updateClassificationObj(updated);
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
    classifiedDataset: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    editOptions: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired
};

const getMessage = path => <Message messageKey={ `classify.edit.${path}` } bundleKey={BUNDLE_KEY} />;

const getContent = (state, classifiedDataset, data, editOptions, onClose) => (
    <Form
        state = { state }
        onClose={ onClose }
        classifiedDataset = { classifiedDataset }
        data = { data }
        editOptions = { editOptions }
    />
);

export const showHistogramPopup = (state, classifiedDataset, data, editOptions, onClose) => {
    const controls = showPopup(
        getMessage('title'),
        getContent(state, classifiedDataset, data, editOptions, onClose),
        onClose,
        { id: 'statsgrid-histogram' }
    );
    return {
        ...controls,
        update: (state, classifiedDataset, data, editOptions) =>
            controls.update(getMessage('title'), getContent(state, classifiedDataset, data, editOptions, onClose))
    };
};
