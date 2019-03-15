import React from 'react';
import PropTypes from 'prop-types';
import {withContext} from '../../../../../../src/react/util.jsx';
import {Select} from './Select';
import {Slider} from './Slider';
import {Checkbox} from './Checkbox';
import {Color} from './Color';
import {ManualClassification} from '../../manualClassification/ManualClassification';
import './editclassification.scss';

const getLocalizedOptions = (options, locObj, disabledOptions) => {
    if (!Array.isArray(options)) {
        return [];
    }
    return options.map(option => {
        const obj = {
            value: option
        };
        if (locObj[option]) {
            obj.text = locObj[option];
        }
        if (Array.isArray(disabledOptions) && disabledOptions.includes(option)) {
            obj.disabled = true;
        }
        return obj;
    });
};
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

const getValidCountRange = classifications => {
    const validOptions = classifications.validOptions;
    const range = classifications.countRange;
    if (validOptions && validOptions.maxCount) {
        return range.map(count => {
            let disabled = false;
            if (count > validOptions.maxCount) {
                disabled = true;
            }
            return {
                value: count,
                disabled: disabled
            };
        });
    }
    return range;
};
const getDisabledOptions = props => {
    const disabled = {};
    // Discontinous mode causes trouble with manually set bounds. Causes error if some class gets no hits.
    // Disabling it for data series
    if (props.indicators.active.series) {
        disabled.mode = ['discontinuous'];
    }
    return disabled;
};

const handleSelectChange = (service, properties, value) => {
    if (properties.valueType === 'int') {
        value = parseInt(value);
    }
    service.getStateService().updateActiveClassification(properties.id, value);
};

const handleCheckboxChange = (service, id, isSelected) => {
    service.getStateService().updateActiveClassification(id, isSelected);
};

const EditClassification = props => {
    const {indicators, service, loc, isEdit} = props;
    let className = 'classification-edit';
    if (!isEdit) {
        className = 'classification-edit oskari-hidden';
    }
    const {methods, values, disabled, modes, colors, types, mapStyles} = props.classifications;
    const disabledOptions = getDisabledOptions(props);

    return (
        <div className={className}>
            <div className="classification-options">
                <Select key="mapStyle" value = {values.mapStyle} disabled = {disabled}
                    handleChange = {(properties, value) => handleSelectChange(service, properties, value)}
                    options = {getLocalizedOptions(mapStyles, loc('classify.map'))}
                    properties = {{
                        id: 'mapStyle',
                        class: 'classification-map-style',
                        label: loc('classify.map.mapStyle')
                    }}/>

                <Select key="method" value = {values.method} disabled = {disabled}
                    handleChange = {(properties, value) => handleSelectChange(service, properties, value)}
                    options = {getLocalizedOptions(methods, loc('classify.methods'))}
                    properties = {{
                        id: 'method',
                        class: 'classification-method',
                        label: loc('classify.classifymethod')
                    }}/>

                {values.method === 'manual' &&
                    <ManualClassification key="modifyClassification" disabled = {disabled} indicators={indicators}/>
                }

                <Select key="count" value = {values.count} disabled = {disabled}
                    handleChange = {(properties, value) => handleSelectChange(service, properties, value)}
                    options = {getValidCountRange(props.classifications)}
                    properties = {{
                        id: 'count',
                        class: 'classification-count',
                        label: loc('classify.classes'),
                        valueType: 'int'
                    }}/>

                <Select key="mode" value = {values.mode} disabled = {disabled}
                    handleChange = {(properties, value) => handleSelectChange(service, properties, value)}
                    options = {getLocalizedOptions(modes, loc('classify.modes'), disabledOptions.mode)}
                    properties = {{
                        id: 'mode',
                        class: 'classification-mode',
                        label: loc('classify.mode')
                    }}/>

                {values.mapStyle !== 'choropleth' &&
                    <Slider key="point-size" values = {values} disabled = {disabled}/>
                }

                <Checkbox key="showValues" value = {values.showValues} disabled = {disabled}
                    handleChange = {(id, isSelected) => handleCheckboxChange(service, id, isSelected)}
                    properties = {{
                        id: 'showValues',
                        class: 'show-values',
                        label: loc('classify.map.showValues')
                    }}/>

                <Color key="name" values = {values} disabled = {disabled} colors = {colors}/>

                <Select key="transparency" value = {values.transparency} disabled = {disabled}
                    handleChange = {(properties, value) => handleSelectChange(service, properties, value)}
                    options = {getTransparencyOptions(values.transparency)}
                    properties = {{
                        id: 'transparency',
                        class: 'classification-transparency',
                        label: loc('classify.map.transparency'),
                        valueType: 'int'
                    }}/>

                {values.mapStyle !== 'points' &&
                    <Select key="type" value = {values.type} disabled = {disabled}
                        handleChange = {(properties, value) => handleSelectChange(service, properties, value)}
                        options = {getLocalizedOptions(types, loc('colorset'))}
                        properties = {{
                            id: 'type',
                            class: 'classification-type',
                            label: loc('colorset.setselection')
                        }}/>
                }

                <Select key="fractionDigits" value = {values.fractionDigits} disabled = {disabled}
                    handleChange = {(properties, value) => handleSelectChange(service, properties, value)}
                    options = {[0, 1, 2, 3, 4, 5]}
                    properties = {{
                        id: 'fractionDigits',
                        class: 'decimal-place',
                        label: loc('classify.map.fractionDigits'),
                        valueType: 'int'
                    }}/>
            </div>
        </div>
    );
};
EditClassification.propTypes = {
    indicators: PropTypes.object,
    state: PropTypes.object,
    classifications: PropTypes.object,
    isEdit: PropTypes.bool,
    service: PropTypes.object,
    loc: PropTypes.func
};

const contextWrapped = withContext(EditClassification);
export {contextWrapped as EditClassification};
