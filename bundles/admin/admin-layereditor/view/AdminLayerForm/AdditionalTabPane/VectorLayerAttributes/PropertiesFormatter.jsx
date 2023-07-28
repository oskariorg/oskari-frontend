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
const HIDDEN = 'hidden'; // TODO: support or notify to use filter

const getOptions = () => {
    const opts = [];
    opts.push({ label: 'formatters', options: FORMATTERS.map(f => ({label: f, value: f}))});
    opts.push({ label: 'tags', options: TAGS.map(f => ({label: f, value: f}))});
    return opts;
};

const CollapseContent = ({name, format, update }) => {
    const { noLabel, skipEmpty, type, params = {} } = format[name] || {};
    const { link } = params;

    const onChange = (key, value) => {
        console.log(key, value);
        // update({...format, [name] })
    };
    return (
        <Fragment>
            <StyledSelect
                value={type}
                onChange={value => onChange('type', value)}
                options={getOptions()}/>
            <CheckboxWrapper>
                <Checkbox checked={noLabel} onChange={evt => onChange('noLabel', evt.target.checked)}>
                    <Message messageKey='noLabel' />
                </Checkbox>
                <Checkbox checked={skipEmpty} onChange={evt => onChange('skipEmpty', evt.target.checked)}>
                    <Message messageKey='skipEmpty' />
                </Checkbox>
                <Checkbox checked={link} onChange={evt => onChange('link', evt.target.checked)}>
                    <Message messageKey='link' />
                </Checkbox>
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
