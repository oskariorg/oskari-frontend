import React from 'react';
import PropTypes from 'prop-types';
import Input from 'antd/lib/input';
import 'antd/lib/input/style/css';

const { TextArea } = Input;

export const TextAreaInput = (props) => (
    <TextArea {...props} />
);

TextAreaInput.propTypes = {
    rows: PropTypes.number
};
