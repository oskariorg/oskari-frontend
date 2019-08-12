import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import { Select, Option } from './Select';
import 'antd/es/input/style/';

const protocols = ['https', 'http'];
export class UrlInput extends React.Component {
    constructor (props) {
        super(props);
        if (props.value) {
            const urlParts = props.value.split('://');
            this.state = {
                protocol: urlParts.shift(),
                url: urlParts.join('')
            };
        } else {
            this.state = {
                protocol: protocols[0],
                url: undefined
            };
        }
    }
    setProtocol (protocol) {
        if (!this.props.onChange) {
            return;
        }
        this.setState((state) => {
            this.props.onChange(`${protocol}://${state.url}`);
            return {
                ...state,
                protocol
            };
        });
    }
    onChange (event) {
        if (!this.props.onChange) {
            return;
        }
        const url = event.target.value;
        this.setState((state) => {
            const newState = {
                ...state,
                url
            };
            // in case user wrote the protocol in the field
            const urlParts = url.split('://');
            if (urlParts.length > 1) {
                newState.protocol = urlParts.shift();
                newState.url = urlParts.join('');
            }
            this.props.onChange(`${newState.protocol}://${newState.url}`);
            return newState;
        });
    }
    render () {
        const protocolSelect = (
            <Select
                value={this.state.protocol}
                style={{ width: 90 }}
                onSelect={(value) => this.setProtocol(value)} >
                {protocols.map((title) => (
                    <Option key={title} value={title}>{title}://</Option>
                ))}
            </Select>
        );

        const processedProps = {
            ...this.props,
            value: undefined,
            onChange: this.onChange.bind(this)
        };
        return (
            <Input {...processedProps} value={this.state.url} addonBefore={protocolSelect} />
        );
    }
}

UrlInput.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string
};
