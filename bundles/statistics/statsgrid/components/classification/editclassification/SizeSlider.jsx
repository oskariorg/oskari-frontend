import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Slider, Message } from 'oskari-ui';

// Overrride -50% translateX
const SLIDER_PROPS = {
    min: 10,
    max: 120,
    step: 5,
    range: true,
    tooltip: {
        formatter: val => `${val}px`
    },
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

export const SizeSlider = ({
    values,
    controller,
    disabled
}) => {
    const { count, min, max } = values;
    const [internalRange, setRange] = useState([min, max]);
    const minRange = count * SLIDER_PROPS.step;
    const onChange = (range) => {
        if (range[1] - range[0] < minRange) {
            return;
        }
        setRange(range);
    };
    const onAfterChange = (range) => {
        controller.updateClassification({ min: range[0], max: range[1] });
    };
    return (
        <div>
            <Message messageKey="classify.labels.pointSize"/>
            <Slider
                value = {internalRange}
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
