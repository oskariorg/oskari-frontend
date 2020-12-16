import React from 'react';
import { SvgRadioButton } from 'oskari-ui';
import { Form, Row } from 'antd';

export const PointTab = (props) => {
    return (
        <>
            <Row>
                <Form.Item
                    { ...props.formLayout }
                    name='image'
                    label='Ikoni'
                    onChange={ (event) => props.onChangeCallback('image.shape', event.target.value) }
                >
                    <SvgRadioButton options={ props.markers } defaultValue={ props.styleSettings.image.shape } />
                </Form.Item>
            </Row>  
        </>
    );
};