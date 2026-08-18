import React from 'react';
import PropTypes from 'prop-types';
import { styled } from 'styled-components';
import { Badge, Collapse, Message, UrlInput } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { cleanUrlAndExtractParams } from './ServiceUrlInputHelper';
import { ServiceUrlParams } from './ServiceUrlParams';

const { CREDENTIALS } = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

const CollapseTitle = styled('div')`
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
`;

export const ServiceUrlInput = ({ layer, propertyFields, disabled, controller, credentialsCollapseOpen = false }) => {
    const params = layer.params || {};
    const paramCount = Object.keys(params).length;
    const onUrlCleanup = (url) => {
        const { cleanedUrl, params = {} } = cleanUrlAndExtractParams(url);
        controller.setLayerParams(params);
        return cleanedUrl;
    };

    const credentialProps = {
        allowCredentials: propertyFields.includes(CREDENTIALS),
        defaultOpen: credentialsCollapseOpen,
        usernameValue: layer.username,
        passwordValue: layer.password,
        panelText: <Message messageKey='usernameAndPassword'/>,
        usernameText: <Message messageKey='fields.username'/>,
        passwordText: <Message messageKey='fields.password'/>,
        usernameOnChange: controller.setUsername,
        passwordOnChange: controller.setPassword
    };

    const paramsItems = [{
        key: 'params',
        label: <CollapseTitle>
            <Message messageKey='fields.params.title'/>
            {paramCount > 0 && <Badge count={paramCount} />}
        </CollapseTitle>,
        children: <ServiceUrlParams
            params={params}
            disabled={disabled}
            controller={controller} />
    }];

    return (
        <>
            <UrlInput
                key={`refreshOnLayerChange_${layer.id}`}
                value={layer.url}
                disabled={disabled}
                onChange={url => controller.setLayerUrl(url)}
                onBlur={url => controller.setLayerUrl(url)}
                urlCleanupFunction={onUrlCleanup}
                credentials={credentialProps}/>
            <Collapse items={paramsItems} />
        </>
    );
};
ServiceUrlInput.propTypes = {
    layer: PropTypes.object.isRequired,
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    disabled: PropTypes.bool,
    controller: PropTypes.instanceOf(Controller).isRequired,
    credentialsCollapseOpen: PropTypes.bool
};
