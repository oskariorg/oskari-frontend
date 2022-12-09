import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Slider, Message } from 'oskari-ui';
import styled from 'styled-components';

// Overrride -50% translateX
const SLIDER_PROPS = {
    min: 10,
    max: 120,
    step: 5,
    range: true,
    tipFormatter: val => `${val}px`,
    marks: {
        10: {
            style: { transform: 'translateX(-20%)' },
            label: <Message messageKey="classify.pointSizes.min"/>
        },
        120: {
            style: { transform: 'translateX(-80%)' },
            label: <Message messageKey="classify.pointSizes.max"/>
        }
    }
};

const StyledSlider = styled(Slider)`
    .ant-slider-track {
        background-color: #0091ff;
    }
    .ant-slider-handle {
        border: #0091ff solid 2px;
        margin-top: -6px;
    }
    &:hover .ant-slider-track {
        background-color: #003fc3 !important;
    }
    &:hover .ant-slider-handle {
        border: #003fc3 solid 2px !important;
    }
    .ant-slider-dot {
        width: 6px;
        height: 6px;
        left: 1px;
    }
`;

export const SizeSlider = ({
    values,
    controller,
    disabled
}) => {
    const { count, min, max } = values;
    const [range, setRange] = useState([min, max]);
    const minRange = count * SLIDER_PROPS.step;
    const onChange = (range) => {
        if (range[1] - range[0] < minRange) {
            return;
        }
        setRange(range);
    };
    const onAfterChange = () => {
        controller.updateClassificationObj({ min: range[0], max: range[1] });
    };
    return (
        <div>
            <Message messageKey="classify.labels.pointSize"/>
            <StyledSlider
                value = {range}
                disabled = {disabled}
                onChange={onChange}
                onAfterChange={onAfterChange}
                {...SLIDER_PROPS}
            />
        </div>
    );
};

SizeSlider.propTypes = {
    values: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired,
    disabled: PropTypes.bool.isRequired
};
