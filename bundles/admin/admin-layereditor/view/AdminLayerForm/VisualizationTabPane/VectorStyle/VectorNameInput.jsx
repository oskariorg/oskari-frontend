import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextInput, Message } from 'oskari-ui';
import { Form } from 'antd';

export const VectorNameInput = (props) => {
    const [vectorNameForm] = Form.useForm();
    const nameErrors = useState(false);
    vectorNameForm.setFieldsValue({ styleName: props.styleName });
    return (
        <Form
            form={ vectorNameForm }
            onChange={ () => {
                console.log('validating');
                vectorNameForm.validateFields(['styleName']).catch(err => {
                    console.log('doesnt validate');
                    nameErrors.current = err.errorFields.length > 0;
                });

                if (nameErrors.current && vectorNameForm.getFieldError('styleName').length === 0) {
                    console.log('validates');
                    props.stateSetCallback({ ...props.editorState, validates: true });
                }
            } }
        >
            <Form.Item
                name='styleName'
                key='styleName'
                rules={[{ required: true, message: <Message messageKey="styles.validation.name" /> }]}
                value={ props.styleName }
                onChange={ (event) => props.stateSetCallback({ ...props.editorState, styleName: event.target.value })}
            >
                <TextInput

                />
            </Form.Item>
        </Form>
    );
};

VectorNameInput.propTypes = {
    stateSetCallback: PropTypes.func,
    editorState: PropTypes.object,
    styleName: PropTypes.string
};
