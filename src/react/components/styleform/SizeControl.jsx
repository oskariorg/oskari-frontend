import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Select, ColorPicker, Preview } from 'oskari-ui';
import { Form, Card, Space, Input, Row, Radio, InputNumber } from 'antd';
import styled from 'styled-components';

const sizeFormatter = (number) => Math.abs(number); 

export const SizeControl = (props) => {
    return (
        <Row>
            <Form.Item name='size' label='Size' initialValue={ 3 } { ...props.formLayout }>
                <InputNumber
                    min={ 1 }
                    max={ 5 }
                    formatter={ sizeFormatter }
                    parser={ sizeFormatter }
                    onChange={ (value) => {
                        props.onChangeCallback('stroke.width', value);
                        props.onChangeCallback('stroke.area.width', value);
                        props.onChangeCallback('image.size', value);
                        //updateState('stroke.width', value);
                        //updateState('stroke.area.width', value);
                        //updateState('image.size', value);
                    } } />
            </Form.Item>
        </Row>
    );
};