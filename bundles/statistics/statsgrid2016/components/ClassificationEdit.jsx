import React from 'react';

import ClassificationSelect from './ClassificationSelect';
import ClassificationSlider from './ClassificationSlider';
import ClassificationCheckbox from './ClassificationCheckbox';
import ClassificationColorSelect from './ClassificationColorSelect';
import ManualClassification from './manualClassification/ManualClassification';
import {withContext} from '../../../../src/reactUtil/genericContext';
import '../resources/scss/editclassification.scss';

const getSelectsProperties = ({classifications, loc, service, indicators}) =>
    // select component's options could be array or object
    [
        {
            id: 'mapStyle',
            component: 'select',
            class: 'classification-map-style',
            label: loc('classify.map.mapStyle'),
            options: getLocalizedOptions(['choropleth', 'points'], loc('classify.map'))
        }, {
            id: 'method',
            component: 'select',
            class: 'classification-method',
            label: loc('classify.classifymethod'),
            options: getLocalizedOptions(classifications.methods, loc('classify.methods'))
        }, {
            id: 'modifyClassification',
            component: 'manual',
            class: 'classification-manual',
            label: loc('classify.edit.title')
        }, {
            id: 'count',
            component: 'select',
            class: 'classification-count',
            label: loc('classify.classes'),
            options: getValidCountRange(classifications, indicators),
            valueType: 'int'
        }, {
            id: 'mode',
            component: 'select',
            class: 'classification-mode',
            label: loc('classify.mode'),
            options: getLocalizedOptions(classifications.modes, loc('classify.modes'))
        }, {
            id: 'point-size',
            component: 'slider',
            class: 'point-size',
            label: loc('classify.map.pointSize'),
            hideWith: ['choropleth']
        }, {
            id: 'showValues',
            component: 'checkbox',
            class: 'show-values',
            label: loc('classify.map.showValues')
        }, {
            id: 'name',
            component: 'color',
            class: 'classification-colors',
            options: classifications.colors
        }, {
            id: 'transparency',
            component: 'select',
            class: 'classification-transparency',
            label: loc('classify.map.transparency'),
            options: getTransparencyOptions(classifications),
            valueType: 'int'
        }, {
            id: 'type',
            component: 'select',
            class: 'classification-type',
            label: loc('colorset.setselection'),
            options: getLocalizedOptions(classifications.types, loc('colorset')),
            hideWith: ['points']
        }, {
            id: 'fractionDigits',
            component: 'select',
            class: 'decimal-place',
            label: loc('classify.map.fractionDigits'),
            options: [0, 1, 2, 3, 4, 5],
            valueType: 'int'
        }
    ];
const getLocalizedOptions = (values, locObj) => {
    if (!Array.isArray(values)) {
        return [];
    }
    return values.map(value => {
        if (locObj[value]) {
            return {
                value: value,
                text: locObj[value]
            };
        }
        return value;
    });
};
const getTransparencyOptions = classifications => {
    const value = classifications.values.transparency;
    var loc = [];
    for (var i = 100; i >= 30; i -= 10) {
        loc.push({
            value: i,
            text: i + ' %'
        });
    }
    loc.push({
        value: value,
        text: value + ' %',
        hidden: true
    });
    return loc;
};

const getValidCountRange = (classifications, indicators) => {
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

const skipComponent = (selectProperties, values) => {
    // skip based on values
    if (selectProperties.id === 'modifyClassification' && values.method !== 'manual') {
        return true;
    }
    // skip component based on thematic map/layer style (e.g. points, choropleth)
    if (Array.isArray(selectProperties.hideWith)) {
        return selectProperties.hideWith.includes(values.mapStyle);
    }
    // show component if not skipped based on value or style.
    return false;
};

const modifyComponentProperties = (properties, values, indicators) => {
    // Discontinous mode causes trouble with manually set bounds. Causes error if some class gets no hits.
    // Disabling it for data series
    if (properties.id === 'mode' && indicators.active.series) {
        properties.options.find(option => option.value === 'discontinuous').disabled = true;
    }
};

const getComponent = (properties, disabled, {classifications, indicators}) => {
    const values = classifications.values;
    if (skipComponent(properties, values)) {
        return;
    }
    modifyComponentProperties(properties, values, indicators);
    const id = properties.id;
    const type = properties.component;
    const value = values[id];
    if (type === 'select') {
        return <ClassificationSelect key={id} properties = {properties}
            options = {properties.options} value = {value} disabled = {disabled}/>;
    } else if (type === 'slider') {
        return <ClassificationSlider key={id} properties = {properties}
            options = {properties.options} values = {values} disabled = {disabled}/>;
    } else if (type === 'checkbox') {
        return <ClassificationCheckbox key={id} properties = {properties}
            options = {properties.options} value = {value} disabled = {disabled} />;
    } else if (type === 'color') {
        return <ClassificationColorSelect key={id} properties = {properties}
            options = {properties.options} disabled = {disabled} values = {values}/>;
    } else if (type === 'manual') {
        return <ManualClassification key={id} properties = {properties}
            indicators={indicators} disabled = {disabled}/>;
    }
};

const ClassificationEdit = props => {
    let className = 'classification-edit';
    if (!props.isEdit) {
        className = 'classification-edit oskari-hidden';
    }
    const disabled = !props.service.getStateService().isClassificationEnabled();
    const selectsProperties = getSelectsProperties(props);
    return (
        <div className={className}>
            <div className="classification-options">
                {selectsProperties.map(properties => getComponent(properties, disabled, props))}
            </div>
        </div>
    );
};
export default withContext(ClassificationEdit);
