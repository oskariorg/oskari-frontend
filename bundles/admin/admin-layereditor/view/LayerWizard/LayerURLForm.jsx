import React from 'react';
import PropTypes from 'prop-types';
import { Button, UrlInput, Message } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import styled from 'styled-components';

const PaddedUrlInputContainer = styled.div`
    margin-bottom: 10px;
`;
const PaddedButton = styled(Button)`
    margin-right: 10px;
`;

export const LayerURLForm = ({ layer, loading, controller, versions, credentialsCollapseOpen }) => {
    const credentials = {
        defaultOpen: credentialsCollapseOpen,
        allowCredentials: true,
        panelText: <Message messageKey='usernameAndPassword'/>,
        usernameText: <Message messageKey='username'/>,
        passwordText: <Message messageKey='password'/>,
        usernameValue: layer.username,
        passwordValue: layer.password,
        usernameOnChange: controller.setUsername,
        passwordOnChange: controller.setPassword
    };
    return (
        <React.Fragment>
            <PaddedUrlInputContainer>
                <UrlInput
                    value={layer.url}
                    disabled={loading}
                    credentials={credentials}
                    onChange={(url) => controller.setLayerUrl(url)}
                />
            </PaddedUrlInputContainer>
            {versions.map((version, key) => (
                <PaddedButton type="primary" key={key}
                    onClick={() => controller.setVersion(version)}
                    disabled={!layer.url || loading}>{version}</PaddedButton>
            ))}
        </React.Fragment>
    );
};

LayerURLForm.propTypes = {
    layer: PropTypes.object,
    loading: PropTypes.bool,
    controller: PropTypes.instanceOf(Controller).isRequired,
    versions: PropTypes.array.isRequired,
    credentialsCollapseOpen: PropTypes.bool.isRequired
};
