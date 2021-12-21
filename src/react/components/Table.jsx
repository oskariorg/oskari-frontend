import React from 'react';
import { Table as AntTable } from 'antd';
import 'antd/es/table/style/index.js';

export const getSorterFor = key => (a, b) => Oskari.util.naturalSort(a[key], b[key]);

/*
 * AntD has it's own localization but we don't want to package all the translations
 * in an app but just the ones used with it. This can be done by getting the translations
 * from Oskari and passing a locale prop for AntD table:
 *
 * - https://github.com/ant-design/ant-design/blob/master/components/locale/fi_FI.tsx
 * - https://github.com/ant-design/ant-design/pull/33372
 */
const LOCALE_BUNDLE = 'oskariui';
const getMsg = (key) => Oskari.getMsg(LOCALE_BUNDLE, key);

export const Table = ({ ...other }) => {
    const locale = {
        triggerDesc: getMsg('grid.sort.desc'), // 'Click to sort descending',
        triggerAsc: getMsg('grid.sort.asc'), //'Click to sort ascending',
        cancelSort: getMsg('grid.sort.cancel') // 'Click to cancel sorting'
    };
    return (<AntTable locale={locale} {...other} />);
};
