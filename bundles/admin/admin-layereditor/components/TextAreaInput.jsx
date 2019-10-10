import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import 'antd/es/input/style/';

const { TextArea } = Input;

export const TextAreaInput = (props) => (
    <TextArea {...props} />
);

TextAreaInput.propTypes = {
    rows: PropTypes.number
};
