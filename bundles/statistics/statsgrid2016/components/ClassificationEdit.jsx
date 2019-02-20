import React from 'react';

import ClassificationSelect from './ClassificationSelect';
import ClassificationSlider from './ClassificationSlider';
import ClassificationCheckbox from './ClassificationCheckbox';
import ClassificationColorSelect from './ClassificationColorSelect';
import ManualClassification from './manualClassification/ManualClassification';
import {withContext} from '../../../../src/reactUtil/genericContext';

const getSelectsProperties = ({classifications, loc, service, indicators}) =>
    // TODO remove visible-map-style classes and edit scss
    // select component's options could be array or object
    [
        {
            id: 'mapStyle',
            component: 'select',
            class: 'classification-map-style visible-map-style-choropleth visible-map-style-points visible-on-vector',
            label: loc('classify.map.mapStyle'),
            options: getLocalizedOptions(['choropleth', 'points'], loc('classify.map'))
        }, {
            id: 'method',
            component: 'select',
            class: 'classification-method visible-map-style-choropleth visible-map-style-points',
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
            class: 'classification-count visible-map-style-choropleth visible-map-style-points',
            label: loc('classify.classes'),
            options: getValidCountRange(classifications, service, indicators),
            valueType: 'int'
        }, {
            id: 'mode',
            component: 'select',
            class: 'classification-mode visible-map-style-choropleth visible-map-style-points',
            label: loc('classify.mode'),
            options: getLocalizedOptions(classifications.modes, loc('classify.modes'))
        }, {
            id: 'point-size',
            component: 'slider',
            class: 'point-size oskariui visible-map-style-points visible-on-vector',
            label: loc('classify.map.pointSize'),
            hideWith: ['choropleth']
        }, {
            id: 'showValues',
            component: 'checkbox',
            class: 'numeric-value visible-map-style-choropleth visible-map-style-points visible-on-vector',
            label: loc('classify.map.showValues')
        }, {
            id: 'name',
            component: 'color',
            class: 'classification-colors visible-map-style-choropleth visible-map-style-points'
        }, {
            id: 'transparency',
            component: 'select',
            class: 'point-transparency visible-map-style-points visible-on-vector',
            label: loc('classify.map.transparency'),
            options: getTransparencyOptions(classifications),
            valueType: 'int'
        }, {
            id: 'type',
            component: 'select',
            class: 'classification-color-set visible-map-style-choropleth',
            label: loc('colorset.setselection'),
            options: getLocalizedOptions(service.getColorService().getAvailableTypes(), loc('colorset')),
            hideWith: ['points']
        }, {
            id: 'fractionDigits',
            component: 'select',
            class: 'decimal-place visible-map-style-choropleth visible-map-style-points',
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

const getValidCountRange = (classifications, service, indicators) => {
    const validOptions = service.getClassificationService().getAvailableOptions(indicators.data);
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
    let className = 'classification';
    if (!props.isEdit) {
        className = 'classification oskari-hidden';
    }
    const disabled = !props.service.getStateService().isClassificationEnabled();
    // TODO remove accordion and modify scss
    const selectsProperties = getSelectsProperties(props);
    return (
        <div className={className}>
            <div className="accordion">
                <div className="accordion_panel open">
                    <div className="content">
                        <div className="classifications">
                            <div className="classification-options">
                                {selectsProperties.map(properties => getComponent(properties, disabled, props))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default withContext(ClassificationEdit);
