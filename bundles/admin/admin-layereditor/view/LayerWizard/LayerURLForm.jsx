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
        this.mutator = props.service;
        this.state = {
            url: props.layer.url
        };
    }
    updateUrl (url) {
        this.setState((state) => {
            return {
                ...state,
                url: url.value
            };
        });
    }
    fetchCapabilities (version) {
        this.mutator.setVersion(this.state.url, version);
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
                <UrlInput
                    defaultValue={this.state.url}
                    disabled={this.props.loading}
                    onChange={(value) => this.updateUrl({value})} />
                {this.getVersions().map((version, key) => (
                    <Button type="primary" key={key}
                        onClick={() => this.fetchCapabilities(version)}
                        disabled={!this.state.url}
                        loading={this.props.loading}>{version}</Button>
                ))}
            </div>
        );
    }
}

LayerURLForm.propTypes = {
    layer: PropTypes.object,
    loading: PropTypes.bool,
    service: PropTypes.any
};
