import React from 'react';
import PropTypes from 'prop-types';
import { Button, UrlInput } from 'oskari-ui';

const versionsAvailable = {
    'wmslayer': ['1.1.1', '1.3.0'],
    'wfslayer': ['1.1.0', '2.0.0', '3.0']
};

function getVersions (type) {
    return versionsAvailable[type] || [];
}

export const LayerURLForm = ({ layer, loading, controller }) => {
    const credentials = {
        defaultOpen: true
    };
    return (
        <React.Fragment>
            <UrlInput
                value={layer.url}
                disabled={loading}
                credentials={credentials}
                onChange={(url) => controller.setLayerUrl(url)} />
            {getVersions(layer.type).map((version, key) => (
                <Button type="primary" key={key}
                    onClick={() => controller.setVersion(version)}
                    disabled={!layer.url || loading}>{version}</Button>
            ))}
        </React.Fragment>
    );
};

LayerURLForm.propTypes = {
    layer: PropTypes.object,
    loading: PropTypes.bool,
    controller: PropTypes.object.isRequired
};
