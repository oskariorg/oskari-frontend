import React from 'react';
import PropTypes from 'prop-types';
import { StarTwoTone } from '@ant-design/icons';

const base = {
    verticalAlign: '-0.25em',
    paddingLeft: '0.5em'
};

export const Mandatory = ({isValid, style = {}}) => (
    <StarTwoTone twoToneColor={isValid ? '#52c41a' : '#da5151'} style={{ ...base, ...style }} />
);

Mandatory.propTypes = {
    isValid: PropTypes.bool.isRequired,
    style: PropTypes.object
};
