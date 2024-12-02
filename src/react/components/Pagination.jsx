import React from 'react';
import { Pagination as AntPagination } from 'antd';

// No tooltip localization default to showTitle false
export const Pagination = ({ children, showTitle = false, ...other}) => (
    <AntPagination showTitle={showTitle} { ...other }>
        { children }
    </AntPagination>
);
