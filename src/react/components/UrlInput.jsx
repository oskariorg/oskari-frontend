import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import { Select, Option } from './Select';
import { Collapse, Panel } from './Collapse';
import { TextInput } from './TextInput';
import 'antd/es/input/style/index.js';

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
        const { credentials, ...other } = this.props;
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
            ...other,
            value: undefined,
            onChange: this.onChange.bind(this)
        };

        let collapseProps = {}

        if (this.props.credentials && this.props.credentials.defaultOpen) {
            // Panel with this key is open as default
            collapseProps.activeKey = 'usernameAndPassword';
        }

        return (
            <div>
                <Input {...processedProps} value={this.state.url} addonBefore={protocolSelect} />&nbsp;
                {credentials.allowCredentials &&
                    <Collapse {...collapseProps}>
                        <Panel header={credentials.panelText} key='usernameAndPassword'>
                            <div>
                                {credentials.usernameText}
                                <div><TextInput value={credentials.usernameValue} type='text' onChange={(evt) => credentials.usernameOnChange(evt.target.value)} /></div>
                            </div>
                            <div>
                                {credentials.passwordText}
                                <div><TextInput value={credentials.passwordValue} type='password' onChange={(evt) => credentials.passwordOnChange(evt.target.value)} /></div>
                            </div>
                        </Panel>
                    </Collapse>
                }
            </div>
        );
    }
}

UrlInput.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
    credentials: PropTypes.object
};
