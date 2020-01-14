import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Select, Option, Message, Tag } from 'oskari-ui';
import { StyledComponent } from '../StyledFormComponents';
import { InfoTooltip } from '../InfoTooltip';
import styled from 'styled-components';

const LayerComposingModel = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

const FlexRow = styled('div')`
    display: flex;
    > * {
        flex-grow: 1;
    }
    > :not(:last-child) {
        margin-right: 10px;
    }
`;

const EpsgCodeTags = ({ codes }) => {
    if (!codes || !Array.isArray(codes) || codes.length === 0) {
        return null;
    }
    return (
        <StyledComponent>
            { codes.map((epsg, i) => <Tag key={i}>{epsg}</Tag>) }
        </StyledComponent>
    );
};
EpsgCodeTags.propTypes = {
    codes: PropTypes.arrayOf(PropTypes.string)
};

const SupportedSRS = ({ epsgCodes }) => (
    <div>
        <Message messageKey='supportedSRS' />
        <EpsgCodeTags codes={epsgCodes} />
    </div>
);
SupportedSRS.propTypes = {
    epsgCodes: PropTypes.arrayOf(PropTypes.string)
};

const MissingSRS = ({ epsgCodes }) => {
    if (!epsgCodes || !Array.isArray(epsgCodes) || epsgCodes.length === 0) {
        return null;
    }
    return (
        <div>
            <Message messageKey='missingSRS' />
            <InfoTooltip messageKeys='missingSRSInfo' />
            <EpsgCodeTags codes={epsgCodes} />
        </div>
    );
};
MissingSRS.propTypes = {
    epsgCodes: PropTypes.arrayOf(PropTypes.string)
};

export const SrsSettings = ({ layer, capabilities = {}, propertyFields, onChange }) => {
    const systemProjections = Array.from(new Set(Oskari.app.getSystemDefaultViews().map(view => view.srsName)));
    const forced = layer.attributes ? layer.attributes.forcedSRS || [] : [];
    let supported = [];
    let missing = [];
    if (propertyFields.includes(LayerComposingModel.CAPABILITIES)) {
        if (Array.isArray(capabilities.srs)) {
            supported = capabilities.srs;
        }
        missing = systemProjections.filter(cur => !supported.includes(cur));
    }
    return (
        <Fragment>
            { propertyFields.includes(LayerComposingModel.CAPABILITIES) &&
                <FlexRow>
                    <SupportedSRS epsgCodes={supported}/>
                    <MissingSRS epsgCodes={missing}/>
                </FlexRow>
            }
            <Message messageKey='forcedSRS' />
            <InfoTooltip messageKeys='forcedSRSInfo' />
            <StyledComponent>
                <Select mode='tags' value={forced} onChange={onChange}>
                    { systemProjections.map(cur => <Option key={cur}>{cur}</Option>) }
                </Select>
            </StyledComponent>
        </Fragment>
    );
};

SrsSettings.propTypes = {
    layer: PropTypes.object.isRequired,
    capabilities: PropTypes.object,
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func
};
