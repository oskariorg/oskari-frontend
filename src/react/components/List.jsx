import React from 'react';
import PropTypes from 'prop-types';
import { List as AntList } from 'antd';

export const List = (props) => <AntList { ...props } />

export const ListItem = ({ children, ...other }) => (
    <AntList.Item {...other}>
        {children}
    </AntList.Item>
);

List.propTypes = {
    header: PropTypes.any,
    footer: PropTypes.any,
    dataSource: PropTypes.array,
    bordered: PropTypes.bool,
    renderItem: PropTypes.func
};

ListItem.propTypes = {
    children: PropTypes.any
};
