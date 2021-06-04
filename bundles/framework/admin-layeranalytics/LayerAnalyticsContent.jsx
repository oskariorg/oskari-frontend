import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

const columnSettings = [
    {
        align: 'left',
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
        // eslint-disable-this-line react/display-name
        render: text => <a>{text}</a>
    },
    {
        align: 'left',
        title: 'Success',
        dataIndex: 'success',
        key: 'success'
    },
    {
        align: 'left',
        title: 'Errors',
        dataIndex: 'errors',
        key: 'errors'
    }
];

export const LayerAnalyticsContent = ({ analyticsData }) => {
    return (
        <Table
            columns={ columnSettings }
            dataSource={ analyticsData }
            pagination={{ position: ['none', 'none'] }}
        />
    );
};

LayerAnalyticsContent.propTypes = {
    analyticsData: PropTypes.array.isRequired
};
