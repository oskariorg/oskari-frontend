import React from 'react';
import PropTypes from 'prop-types';
import { UrlInput } from '../../components/UrlInput';
import { Button } from '../../components/Button';

const versionsAvailable = {
    'WFS': ['3.0']
};

export class LayerURLForm extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: false
        };
        this.mutator = props.service;
    }
    fetchCapabilities (version) {
        this.setState((state) => {
            return {
                loading: true,
                version
            };
        });
        alert(`TODO: fetch capabilities for: ${this.getLayerType()} ${version}`);
        setTimeout(() => this.mutator.setVersion(version), 2000);
    }
    getLayerType () {
        return this.props.layer.type;
    }
    getVersions () {
        return versionsAvailable[this.getLayerType()] || [];
    }
    render () {
        return (
            <div>
                Selected: {this.getLayerType()}
                <UrlInput defaultValue="oskari.org/geoserver" />
                {this.getVersions().map((version, key) => (
                    <Button type="primary" key={key}
                        onClick={() => this.fetchCapabilities(version)}
                        loading={this.state.loading}>{version}</Button>
                ))}
            </div>
        );
    }
}

LayerURLForm.propTypes = {
    layer: PropTypes.object,
    service: PropTypes.any
};
