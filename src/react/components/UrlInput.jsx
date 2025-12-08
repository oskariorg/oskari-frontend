import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import { Select } from './Select';
import { Collapse } from './Collapse';
import { TextInput } from './TextInput';

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
            if (state.url) {
                // trigger upstream state change only if we have more than the protocol
                this.props.onChange(`${protocol}://${state.url}`);
            }
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
            if (!newState.url.trim()) {
                // If we only have protocol -> trigger "unset"
                this.props.onChange(undefined);
            } else {
                this.props.onChange(`${newState.protocol}://${newState.url}`);
            }
            return newState;
        });
    }

    onBlur (event) {
        if (!this.props.onBlur) {
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

            if (newState?.url && this.props?.urlCleanupFunction) {
                const cleaned = this.props?.urlCleanupFunction(`${newState.protocol}://${newState.url}`);
                newState.url = cleaned;
            }

            if (!newState.url.trim()) {
                // If we only have protocol -> trigger "unset"
                this.props.onBlur(undefined);
            } else {
                this.props.onBlur(`${newState.protocol}://${newState.url}`);
            }
            return newState;
        });
    }

    render () {
        const { credentials = {}, urlCleanupFunction = null, ...other } = this.props;
        const options = protocols.map((title) => ({ value: title, label: title + '://' })); //
        const protocolSelect = (
            <Select
                value={this.state.protocol}
                style={{ width: 90 }}
                onSelect={(value) => this.setProtocol(value)}
                options={options}
            />
        );
        const processedProps = {
            ...other,
            urlCleanupFunction,
            value: undefined,
            onChange: this.onChange.bind(this),
            onBlur: this.onBlur.bind(this)
        };

        const collapseProps = {};

        if (credentials.defaultOpen) {
            // Panel with this key is open as default
            collapseProps.activeKey = 'usernameAndPassword';
        }

        const credentialsPanel = {
            key: 'usernameAndPassword',
            label: credentials.panelText,
            children: <form autoComplete="off">
                <div>
                    {credentials.usernameText}
                    <div><TextInput autoComplete='off' value={credentials.usernameValue} type='text' onChange={(evt) => credentials.usernameOnChange(evt.target.value)} /></div>
                </div>
                <div>
                    {credentials.passwordText}
                    <div><Input.Password autoComplete='one-time-code' value={credentials.passwordValue} onChange={(evt) => credentials.passwordOnChange(evt.target.value)} /></div>
                </div>
            </form>
        };

        // The component is used to register external services so browser autocompleting passwords saved for the Oskari instance url is harmful, not helpful.
        // Using "one-time-code" for password to prevent autocompleting the users passwords.
        // Using off in the input doesn't work even when wrapped to a form with autocomplete off.
        // Since we don't want browser to suggest/save the instance password when registering a layer autoComplete="new-password" isn't used
        return (
            <div>
                <Input {...processedProps} value={this.state.url} addonBefore={protocolSelect} />&nbsp;
                {credentials.allowCredentials &&
                    <Collapse {...collapseProps} items={[credentialsPanel]}/>
                }
            </div>
        );
    }
}

UrlInput.propTypes = {
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    urlCleanupFunction: PropTypes.func,
    value: PropTypes.string,
    credentials: PropTypes.object
};
