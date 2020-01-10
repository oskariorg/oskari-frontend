import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Select, Option, Message, Tooltip, Icon } from 'oskari-ui';
import { LocaleConsumer } from 'oskari-ui/util';
import { StyledComponent } from '../StyledFormComponents';
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

const InfoIcon = styled(Icon)`
    margin-left: 10px;
`;

const CapabilitiesSrsInfo = LocaleConsumer(({ missing, supported }) => {
    return (
        <FlexRow>
            <div>
                <Message messageKey='supportedSRS' />
                <StyledComponent>
                    { supported.join(', ') }
                </StyledComponent>
            </div>
            <div>
                <Message messageKey='missingSRS' />
                <Tooltip title={<Message messageKey='missingInfo'/>}>
                    <InfoIcon type="question-circle" />
                </Tooltip>
                <StyledComponent>
                    { missing.join(', ') }
                </StyledComponent>
            </div>
        </FlexRow>
    );
});

const SrsSettings = ({ layer, capabilities = {}, propertyFields, onChange }) => {
    console.log(capabilities);
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
                <CapabilitiesSrsInfo supported={supported} missing={missing} />
            }
            <Message messageKey='forcedSRS' />
            <Tooltip title={<Message messageKey='forcedSRSInfo'/>}>
                <InfoIcon type="question-circle" />
            </Tooltip>
            <StyledComponent>
                <Select mode='tags' value={forced} onChange={onChange}>
                    { systemProjections.map((cur, i) => <Option key={`sysproj_${i}`}>{cur}</Option>) }
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

const contextWrap = LocaleConsumer(SrsSettings);
export { contextWrap as SrsSettings };
