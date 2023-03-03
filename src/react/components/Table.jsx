import React from 'react';
import { Table as AntTable } from 'antd';
import 'antd/es/table/style/index.js';
import { getMsg } from '../util/locale';
import styled from 'styled-components';

const StyledToolsContainer = styled('div')`
    display: flex;
    justify-content: space-evenly;
    .icon {
        cursor: pointer;
    }
    a {
        cursor: pointer;
    }
    button {
        width: 24px;
        height: 24px;
    }
`;

// AntD defines overflow-wrap: break word for tr td
// but for some reason we still need word-break so long texts in the table don't break layout
// For narrow columns sorter icon might get stuck to label -> add margin for column sorter
const StyledTable = styled(AntTable)`
    tr td {
        word-break: break-word;
    }
    a {
        cursor: pointer;
    }
    .ant-table-column-sorter {
        margin: 0 0 0 5px;
    }
`;

export const getSorterFor = key => (a, b) => Oskari.util.naturalSort(a[key], b[key]);

/*
 * AntD has it's own localization but we don't want to package all the translations
 * in an app but just the ones used with it. This can be done by getting the translations
 * from Oskari and passing a locale prop for AntD table:
 *
 * - https://github.com/ant-design/ant-design/blob/master/components/locale/fi_FI.tsx
 * - https://github.com/ant-design/ant-design/pull/33372
 */
export const Table = ({ size = 'small', ...other }) => {
    const locale = {
        triggerDesc: getMsg('table.sort.desc'), // 'Click to sort descending',
        triggerAsc: getMsg('table.sort.asc'), //'Click to sort ascending',
        cancelSort: getMsg('table.sort.cancel'), // 'Click to cancel sorting',
        emptyText: getMsg('table.emptyText') // Show when table is empty
    };
    return (<StyledTable locale={locale} size={size} {...other} />);
};

export const ToolsContainer = ({ children }) => {
    return (
        <StyledToolsContainer className='t_table t_tools'>
            {children}
        </StyledToolsContainer>
    )
};
