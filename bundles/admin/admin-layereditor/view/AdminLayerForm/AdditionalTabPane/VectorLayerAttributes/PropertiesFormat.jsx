import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Select, Collapse, CollapsePanel, Checkbox } from 'oskari-ui';

const StyledSelect = styled(Select)`
    width: 50%;
    margin-bottom: 10px;
`;

const CheckboxWrapper = styled.div`
    display: flex;
`;

const TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'i', 'b', 'em'];
const FORMATTERS = ['link', 'image', 'number'];
// eslint-disable-next-line no-unused-vars
const HIDDEN = 'hidden'; // TODO: support or notify to use filter?

const localize = key => Oskari.getMsg('admin-layereditor', `attributes.format.type.${key}`)

const getOptions = () => {
    const opts = [];
    opts.push({ label: localize('typeFormats'), options: FORMATTERS.map(f => ({label: localize(f), value: f}))});
    opts.push({ label: localize('textFormats'), options: TAGS.map(f => ({label: f, value: f}))});
    return opts;
};

const CollapseContent = ({name, format, update }) => {
    const values =  format[name] || {};
    const { params = {} } = values;

    const onChange = (key, value) => {
        const updated = { ...values, [key]:  value };
        update({...format, [name]: updated });
    };
    const onParamChange = (key, value) => {
        const updated = { ...params, [key]: value };
        onChange('params', updated);
    };

    return (
        <Fragment>
            <StyledSelect allowClear
                value={values.type}
                onChange={value => onChange('type', value)}
                options={getOptions()}/>
            <CheckboxWrapper>
                <Checkbox checked={values.noLabel} onChange={evt => onChange('noLabel', evt.target.checked)}>
                    <Message messageKey='attributes.format.options.noLabel' />
                </Checkbox>
                <Checkbox checked={values.skipEmpty} onChange={evt => onChange('skipEmpty', evt.target.checked)}>
                    <Message messageKey='attributes.format.options.skipEmpty' />
                </Checkbox>
                { values.type === 'image' &&
                    <Checkbox checked={params.link} onChange={evt => onParamChange('link', evt.target.checked)}>
                        <Message messageKey='attributes.format.options.link' />
                    </Checkbox>
                }
            </CheckboxWrapper>
        </Fragment>
    );
};

export const PropertiesFormat = ({ properties, labels, ...rest }) => {
    return (
        <Collapse accordion>
            { properties.map(name => {
                return (
                    <CollapsePanel key={name} header={labels[name] ? `${name} (${labels[name]})` : name}>
                        <CollapseContent key={name} name={name} {...rest} />
                    </CollapsePanel>
                )})
            }
        </Collapse>
    );
};

PropertiesFormat.propTypes = {
    format: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired,
    properties: PropTypes.array.isRequired,
    labels: PropTypes.object.isRequired
};
