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

const CollapseContent = ({name, formatter, update }) => {
    const { noLabel, skipEmpty, type, params = {} } = formatter[name] || {};
    const { link } = params;

    const onChange = value => console.log(value);
    return (
        <Fragment>
            <StyledSelect
                value={type}
                onChange={onChange}
                options={getOptions()}/>
            <CheckboxWrapper>
                <Checkbox checked={noLabel} onChange={onChange}>
                    <Message messageKey='noLabel' />
                </Checkbox>
                <Checkbox checked={skipEmpty} onChange={onChange}>
                    <Message messageKey='skipEmpty' />
                </Checkbox>
                <Checkbox checked={link} onChange={onChange}>
                    <Message messageKey='link' />
                </Checkbox>
            </CheckboxWrapper>
        </Fragment>
    );
};

export const PropertiesFormatter = ({ properties, labels, ...rest }) => {
    return (
        <Collapse accordion>
            { properties.map(name => {
                return (
                    <CollapsePanel header={labels[name] ? `${name} (${labels[name]})` : name}>
                        <CollapseContent key={name} name={name} {...rest} />
                    </CollapsePanel>
                )})
            }
        </Collapse>
    );
};

PropertiesFormatter.propTypes = {
    formatter: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired,
    properties: PropTypes.array.isRequired,
    labels: PropTypes.object.isRequired
};
