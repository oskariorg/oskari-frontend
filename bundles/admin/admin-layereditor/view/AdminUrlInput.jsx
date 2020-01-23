import React from 'react';
import PropTypes from 'prop-types';
import { Message, UrlInput } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';

const LayerComposingModel = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

export const AdminUrlInput = ({ layer, propertyFields, controller }) => {
    const credentialProps = {
        allowCredentials: propertyFields.includes(LayerComposingModel.CREDENTIALS),
        defaultOpen: false,
        usernameValue: layer.username,
        passwordValue: layer.password,
        panelText: <Message messageKey='usernameAndPassword'/>,
        usernameText: <Message messageKey='username'/>,
        passwordText: <Message messageKey='password'/>,
        usernameOnChange: controller.setUsername,
        passwordOnChange: controller.setPassword
    };
    return (
        <UrlInput
            key={layer.id}
            value={layer.url}
            onChange={url => controller.setLayerUrl(url)}
            credentials={credentialProps}/>
    );
};
AdminUrlInput.propTypes = {
    layer: PropTypes.object.isRequired,
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
