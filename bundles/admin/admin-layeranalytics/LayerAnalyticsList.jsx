import React, { Fragment, useRef } from 'react';
import PropTypes from 'prop-types';
import { Table, getSorterFor } from 'oskari-ui/components/Table';
import { Message, Space, Spin, Tooltip, TextInput, Select, Option } from 'oskari-ui';
import { DeleteButton, PrimaryButton, SecondaryButton } from 'oskari-ui/components/buttons';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const TitleArea = styled.span`
    & {
        display: flex;
        justify-content: space-between;
    }
`;

const FilterContainer = styled('div')`
    padding: 10px;
`;

const FilterFields = styled('div')`
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
`;

const StyledSelect = styled(Select)`
    width: 200px;
`;

const SearchIcon = styled(SearchOutlined)`
    color: ${props => props.filtered ? '#3c3c3c' : '#bfbfbf'}
`;

const sorterTooltipOptions = {
    title: <Message messageKey='flyout.sorterTooltip' />
};

export const LayerAnalyticsList = ({ analyticsData, isLoading, layerEditorCallback, layerDetailsCallback, removeAnalyticsCallback }) => {
    const searchInput = useRef(null);
    const selectInput = useRef(null);

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <FilterContainer onKeyDown={(e) => e.stopPropagation()}>
            <FilterFields>
                {dataIndex === 'dataProducer' ? (
                    <StyledSelect
                        showSearch
                        ref={selectInput}
                        value={selectedKeys[0]}
                        onChange={(value) => {
                            setSelectedKeys(value ? [value] : []);
                            confirm({ closeDropdown: true })
                        }}
                    >
                        {analyticsData.filter((value, index) => analyticsData.findIndex(val => value.dataProducer === val.dataProducer) === index).map((data, index) => (
                            <Option key={index} value={data.dataProducer}>{data.dataProducer}</Option>
                        ))}
                    </StyledSelect>
                ) : (
                    <TextInput
                        ref={searchInput}
                        value={selectedKeys[0]}   
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm({ closeDropdown: true })}
                    />
                )}
            </FilterFields>
            <Space>
                {dataIndex !== 'dataProducer' && (
                    <PrimaryButton
                    type="search"
                    onClick={() => confirm({ closeDropdown: true })}
                    icon={<SearchOutlined />}
                    size="small"
                    />
                )}
                <SecondaryButton
                    type="reset"
                    onClick={() => clearFilters()}
                    size="small"
                />
            </Space>
          </FilterContainer>
        ),
        filterIcon: (filtered) => (
          <SearchIcon filtered={filtered} />
        ),
        onFilter: (value, record) =>
          record[dataIndex]
            .toString()
            .toLowerCase()
            .includes((value).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
          if (visible) {
            const ref = dataIndex === 'dataProducer' ? selectInput : searchInput;
            setTimeout(() => ref.current?.select(), 100);
          }
        },
        render: (text) => text
    });

    const columnSettings = [
        {
            align: 'left',
            title: 'ID',
            dataIndex: 'id',
            sortDirections: ['descend', 'ascend', 'descend'],
            sorter: getSorterFor('id'),
            showSorterTooltip: sorterTooltipOptions,
            ...getColumnSearchProps('id'),
            render: (title, item) => {
                return (
                    <TitleArea>
                        { title }
                    </TitleArea>
                );
            }
        },
        {
            align: 'left',
            title: <Message messageKey='flyout.idTitle' />,
            dataIndex: 'title',
            defaultSortOrder: 'ascend',
            sortDirections: ['descend', 'ascend', 'descend'],
            sorter: getSorterFor('title'),
            showSorterTooltip: sorterTooltipOptions,
            ...getColumnSearchProps('title'),
            render: (title, item) => {
                return (
                    <TitleArea>
                        <Tooltip title={ <Message messageKey='flyout.showDetailsTooltip' /> }>
                            <a onClick={ () => layerDetailsCallback(item.id) } >{ title }</a>
                        </Tooltip>
                    </TitleArea>
                );
            }
        },
        {
            align: 'left',
            title: <Message messageKey='flyout.layerDataProvider' />,
            dataIndex: 'dataProducer',
            defaultSortOrder: 'ascend',
            sortDirections: ['descend', 'ascend', 'descend'],
            sorter: getSorterFor('dataProducer'),
            showSorterTooltip: sorterTooltipOptions,
            ...getColumnSearchProps('dataProducer'),
            render: (title, item) => {
                return (<TitleArea>{ title }</TitleArea>);
            }
        },
        {
            align: 'left',
            title: 'Type',
            dataIndex: 'layerType',
            defaultSortOrder: 'ascend',
            sortDirections: ['descend', 'ascend', 'descend'],
            sorter: getSorterFor('layerType'),
            showSorterTooltip: sorterTooltipOptions,
            render: (title, item) => {
                return (<TitleArea>{ title }</TitleArea>);
            }
        },
        {
            align: 'left',
            title: <Message messageKey='flyout.totalDisplaysTitle' />,
            dataIndex: 'total',
            sortDirections: ['descend', 'ascend', 'descend'],
            sorter: (a, b) => a.total - b.total,
            showSorterTooltip: sorterTooltipOptions
        },
        {
            align: 'left',
            title: <Message messageKey='flyout.failurePercentage' />,
            dataIndex: 'failurePercentage',
            sortDirections: ['descend', 'ascend', 'descend'],
            sorter: (a, b, sortOrder) => {
                const rate = a.failurePercentage - b.failurePercentage;
                if (rate !== 0) {
                    return rate;
                }
                if (sortOrder === 'ascend') {
                    // most used, least failures
                    return b.total - a.total;
                }
                // most used, most failures
                return a.total - b.total;
            },
            showSorterTooltip: sorterTooltipOptions,
            render: (title) => <Fragment>{ title }%</Fragment>
        },
        {
            align: 'left',
            key: 'tools',
            render: (title, item) => {
                return (
                    <React.Fragment>
                        <TitleArea>
                            <Space>
                                <Tooltip title={ <Message messageKey='flyout.editLayerTooltip' /> }>
                                    <EditOutlined onClick={ () => layerEditorCallback(item.id) } />
                                </Tooltip>
                                <DeleteButton
                                    type='icon'
                                    title={<Message messageKey='flyout.removeAllDataForLayer' />}
                                    onConfirm={() => removeAnalyticsCallback(item.id)}/>
                            </Space>
                        </TitleArea>
                    </React.Fragment>
                );
            }
        }
    ];

    if (isLoading) {
        return ( <Spin/> );
    }

    return (
        <Table
            columns={ columnSettings }
            size={ 'large' }
            dataSource={ analyticsData.map(item => {
                return {
                    key: item.id,
                    ...item
                };
            }) }
            pagination={{ position: ['none', 'bottomCenter'] }}
        />
    );
};

LayerAnalyticsList.propTypes = {
    analyticsData: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    layerEditorCallback: PropTypes.func.isRequired,
    layerDetailsCallback: PropTypes.func.isRequired,
    removeAnalyticsCallback: PropTypes.func.isRequired
};
