import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Form, InputNumber } from 'antd';
import { ANTD_FORMLAYOUT } from './constants';

const sizeFormatter = (number) => Math.abs(number); 


export const SizeControl = (props) => {
    return (
        <Form.Item
            name={ props.name }
            label={
                <Message messageKey={ props.localeKey }/>
            }
            initialValue={ 3 }
            { ...ANTD_FORMLAYOUT }
        >
            <InputNumber
                min={ 1 }
                max={ 5 }
                formatter={ sizeFormatter }
                parser={ sizeFormatter }
            />
        </Form.Item>
    );
};

SizeControl.propTypes = {
    format: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    localeKey: PropTypes.string.isReqquired
}