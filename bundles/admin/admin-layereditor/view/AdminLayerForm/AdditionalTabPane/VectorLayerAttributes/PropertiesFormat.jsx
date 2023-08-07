import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Select, Collapse, CollapsePanel, Checkbox, TextInput, Switch } from 'oskari-ui';
import { IconButton } from 'oskari-ui/components/buttons';

const BUNDLE_NAME = 'admin-layereditor';

const StyledSwitch = styled(Switch)`
    margin-bottom: 24px;
`;

const StyledSelect = styled(Select)`
    min-width: 200px;
    margin-bottom: 10px;
    margin-left: 10px;
`;

const Options = styled.div`
    display: flex;
    flex-flow: row wrap;
`;

const TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'i', 'b', 'em'];
const FORMATTERS = ['link', 'image', 'number', 'phone'];
// eslint-disable-next-line no-unused-vars
const HIDDEN = 'hidden'; // TODO: support or notify to use filter?

const PARAM_OPTIONS = {
    image: ['link'],
    link: ['fullUrl', 'label'],
    phone: ['label']
};

const localize = key => Oskari.getMsg(BUNDLE_NAME, `attributes.format.type.${key}`);

const getTypeOptions = () => {
    const opts = [];
    opts.push({ label: localize('typeFormats'), options: FORMATTERS.map(f => ({label: localize(f), value: f}))});
    opts.push({ label: localize('textFormats'), options: TAGS.map(f => ({label: f, value: f}))});
    return opts;
};

const ParamOption = ({name, value, onChange}) => {
    if (name === 'label') {
        return (
            <TextInput value={value} allowClear
                placeholder={Oskari.getMsg(BUNDLE_NAME, `attributes.format.params.${name}`)}
                onChange={evt => onChange(name, evt.target.value)}/>
        );
    }
    return (
        <Checkbox checked={value} onChange={evt => onChange(name, evt.target.checked)}>
            <Message messageKey={`attributes.format.params.${name}`}/>
        </Checkbox>
    );
};

const PanelExtra = ({ noValues, onRemove}) => {
    if(noValues) {
        return null;
    }

    return (
        <div onClick={e => e.stopPropagation()}>
            <IconButton type='delete' onClick={onRemove}/>
        </div>
    );
};

const CollapseContent = ({values = {}, onChange }) => {
    const { type, noLabel, skipEmpty, params = {} } = values;

    const onParamChange = (key, value) => {
        const updated = { ...params, [key]: value };
        onChange('params', updated);
    };

    const paramOptions = PARAM_OPTIONS[values.type] || [];
    return (
        <Fragment>
            <Message messageKey='attributes.format.type.label' />
            <StyledSelect allowClear
                value={type}
                onChange={value => onChange('type', value)}
                options={getTypeOptions()}/>
            <Options>
                <Checkbox checked={noLabel} onChange={evt => onChange('noLabel', evt.target.checked)}>
                    <Message messageKey='attributes.format.options.noLabel' />
                </Checkbox>
                <Checkbox checked={skipEmpty} onChange={evt => onChange('skipEmpty', evt.target.checked)}>
                    <Message messageKey='attributes.format.options.skipEmpty' />
                </Checkbox>
                { paramOptions.map(name => <ParamOption key={name} name={name} value={params[name]} onChange={onParamChange} />) }
            </Options>
        </Fragment>
    );
};

export const PropertiesFormat = ({ format = {}, properties, selected, labels, update }) => {
    const allSelected = selected.length === 0 || properties.length === selected.length;
    const [showAll, setShowAll] = useState(allSelected);
    const propNames = showAll ? properties : selected;

    const onChange = (name, key, value) => {
        const values = format[name] || {};
        const updated = { ...values, [key]:  value };
        update({...format, [name]: updated });
    };

    const onRemove = (name) => {
        const updated = { ...format };
        delete updated[name];
        update(updated);
    };

    return (
        <Fragment>
            { !allSelected &&
                <StyledSwitch checked={showAll} onChange={setShowAll} label={<Message messageKey='attributes.showAll'/>}/>
            }
            <Collapse>
                { propNames.map(name => {
                    return (
                        <CollapsePanel key={name}
                            header={labels[name] ? `${name} (${labels[name]})` : name}
                            extra={<PanelExtra onRemove={() => onRemove(name)} noValues={!format[name]}/>}>
                            <CollapseContent key={name} values={format[name]} onChange={(key, value) => onChange(name, key, value)} />
                        </CollapsePanel>
                    )})
                }
            </Collapse>
        </Fragment>
    );
};

PropertiesFormat.propTypes = {
    format: PropTypes.object,
    update: PropTypes.func.isRequired,
    properties: PropTypes.array.isRequired,
    labels: PropTypes.object.isRequired,
    selected: PropTypes.array.isRequired
};
