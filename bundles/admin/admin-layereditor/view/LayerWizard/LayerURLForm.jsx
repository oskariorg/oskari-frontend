import React from 'react';
import PropTypes from 'prop-types';
import { UrlInput } from '../../components/UrlInput';
import { Button } from '../../components/Button';

const versionsAvailable = {
    'WFS': ['3.0']
};

function getVersions (type) {
    return versionsAvailable[type] || [];
}

export const LayerURLForm = ({layer, loading, service}) => (
    <div>
        Selected: {layer.type}
        <UrlInput
            value={layer.url}
            disabled={loading}
            onChange={(url) => service.setUrl(url)} />
        {getVersions(layer.type).map((version, key) => (
            <Button type="primary" key={key}
                onClick={() => service.setVersion(version)}
                disabled={!layer.url}
                loading={loading}>{version}</Button>
        ))}
    </div>
);

LayerURLForm.propTypes = {
    layer: PropTypes.object,
    loading: PropTypes.bool,
    service: PropTypes.any
};
