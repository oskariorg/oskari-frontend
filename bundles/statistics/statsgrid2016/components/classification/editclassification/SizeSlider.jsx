import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Slider, Message } from 'oskari-ui';

const SLIDER_PROPS = {
    min: 10,
    max: 120,
    step: 5,
    range: true,
    tooltipVisible: false
};

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
        <div className="classification-pointSize option">
            <div className="select-label">
                <Message messageKey="classify.labels.pointSize"/>
            </div>
            <Slider
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
