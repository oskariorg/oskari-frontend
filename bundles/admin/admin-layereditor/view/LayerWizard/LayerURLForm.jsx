import React from 'react';
import PropTypes from 'prop-types';
import { Button, UrlInput } from 'oskari-ui';

export const LayerURLForm = ({ layer, loading, service, versions }) => {
    const credentials = {
        defaultOpen: true
    };
    return (
        <React.Fragment>
            <UrlInput
                value={layer.url}
                disabled={loading}
                credentials={credentials}
                onChange={(url) => service.setLayerUrl(url)} />
            {versions.map((version, key) => (
                <Button type="primary" key={key}
                    onClick={() => service.setVersion(version)}
                    disabled={!layer.url || loading}>{version}</Button>
            ))}
        </React.Fragment>
    );
};

LayerURLForm.propTypes = {
    layer: PropTypes.object,
    loading: PropTypes.bool,
    service: PropTypes.object,
    versions: PropTypes.array.isRequired
};
