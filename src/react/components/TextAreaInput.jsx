import React from 'react';
import PropTypes from 'prop-types';
import Input from 'antd/es/input';
import 'antd/es/input/style/index.js';

const { TextArea } = Input;

export const TextAreaInput = (props) => (
    <TextArea {...props} />
);

TextAreaInput.propTypes = {
    rows: PropTypes.number
};
