import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Message, Switch } from 'oskari-ui';
import { StyledFormField, SpacedLabel } from '../styled';

export const Coverage = ({ id, controller }) => {
    const [checked, setChecked] = useState(false);
    const [metadataChecked, setMetadataChecked] = useState(false);
    const toggle = checked => {
        if (checked) {
            controller.showLayerCoverage(id);
        } else {
            controller.clearLayerCoverage();
        }
        setChecked(checked);
    };

    const toggleMetadata = checked => {
        if (checked) {
            controller.showLayerMetadataCoverage();
        } else {
            controller.clearLayerMetadataCoverage();
        }
        setMetadataChecked(checked);
    };

    return (
        <>
            <StyledFormField>
                <label>
                    <Switch size='small' checked={checked} onChange={checked => toggle(checked)} />
                    <Message messageKey='fields.coverage' LabelComponent={SpacedLabel} />
                </label>
            </StyledFormField>
            <StyledFormField>
                <label>
                    <Switch size='small' checked={metadataChecked} onChange={checked => toggleMetadata(checked)} />
                    <Message messageKey='fields.metadataCoverage' LabelComponent={SpacedLabel} />
                </label>
            </StyledFormField>
        </>
    );
};

Coverage.propTypes = {
    id: PropTypes.number.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
