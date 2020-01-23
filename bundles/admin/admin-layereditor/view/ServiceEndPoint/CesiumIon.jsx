import React from 'react';
import PropTypes from 'prop-types';
import { Message, Collapse, CollapsePanel } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { OptionInput } from './OptionInput';
import { StyledFormField } from '../styled';

export const CesiumIon = ({ layer, controller, defaultOpen = false }) => (
    <Collapse defaultActiveKey={(layer.options.assetId || defaultOpen) ? 'open' : 'closed'}>
        <CollapsePanel key='open' header={<Message messageKey='ion.title'/>} defaultOpen>
            <Message messageKey='ion.assetId' />
            <StyledFormField>
                <OptionInput layer={layer} controller={controller} propKey='ionAssetId'/>
            </StyledFormField>
            <Message messageKey='ion.accessToken' />
            <StyledFormField>
                <OptionInput layer={layer} controller={controller} propKey='ionAccessToken'/>
            </StyledFormField>
            <Message messageKey='ion.assetServer' />
            <StyledFormField>
                <OptionInput layer={layer} controller={controller} propKey='ionAssetServer'/>
            </StyledFormField>
        </CollapsePanel>
    </Collapse>
);
CesiumIon.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    defaultOpen: PropTypes.bool
};
