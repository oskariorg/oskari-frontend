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
        // TODO: pass by type or fetch from layer plugin based on props.type?
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
        alert(`Go fetch capabilities for: ${this.getLayerType()} ${version}`);
    }
    getLayerType () {
        return this.props.layer.type;
    }
    notifySuccess () {
        if (this.props.onSuccess) {
            this.props.onSuccess({
                name: 'fake',
                locale: 'it',
                version: this.state.version
            });
        }
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
                <br/>
                <Button type="danger" onClick={() => this.notifySuccess()}>Fake it till you make it</Button>
            </div>
        );
    }
}

LayerURLForm.propTypes = {
    layer: PropTypes.object,
    onSuccess: PropTypes.func,
    service: PropTypes.any
};
