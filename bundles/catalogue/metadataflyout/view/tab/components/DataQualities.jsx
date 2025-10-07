import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message } from 'oskari-ui';
import { Label, SubLabel } from '..';

const DETAILED = [
    'nameOfMeasure',
    'measureDescription',
    'evaluationMethodType',
    'evaluationMethodDescription',
    'measureIdentificationAuthorization',
    'measureIdentificationCode',
    'dateTime'
];

const StyledField = styled.div`
    margin-bottom: 10px;
`;

const LIST_FIELDS = {
    conformance: ['specification', 'pass', 'explanation'],
    quantitative: ['valueType, valueUnit, errorStatistic']
};

const Field = ({ value, labelKey }) => {
    if (typeof value === 'boolean') {
        return <StyledField><Message messageKey={`flyout.quality.${labelKey}.${value}`}/></StyledField>;
    }
    if (!value) {
        return null;
    }
    if (Array.isArray(value)) {
        return value.map((val, i) => <Field key={i} labelKey={labelKey} value={val} />);
    }
    return <StyledField><Message messageKey={`flyout.quality.${labelKey}`}>: {value}</Message></StyledField>;
};
Field.propTypes = {
    value: PropTypes.any,
    labelKey: PropTypes.string.isRequired
};

const List = ({ list, type, additionalValues = [] }) => {
    if (!list.length) {
        return null;
    }
    const fields = LIST_FIELDS[type] || [];
    return (
        <Fragment>
            <SubLabel labelKey={`${type}Result`} />
            {list.map((result, i) => (
                <Fragment key={i}>
                    { fields.map(key => <Field key={key} labelKey={key} value={result[key]} />) }
                    { additionalValues.map(val => <Field key={val} labelKey='value' value={val} />)}
                </Fragment>
            ))}
        </Fragment>
    );
};
List.propTypes = {
    list: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
    additionalValues: PropTypes.array
};

export const DataQualities = ({ content, detailed }) => {
    if (!content.length) {
        return null;
    }
    return (
        <Fragment>
            {content.map(({ nodeName, conformanceResultList, quantitativeResultList, quantitativeResult, ...details }, i) => (
                <Fragment key={i}>
                    <Label labelKey={nodeName} />
                    { detailed && DETAILED.map(key => <Field key={key} labelKey={key} content={details[key]} />) }
                    <List list={conformanceResultList} type='conformance' />
                    { detailed && <List list={quantitativeResultList} type='quantitative' additionalValues={quantitativeResult}/> }
                </Fragment>
            ))}
        </Fragment>
    );
};

DataQualities.propTypes = {
    content: PropTypes.array.isRequired,
    detailed: PropTypes.bool
};
