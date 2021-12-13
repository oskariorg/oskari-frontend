import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Table } from 'antd';
import 'antd/es/table/style/index.js';
import styled from 'styled-components';

const PTI_YELLOW = '#fdf8d9';

const PointableTable = styled(Table)`
    thead {
        tr {
            background-color: ${PTI_YELLOW};
        }
    }
    tr {
        cursor: pointer;
        :hover {
            background-color: ${PTI_YELLOW};
        }
    }
`;
const noop = () => {};
export const SearchResultTable = ({ result = {}, onResultClick = noop }) => {
    
    if (!result || !result.locations || result.totalCount === 0) {
        return null;
    }
    const columns = [
        {
            title: <Message messageKey='grid.name' />,
            dataIndex: 'name',
            sorter: (a, b) => Oskari.util.naturalSort(a.name, b.name)
        },
        {
            title: <Message messageKey='grid.region' />,
            dataIndex: 'region',
            sorter: (a, b) => Oskari.util.naturalSort(a.region, b.region)
        },
        {
            title: <Message messageKey='grid.type' />,
            dataIndex: 'type',
            sorter: (a, b) => Oskari.util.naturalSort(a.type, b.type)
        }
    ];
    const data = result.locations.map(item => ({
        key: item.id,
        ...item
    })); 
    /*[
    {
      "zoomScale": 4000000,
      "paikkatyyppi": "Hallinto ja julkiset palvelut",
      "name": "Tampere",
      "rank": -1,
      "lon": 327629.273,
      "id": "10581718",
      "source": "geographic-names",
      "type": "Kunta",
      "region": "Tampere",
      "lat": 6822513.158,
      "channelId": "NLSFI_GEOCODING"

        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
    ];
    */
    return (<PointableTable
        columns={columns}
        dataSource={data}
        showSorterTooltip={false}
        onRow={(record, rowIndex) => {
            return {
              onClick: () => onResultClick(record)
            };
          }}
          pagination={{defaultPageSize: 50, hideOnSinglePage: true}} />);
};

SearchResultTable.propTypes = {
    result: PropTypes.object,
    onResultClick: PropTypes.func
};
