import React from 'react';
import PropTypes from 'prop-types';
import { Message, Collapse } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { OptionInput } from './OptionInput';
import { StyledFormField } from '../styled';

export const CesiumIon = ({ layer, controller, defaultOpen = false }) => {
    // defaultOpoen ?
    const items = [{
        key: 'open',
        label: <Message messageKey='ion.title'/>,
        children: <>
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
        </>
    }];
    return <Collapse defaultActiveKey={(layer.options.assetId || defaultOpen) ? 'open' : 'closed'} items={items}/>;
};
CesiumIon.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    defaultOpen: PropTypes.bool
};
