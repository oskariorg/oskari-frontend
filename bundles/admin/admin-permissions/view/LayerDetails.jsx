import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Message, Tooltip, Button, Link } from 'oskari-ui';
import { IconButton } from 'oskari-ui/components/buttons';
import { Table, getSorterFor } from 'oskari-ui/components/Table';
import { MetadataIcon } from 'oskari-ui/components/icons';
import styled from 'styled-components';

const StyledTable = styled(Table)`
    width: 1600px;
    margin-bottom: 20px;
`;
const LayerName = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const TYPES = ['wms', 'wmts', 'wfs', 'arcgis', 'vectortile', 'bingmaps', 'tiles3d'];
const VERSIONS = ['1.0.0', '1.1.0', '1.3.0', '2.0.0', '3.0.0'];
const MISSING = {
    LOC: 'localization',
    METADATA: 'metadata',
    LEGEND: 'legend',
    SCALE: 'scale'
};
const missingFilter = (value, item) => {
    const { locale, min, max } = item;
    if (value === MISSING.LOC) {
        const langs = Oskari.getSupportedLanguages();
        return langs.every(lang => locale[lang]?.length > 0);
    }
    if (value === MISSING.SCALE) {
        return min > -1 && max > -1 && min >= max;
    }
    return !item[value];
};

export const LayerDetails = ({ controller, state }) => {
    const { layerDetails, pagination, loading, dataProviders } = state;

    const [filter, setFilter] = useState({});
    const dataSource = layerDetails;

    const general = [{
        title: <Message messageKey='flyout.layer.name' />,
        width: '15em',
        dataIndex: 'name',
        sorter: getSorterFor('name'),
        filters: Object.values(MISSING).map(value => ({ value, text: <Message messageKey={`flyout.layer.filter.${value}`} /> })),
        filteredValue: filter.name,
        filterMultiple: false,
        onFilter: missingFilter,
        render: (title, item) => (
            <Tooltip title={`ID: ${item.id}`}>
                <LayerName>
                    <IconButton type='add' onClick={() => controller.addLayer(item.id)} title={null}/>
                    <Button type='link' onClick={() => controller.editLayer(item.id)}>{title}</Button>
                </LayerName>
            </Tooltip>
        )
    }, {
        title: <Message messageKey='flyout.layer.type' />,
        width: '5em',
        dataIndex: 'type',
        filters: TYPES.map(value => ({ value, text: value })),
        filteredValue: filter.type,
        onFilter: (value, item) => item.type === value
    }, {
        title: <Message messageKey='flyout.layer.version' />,
        width: '5em',
        dataIndex: 'version',
        filters: VERSIONS.map(value => ({ value, text: value })),
        filteredValue: filter.version,
        onFilter: (value, item) => item.version === value
    }];
    // TODO: for now has only default lang locale. Fetch data from backend and remove filter
    const locales = Oskari.getSupportedLanguages().filter(lang => lang === Oskari.getLang()).map(lang => ({
        title: <Message messageKey={`flyout.layer.${lang}`} />,
        maxWidth: '15em',
        dataIndex: lang,
        sorter: getSorterFor(lang)
    }));

    const details = [{
        title: 'Url',
        width: '20em',
        dataIndex: 'url',
        sorter: getSorterFor('url'),
        filters: [{ value: 'http:', text: 'HTTP' }],
        filteredValue: filter.url,
        filterMultiple: false,
        onFilter: (value, item) => item.url && item.url.startsWith(value)
    }, {
        title: <Message messageKey='flyout.layer.provider' />,
        width: '5em',
        dataIndex: 'providerId',
        filters: dataProviders.map(dp => ({ value: dp.id, text: dp.name })),
        filteredValue: filter.providerId,
        filterMultiple: false,
        onFilter: (value, item) => item.providerId === value,
        render: id => <Tooltip title={dataProviders.find(dp => dp.id === id)?.name}>{id}</Tooltip>
    }, {
        title: <Message messageKey='flyout.layer.groups' />,
        width: '5em',
        dataIndex: 'groups',
        render: groups => groups.map(g => <Tooltip key={g.id} title={g.name}>{g.id}</Tooltip>)
    }, {
        title: 'Min',
        width: '3em',
        dataIndex: 'min',
        render: min => min < 0 ? null : min
    }, {
        title: 'Max',
        width: '3em',
        dataIndex: 'max',
        render: max => max < 0 ? null : max
    }, {
        title: <Message messageKey='flyout.layer.opacity' />,
        width: '5em',
        dataIndex: 'opacity'
    }, {
        title: 'Metadata',
        width: '5em',
        dataIndex: 'metadata',
        render: (uuid, item) => uuid ? <Tooltip title={uuid}><MetadataIcon metadataId={uuid} layerId={item.id} /></Tooltip> : null
    }, {
        title: <Message messageKey='flyout.layer.legend' />,
        width: '5em',
        dataIndex: 'legend',
        render: url => url ? <Link url={url} /> : null
    }];

    const columnSettings = [...general, ...locales, ...details];
    return (
        <div>
            <StyledTable
                columns={columnSettings}
                dataSource={dataSource}
                pagination={{
                    pageSize: pagination.pageSize,
                    hideOnSinglePage: true,
                    simple: true,
                    showSizeChanger: false,
                    current: pagination.page,
                    onChange: (page, pageSize) => controller.setPagination({ page, pageSize })
                }}
                onChange={(pagination, filter) => setFilter(filter)}
                scroll={{ x: 800 }}
                loading={loading}/>
        </div>
    );
};
LayerDetails.propTypes = {
    controller: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired
};
