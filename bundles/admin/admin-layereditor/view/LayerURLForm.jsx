import React from 'react';
import PropTypes from 'prop-types';
import { UrlInput } from '../components/UrlInput';
import { Select } from '../components/Select';
import { Button } from '../components/Button';

export class LayerURLForm extends React.Component {
    constructor (props) {
        super(props);
        // TODO: pass by type or fetch from layer plugin based on props.type?
        this.versionsAvailable = ['3.0'];
        this.state = {
            loading: false
        };
    }
    fetchCapabilities (version) {
        this.setState((state) => {
            return {
                loading: true,
                version
            };
        });
        alert(`Go fetch capabilities for: ${this.props.type} ${version}`);
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
    render () {
        const protocols = [{title: 'https://'}, {title: 'http://'}];
        const selectBefore = (
            <Select defaultValue="https://" style={{ width: 90 }} options={protocols} />
        );
        return (
            <div>
                Selected: {this.props.type}
                <UrlInput addonBefore={selectBefore} defaultValue="oskari.org/geoserver" />
                {this.versionsAvailable.map((version, key) => (
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
    type: PropTypes.string,
    onSuccess: PropTypes.function
};
