import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { StyledFormField } from '../styled';
import { JsonInput } from '../../JsonInput';
import { InfoIcon } from 'oskari-ui/components/icons';

const featureStyle =
`{
    fill: {...},
    stroke: {...},
    image: {...},
    text: {...}
}`;
const optionalStyles =
`[
    {
        "property": {...},
        "fill": {...}
    },
    ...
]`;
const mapbox =
`{
    version: 8,
    layers: [...],
    sources: [...]
    ...
}`;
const cesium =
`{
    show: {...},
    color: {...}
    ...
}`;
const TEMPLATES = { featureStyle, optionalStyles, mapbox, cesium };

export const VectorStyleJson = ({ style, type, onChange }) => {
    const template = TEMPLATES[type];
    return (
        <Fragment>
            <Message messageKey={`styles.vector.${type}`}/>
            <span> (JSON)</span>
            <InfoIcon>
                <pre>{template}</pre>
            </InfoIcon>
            <StyledFormField>
                <JsonInput
                    rows={6}
                    value={style}
                    onChange={evt => onChange(evt.target.value)} />
            </StyledFormField>
        </Fragment>
    );
};
VectorStyleJson.propTypes = {
    style: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};
