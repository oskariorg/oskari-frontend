import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LabeledSelect } from './LabeledSelect';
import { SizeSlider } from './SizeSlider';
import { Color } from './Color';
import { Checkbox, Message, Slider } from 'oskari-ui';
import { EditTwoTone, DownOutlined } from '@ant-design/icons';

// remove mark dots (.ant-slider-dot)
const Container = styled.div`
    background-color: #fafafa;
    padding: 6px 12px;
    .ant-slider-dot {
        display: none;
    }
`;

// Overrride -50% translateX
const TRANSPARENCY = {
    min: 0,
    max: 100,
    step: 10,
    tipFormatter: val => `${val}%`,
    marks: {
        0: {
            style: { transform: 'translateX(-20%)' },
            label: '0%'
        },
        100: {
            style: { transform: 'translateX(-80%)' },
            label: '100%'
        }
    }
};

export const EditClassification = ({
    options,
    controller,
    editEnabled,
    handleManualView,
    values
}) => {
    const handleChange = (id, value) => controller.updateClassification(id, value);
    const handleMethodChange = (id, value) => {
        if (value === 'manual') {
            handleManualView();
        }
        handleChange(id, value);
    };
    const disabled = !editEnabled;
    const methodSuffix = values.method === 'manual' ? <EditTwoTone onClick={() => handleManualView()}/> : <DownOutlined />;
    return (
        <Container className="t_classification-edit">
            <LabeledSelect
                name = 'mapStyle'
                value = {values.mapStyle}
                disabled = {disabled}
                handleChange = {handleChange}
                options = {options.mapStyles}
            />
            <LabeledSelect
                name = 'method'
                value = {values.method}
                disabled = {disabled}
                handleChange = {handleMethodChange}
                options = {options.methods}
                suffixIcon ={methodSuffix}
            />
            <LabeledSelect
                name = 'count'
                value = {values.count}
                disabled = {disabled}
                handleChange = {handleChange}
                options = {options.counts}
            />
            <LabeledSelect
                name = 'mode'
                value = {values.mode}
                disabled = {disabled}
                handleChange = {handleChange}
                options = {options.modes}
            />

            {values.mapStyle === 'points' &&
                <SizeSlider values={values} controller={controller} disabled={disabled} />
            }

            <Checkbox
                checked = {values.showValues}
                disabled = {disabled}
                onChange = {e => handleChange('showValues', e.target.checked)}
            >
                <Message messageKey='classify.labels.showValues'/>
            </Checkbox>

            <Color values = {values} disabled = {disabled} colorsets = {options.colorsets} controller = {controller}/>

            <Message messageKey='classify.labels.transparency'/>
            <Slider
                value = {values.transparency}
                disabled = {disabled}
                onChange = {value => handleChange('transparency', value)}
                { ...TRANSPARENCY }
            />
            <LabeledSelect
                name = 'type'
                value = {values.type}
                disabled = {disabled}
                handleChange = {handleChange}
                options = {options.types}
            />
            <LabeledSelect
                name = 'fractionDigits'
                value = {values.fractionDigits}
                disabled = {disabled}
                handleChange = {handleChange}
                options = {options.fractionDigits}
            />
        </Container>
    );
};
EditClassification.propTypes = {
    options: PropTypes.object.isRequired,
    editEnabled: PropTypes.bool.isRequired,
    values: PropTypes.object.isRequired,
    handleManualView: PropTypes.func.isRequired,
    controller: PropTypes.object.isRequired
};
