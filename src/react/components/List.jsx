import React from 'react';
import PropTypes from 'prop-types';
import { List as AntList } from 'antd';
import 'antd/es/list/style/index.js';

export const List = ({ header, footer, dataSource, bordered, renderItem }) => {
    return (
        <AntList
            header={header}
            footer={footer}
            bordered={bordered}
            dataSource={dataSource}
            renderItem={renderItem}
        />
    );
};

export const ListItem = ({ children, ...other }) => (
    <AntList.Item {...other}>
        {children}
    </AntList.Item>
);

List.propTypes = {
    header: PropTypes.string,
    footer: PropTypes.string,
    dataSource: PropTypes.array,
    bordered: PropTypes.bool,
    renderItem: PropTypes.func
};

ListItem.propTypes = {
    children: PropTypes.any
};
