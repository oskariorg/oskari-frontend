import React from 'react';
import Input from 'antd/lib/input';
import PropTypes from 'prop-types';
import { Select, Option } from './Select';

const protocols = ['https', 'http'];
export class UrlInput extends React.Component {
    constructor (props) {
        super(props);
        if (props.defaultValue) {
            const urlParts = props.defaultValue.split('://');
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
        this.changeHandler = props.onChange;
        this.processedProps = {
            ...props,
            defaultValue: undefined,
            onChange: this.onChange.bind(this)
        };
    }
    setProtocol (protocol) {
        this.setState((state) => {
            this.changeHandler(`${protocol}://${state.url}`);
            return {
                ...state,
                protocol
            };
        });
    }
    onChange (event) {
        if (!this.changeHandler) {
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
            this.changeHandler(`${newState.protocol}://${newState.url}`);
            return newState;
        });
    }
    render () {
        const protocolSelect = (
            <Select
                defaultValue={this.state.protocol}
                style={{ width: 90 }}
                onSelect={(value) => this.setProtocol(value)} >
                {protocols.map((title, key) => (
                    <Option key={key} value={title}>{title}://</Option>
                ))}
            </Select>
        );
        return (
            <Input {...this.processedProps} defaultValue={this.state.url} addonBefore={protocolSelect} />
        );
    }
}

UrlInput.propTypes = {
    onChange: PropTypes.func,
    defaultValue: PropTypes.string
};
