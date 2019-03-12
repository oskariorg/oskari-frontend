import React from 'react';
import PropTypes from 'prop-types';
import Input from 'antd/lib/input';

export const TextAreaInput = (props) => {
    const { TextArea } = Input;
    // TODO handle case where rows is not declared
    return (
        <TextArea {...props} />
    );
};

TextAreaInput.propTypes = {
    rows: PropTypes.number
};
