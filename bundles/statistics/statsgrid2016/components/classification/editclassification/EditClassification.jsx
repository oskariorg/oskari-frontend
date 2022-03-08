import React from 'react';
import PropTypes from 'prop-types';
import { Select } from './Select';
import { SizeSlider } from './SizeSlider';
import { Checkbox } from './Checkbox';
import { Color } from './Color';
import { ManualClassification } from '../../manualClassification/ManualClassification';
import './editclassification.scss';

// Slider ?
const getTransparencyOptions = transparency => {
    var options = [];
    for (var i = 100; i >= 30; i -= 10) {
        options.push({
            value: i,
            text: i + ' %'
        });
    }
    options.push({
        value: transparency,
        text: transparency + ' %',
        hidden: true
    });
    return options;
};

export const EditClassification = ({
    options,
    controller,
    editEnabled,
    manualView,
    seriesStats,
    data,
    values
}) => {
    const handleChange = (id, value) => controller.updateClassification(id, value);
    const handleNumberChange = (id, value) => handleChange(id, parseInt(value));

    const disabled = !editEnabled;

    return (
        <div className="classification-edit">
            <div className="classification-options">
                <Select name ='mapStyle'
                    value = {values.mapStyle}
                    disabled = {disabled}
                    handleChange = {handleChange}
                    options = {options.mapStyles}
                />

                <Select name= 'method'
                    value = {values.method}
                    disabled = {disabled}
                    handleChange = {handleChange}
                    options = {options.methods}
                />

                { manualView &&
                    <ManualClassification
                        manualView = {manualView}
                        seriesStats = {seriesStats}
                        data = {data}
                        disabled = {disabled}
                        controller= {controller}
                    />
                }
                <Select name= 'count'
                    value = {values.count}
                    disabled = {disabled}
                    handleChange = {handleNumberChange}
                    options = {options.counts}
                />

                <Select name= 'mode'
                    value = {values.mode}
                    disabled = {disabled}
                    handleChange = {handleChange}
                    options = {options.modes}
                />

                {values.mapStyle === 'points' &&
                    <SizeSlider values={values} controller={controller} disabled={disabled} />
                }

                <Checkbox name="showValues"
                    value = {values.showValues}
                    disabled = {disabled}
                    handleChange = {handleChange}
                />

                <Color values = {values} disabled = {disabled} colorsets = {options.colorsets} controller = {controller}/>

                <Select name="transparency"
                    value = {values.transparency}
                    disabled = {disabled}
                    handleChange = {handleNumberChange}
                    options = {getTransparencyOptions(values.transparency)}
                />

                <Select name="type"
                    value = {values.type}
                    disabled = {disabled}
                    handleChange = {handleChange}
                    options = {options.types}
                />

                <Select name="fractionDigits"
                    value = {values.fractionDigits}
                    disabled = {disabled}
                    handleChange = {handleNumberChange}
                    options = {[0, 1, 2, 3, 4, 5]}
                />
            </div>
        </div>
    );
};
EditClassification.propTypes = {
    options: PropTypes.object.isRequired,
    editEnabled: PropTypes.bool.isRequired,
    values: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired,
    seriesStats: PropTypes.object,
    manualView: PropTypes.object
};
