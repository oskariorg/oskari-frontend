import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Select } from 'oskari-ui'
import { Form, Card, Space, Input } from 'antd';
import styled from 'styled-components';

import 'antd/es/form/style/index.js';
import 'antd/es/card/style/index.js';
import 'antd/es/space/style/index.js';
import 'antd/es/input/style/index.js';

const { TextArea } = Input;

const StyledFormItem = styled(Form.Item)`
    margin-bottom: 12px;
`;

/**
 * @class GenericForm
 * @calssdesc <GenericForm>
 * @memberof module:oskari-ui
 * @see {@link module:oskari-ui/util.LocaleProvider|LocaleProvider}
 * @param {Object} props - { formSettings, fields }
 *
 * @example <caption>Basic usage</caption>
 * <GenericForm props={{ ...exampleProps }}/>
 */

/**
 * Generate generic Oskari UI form
 * 
 * @param {Object} props props        - object containing all form settings
 * @param {Object} props.formSettings - object containing settings for the form
 * @param {Array} props.fields        - array of objects containing all single fields
 *
 */
export const GenericForm = ({ props }) => {
    const {
        formSettings,
        fields
    } = props;

    const [form] = Form.useForm();

    console.log('generic form this', this);
    console.log('form --- ', form);

    if ( !props.fields ) {
        return null;
    }

    return (
        <Form
            form={ form }
            onFinishFailed={ formSettings.onFinishFailed(form) }
            onFinish={ formSettings.onFinish }
        >
            <Space direction="vertical">
                { createFormItems(fields, formSettings) }
            </Space>     
        </Form>
    );
};


/**
 * 
 * @param {Object} fields - array containing all fields
 * @returns {React.Component} 
 */
const createFormItems = (fields, formSettings) => {
    return fields.map((field) => {
        return (
            <StyledFormItem
                key={ field.name }
                name={ field.name }
                label={ formSettings.showLabels ? field.label : '' }
                rules={ field.rules }
            >
                { createFormInput( field ) }
            </StyledFormItem>
        );
    });
}


/**
 * Create single Form.Item content with provided field properties
 * 
 * @param {Object} field              - object containing information for single field
 * @param {String} field.type         - field type as string {text / textarea / info / dropdown}
 * @param {String} field.placeholder  - placeholder text for the current field
 * @param {String|Number} field.value - value for current field used in info card / drowdown / submit button
 * 
 * @returns {Component} React component for the provided field
 */
const createFormInput = (field) => {
    if (!field) {
        return null;
    }

    const fieldKey = field.name + '_' + field.type + '_field';

    switch(field.type) {
        case 'text':
            return (
                <Input
                    key={ fieldKey }
                    placeholder={ field.placeholder }
                    value={ field.value } />
            );
        case 'textarea':
            return (
                <TextArea
                    key={ fieldKey }
                    placeholder={ field.placeholder }
                    value={ field.value } />
            );
        case 'info':
            return (
                <Card key={ fieldKey }>
                    { field.value }
                </Card>
            );
        case 'dropdown':
            return (
                <Select
                    key={ fieldKey }
                    placeholder={ field.placeholder }>
                    { field.value.map(
                        (singleOption) => <Select.Option key={ singleOption + '_option' }>{ singleOption }</Select.Option>
                    ) }
                </Select>
            );
        case 'button':
            return (
                <Button
                    key={ fieldKey }
                    type={ field.style }
                    htmlType={ field.buttonType }
                    onClick={ field.onClick }>
                    { field.value }
                </Button>
            );
        default:
            return null;
    }
}

GenericForm.propTypes = {
    formName: PropTypes.string,
    fields: PropTypes.shape({
        type: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        placeholder: PropTypes.string,
        required: PropTypes.bool,
        value: PropTypes.any,
        validator: PropTypes.func,
        rules: PropTypes.array
    })
};
