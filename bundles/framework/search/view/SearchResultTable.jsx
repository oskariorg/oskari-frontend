import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Table, getSorterFor } from 'oskari-ui/components/Table';
import styled from 'styled-components';

const PointableTable = styled(Table)`
    tr {
        cursor: pointer;
    }
`;
/*
Example result.locations = [{
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
}, ...];
*/

const FIELDS = ['name', 'region', 'type'];
const noop = () => {};

export const SearchResultTable = ({ result = {}, onResultClick = noop }) => {
    if (!result || !result.locations || result.totalCount === 0) {
        return null;
    }
    const columns = FIELDS.map(key => ({
        title: <Message messageKey={`grid.${key}`} />,
        dataIndex: key,
        sorter: getSorterFor(key)
    }));

    // single result -> "click" immediately
    useEffect(() => {
        if (result.totalCount === 1) {
            onResultClick(result.locations[0]);
        }
    }, [result.locations]);
    return (<PointableTable
        rowKey="id"
        columns={columns}
        dataSource={result.locations}
        onRow={(record) => {
            return {
                onClick: () => onResultClick(record)
            };
        }}
        pagination={{ defaultPageSize: result.totalCount, hideOnSinglePage: true }} />);
};

SearchResultTable.propTypes = {
    result: PropTypes.object,
    onResultClick: PropTypes.func
};
