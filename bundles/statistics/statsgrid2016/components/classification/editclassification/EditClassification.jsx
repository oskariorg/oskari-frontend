import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LabeledSelect } from './LabeledSelect';
import { SizeSlider } from './SizeSlider';
import { Color } from './Color';
import { Checkbox, Message, Slider } from 'oskari-ui';
import { EditTwoTone } from '@ant-design/icons';

// remove mark dots (.ant-slider-dot)
const Container = styled.div`
    background-color: #fafafa;
    padding: 6px 12px;
    .ant-slider-dot {
        display: none;
    }
`;

const MethodContainer = styled.div`
    padding-top: 5px;
    padding-bottom: 10px;
`;
const EditIcon = styled(EditTwoTone)`
    float: right;
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
    startHistogramView,
    values
}) => {
    const handleChange = (id, value) => controller.updateClassification(id, value);
    const disabled = !editEnabled;
    return (
        <Container className="t_classification-edit">
            <LabeledSelect
                name = 'mapStyle'
                value = {values.mapStyle}
                disabled = {disabled}
                handleChange = {handleChange}
                options = {options.mapStyles}
            />
            <MethodContainer>
                <Message messageKey={`classify.labels.method`}/>
                <span>: &nbsp;</span>
                <Message messageKey={`classify.methods.${values.method}`}/>
                <EditIcon disabled = {disabled} className='t_button-method' onClick={() => startHistogramView()}/>
            </MethodContainer>
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
    startHistogramView: PropTypes.func.isRequired,
    controller: PropTypes.object.isRequired
};
