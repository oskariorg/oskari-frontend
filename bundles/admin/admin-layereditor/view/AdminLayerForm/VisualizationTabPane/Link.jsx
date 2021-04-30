import React from 'react';
import PropTypes from 'prop-types';
import { SelectOutlined } from '@ant-design/icons';

export const Link = ({ url }) => (
    <a href={url} rel="noreferrer noopener" target="_blank" >
        <SelectOutlined/>
    </a>
);
Link.propTypes = {
    url: PropTypes.string.isRequired
};
