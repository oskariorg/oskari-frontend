import React from 'react';
import PropTypes from 'prop-types';
import { StarTwoTone } from '@ant-design/icons';

export const Mandatory = ({isValid, style = {}}) => (
    <StarTwoTone twoToneColor={isValid ? '#52c41a' : '#da5151'} style={{ ...style }} />
);

Mandatory.propTypes = {
    isValid: PropTypes.bool.isRequired,
    style: PropTypes.object
};
