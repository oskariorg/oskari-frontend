import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Checkbox, Message, Switch } from 'oskari-ui';
import { StyledFormField, SpacedLabel } from '../styled';

export const Coverage = ({ layer, controller }) => {
    const [checked, setChecked] = useState(false);
    const [metadataChecked, setMetadataChecked] = useState(false);
    const { attributes = {} } = layer;
    const isMetadataCoverageDisabled = attributes.ignoreCoverage || !layer.metadataid;

    useEffect(() => {
        if (isMetadataCoverageDisabled && attributes.ignoreMetadataCoverage) {
            controller.setIgnoreMetadataCoverage(false);
        }
    }, [isMetadataCoverageDisabled, attributes.ignoreMetadataCoverage, controller]);

    const toggle = checked => {
        if (checked) {
            controller.showLayerCoverage();
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
            <StyledFormField>
                <Checkbox checked={!!attributes.ignoreCoverage} onChange={evt => controller.setIgnoreCoverage(evt.target.checked)}>
                    <Message messageKey='fields.ignoreCoverage' />
                </Checkbox>
            </StyledFormField>
            <StyledFormField>
                <Checkbox disabled={isMetadataCoverageDisabled} checked={!!attributes.ignoreMetadataCoverage} onChange={evt => controller.setIgnoreMetadataCoverage(evt.target.checked)}>
                    <Message messageKey='fields.ignoreMetadataCoverage' />
                </Checkbox>
            </StyledFormField>
        </>
    );
};

Coverage.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
