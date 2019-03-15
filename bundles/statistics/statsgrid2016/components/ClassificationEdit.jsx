import React from 'react';
import PropTypes from 'prop-types';
import {ClassificationSelect} from './ClassificationSelect';
import {ClassificationSlider} from './ClassificationSlider';
import {ClassificationCheckbox} from './ClassificationCheckbox';
import {ClassificationColorSelect} from './ClassificationColorSelect';
import {ManualClassification} from './manualClassification/ManualClassification';
import {withContext} from '../../../../src/reactUtil/genericContext';
import '../resources/scss/editclassification.scss';

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

const ClassificationEdit = props => {
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
                <ClassificationSelect key="mapStyle" value = {values.mapStyle} disabled = {disabled}
                    handleChange = {(properties, value) => handleSelectChange(service, properties, value)}
                    options = {getLocalizedOptions(mapStyles, loc('classify.map'))}
                    properties = {{
                        id: 'mapStyle',
                        class: 'classification-map-style',
                        label: loc('classify.map.mapStyle')
                    }}/>

                <ClassificationSelect key="method" value = {values.method} disabled = {disabled}
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

                <ClassificationSelect key="count" value = {values.count} disabled = {disabled}
                    handleChange = {(properties, value) => handleSelectChange(service, properties, value)}
                    options = {getValidCountRange(props.classifications)}
                    properties = {{
                        id: 'count',
                        class: 'classification-count',
                        label: loc('classify.classes'),
                        valueType: 'int'
                    }}/>

                <ClassificationSelect key="mode" value = {values.mode} disabled = {disabled}
                    handleChange = {(properties, value) => handleSelectChange(service, properties, value)}
                    options = {getLocalizedOptions(modes, loc('classify.modes'), disabledOptions.mode)}
                    properties = {{
                        id: 'mode',
                        class: 'classification-mode',
                        label: loc('classify.mode')
                    }}/>

                {values.mapStyle !== 'choropleth' &&
                    <ClassificationSlider key="point-size" values = {values} disabled = {disabled}/>
                }

                <ClassificationCheckbox key="showValues" value = {values.showValues} disabled = {disabled}
                    handleChange = {(id, isSelected) => handleCheckboxChange(service, id, isSelected)}
                    properties = {{
                        id: 'showValues',
                        class: 'show-values',
                        label: loc('classify.map.showValues')
                    }}/>

                <ClassificationColorSelect key="name" values = {values} disabled = {disabled} colors = {colors}/>

                <ClassificationSelect key="transparency" value = {values.transparency} disabled = {disabled}
                    handleChange = {(properties, value) => handleSelectChange(service, properties, value)}
                    options = {getTransparencyOptions(values.transparency)}
                    properties = {{
                        id: 'transparency',
                        class: 'classification-transparency',
                        label: loc('classify.map.transparency'),
                        valueType: 'int'
                    }}/>

                {values.mapStyle !== 'points' &&
                    <ClassificationSelect key="type" value = {values.type} disabled = {disabled}
                        handleChange = {(properties, value) => handleSelectChange(service, properties, value)}
                        options = {getLocalizedOptions(types, loc('colorset'))}
                        properties = {{
                            id: 'type',
                            class: 'classification-type',
                            label: loc('colorset.setselection')
                        }}/>
                }

                <ClassificationSelect key="fractionDigits" value = {values.fractionDigits} disabled = {disabled}
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
ClassificationEdit.propTypes = {
    indicators: PropTypes.object,
    state: PropTypes.object,
    classifications: PropTypes.object,
    isEdit: PropTypes.bool,
    service: PropTypes.object,
    loc: PropTypes.func
};

const contextWrapped = withContext(ClassificationEdit);
export {contextWrapped as ClassificationEdit};
