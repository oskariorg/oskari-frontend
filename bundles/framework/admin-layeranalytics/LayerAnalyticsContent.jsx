import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { LocaleConsumer } from 'oskari-ui/util';
import { Message } from 'oskari-ui';

const columnSettings = [
    {
        align: 'left',
        title: <Message messageKey='flyout.idTitle' />,
        dataIndex: 'id',
        key: 'id',
        // eslint-disable-this-line react/display-name
        render: text => <a>{text}</a>
    },
    {
        align: 'left',
        title: <Message messageKey='flyout.successTitle' />,
        dataIndex: 'success',
        key: 'success'
    },
    {
        align: 'left',
        title: <Message messageKey='flyout.failureTitle' />,
        dataIndex: 'errors',
        key: 'errors'
    }
];

const LayerAnalyticsContent = ({ analyticsData }) => {
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

const contextWrap = LocaleConsumer(LayerAnalyticsContent);
export { contextWrap as LayerAnalyticsContent };
