import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { AdminUrlInput } from '../../AdminUrlInput';
import styled from 'styled-components';

const PaddedUrlInputContainer = styled.div`
    margin-bottom: 10px;
`;
const PaddedButton = styled(Button)`
    margin-right: 10px;
`;

export const LayerURLForm = ({ layer, controller, versions }) => (
    <React.Fragment>
        <PaddedUrlInputContainer>
            <AdminUrlInput layer={layer} controller={controller} propertyFields={propertyFields} />
        </PaddedUrlInputContainer>
        {versions.map((version, key) => (
            <PaddedButton type="primary" key={key}
                onClick={() => controller.setVersion(version)}
                disabled={!layer.url || loading}>{version}</PaddedButton>
        ))}
    </React.Fragment>
);
LayerURLForm.propTypes = {
    layer: PropTypes.object,
    loading: PropTypes.bool,
    controller: PropTypes.instanceOf(Controller).isRequired,
    versions: PropTypes.array.isRequired,
    credentialsCollapseOpen: PropTypes.bool.isRequired
};
