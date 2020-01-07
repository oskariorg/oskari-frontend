import React from 'react';
import PropTypes from 'prop-types';
import { Button, UrlInput } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';

export const LayerURLForm = ({ layer, loading, controller, versions }) => {
    const credentials = {
        defaultOpen: true
    };
    return (
        <React.Fragment>
            <UrlInput
                value={layer.url}
                disabled={loading}
                credentials={credentials}
                onChange={(url) => controller.setLayerUrl(url)}
            />
            {versions.map((version, key) => (
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
    controller: PropTypes.instanceOf(Controller).isRequired,
    versions: PropTypes.array.isRequired
};
