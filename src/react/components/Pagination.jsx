import React from 'react';
import { Pagination as AntPagination } from 'antd';

export const Pagination = ({ children, ...other}) => (
    <AntPagination { ...other }>
        { children }
    </AntPagination>
);
