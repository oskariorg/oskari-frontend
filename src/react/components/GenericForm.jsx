import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Select } from 'oskari-ui'
import { Form, Card, Space, Input, Row } from 'antd';
import styled from 'styled-components';

import 'antd/es/form/style/index.js';
import 'antd/es/card/style/index.js';
import 'antd/es/space/style/index.js';
import 'antd/es/input/style/index.js';

const { TextArea } = Input;

const zIndexValue = 999999;

const StyledFormItem = styled(Form.Item)`
    margin-bottom: 0;

    display:flex;
    flex-wrap: wrap;

    .ant-form-item-label {
        text-align: left;
        width: 100%;

        label {
            color: #6d6d6d;
            font-size: 12px;
            height: 24px;
        }
    }

    input {
        height: 40px;
    }

    .ant-form-item-explain {
        font-size: 12px;

        & > div {
            margin: 5px 0 0; 
        }
    }
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

export class GenericForm extends React.Component {
    constructor (props) {
        super(props);
        
        this.formRef = React.createRef();
    }

    componentDidMount () {
        this._populateForm(); // Populate form fields on render
    }

    /**
     * 
     * @param {Object} fields - array containing all fields
     * @returns {React.Component} 
     */
    createFormItems (fields, formSettings) {
        return fields.map((field) => {
            return (
                <StyledFormItem
                    key={ field.name }
                    name={ field.type !== 'buttongroup' ? field.name : '' }
                    label={ formSettings.showLabels ? field.label : '' }
                    rules={ field.rules }
                >
                    { this.createFormInput( field ) }
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

    createFormInput (field) {
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
                    />
                );
            case 'textarea':
                return (
                    <TextArea
                        key={ fieldKey }
                        placeholder={ field.placeholder }
                    />
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
                        placeholder={ field.placeholder }
                        dropdownStyle={{ zIndex: zIndexValue }}

                    >
                        { field.value.map((singleOption) => {
                            return (
                                <Select.Option
                                    value={ singleOption.categoryId }
                                    key={ singleOption.categoryId }
                                >
                                    { singleOption.name }
                                </Select.Option>
                            );
                        }) }
                    </Select>
                );
            case 'button':
                return (
                    <Button
                        key={ fieldKey }
                        type={ field.style }
                        htmlType={ field.buttonType }
                        onClick={ field.onClick }
                        block={ (field.buttonType === 'submit' || field.buttonType === 'button') }>
                        { field.value }
                    </Button>
                );
            case 'buttongroup':
                return ( 
                <Row justify={ 'center' }>
                    <Space>
                        { field.buttons.map((singleItem) => {
                            return (
                                <Button
                                    key={ singleItem.name + '' }
                                    type={ singleItem.style }
                                    htmlType={ singleItem.buttonType }
                                    onClick={ singleItem.onClick }>
                                    { singleItem.value }
                                </Button>
                            );
                        }) }
                    </Space>
                </Row>
                );
            default:
                return null;
        }
    }

    /**
     * Populates form on form init
     */
    _populateForm() {
        for(const field of this.props.fields) {
            if (field.type === 'dropdown') {
                this.formRef.current.setFieldsValue({
                    [field.name]: field.value.find(option => option.isDefault).categoryId
                });
            } else {
                this.formRef.current.setFieldsValue({
                    [field.name]: field.value
                });
            } 
        }
    }
    

    render ()  {
        return (
            <Form
                onFinishFailed={ this.props.formSettings.onFinishFailed }
                onFinish={ this.props.formSettings.onFinish }
                ref={ this.formRef }
            >
                <Space direction="vertical">
                    { this.createFormItems( this.props.fields, this.props.formSettings) }
                </Space>     
            </Form>
        );
    }
};

GenericForm.propTypes = {
    formName: PropTypes.string,
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string.isRequired,
            label: PropTypes.string,
            name: PropTypes.string.isRequired,
            placeholder: PropTypes.string,
            required: PropTypes.bool,
            value: PropTypes.any,
            validator: PropTypes.func,
            rules: PropTypes.array
        })
    )
};
