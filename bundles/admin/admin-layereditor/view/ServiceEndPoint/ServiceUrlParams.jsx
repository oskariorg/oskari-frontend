import React from 'react';
import PropTypes from 'prop-types';
import { styled } from 'styled-components';
import { Message, TextInput } from 'oskari-ui';
import { Table, ToolsContainer, getSorterFor } from 'oskari-ui/components/Table';
import { Controller } from 'oskari-ui/util';
import { IconButton } from 'oskari-ui/components/buttons';
import { ServiceUrlAddParam } from './ServiceUrlAddParam';

const ParamsTableContainer = styled('div')`
    margin-top: 0.5em;
`;

const BaseCell = styled('div')`
    display: flex;
    align-items: center;
    width: 100%;
`;

const ActionCell = styled(BaseCell)`
    justify-content: flex-end;
`;

export const ServiceUrlParams = ({ params = {}, disabled, controller }) => {
    const updateParams = (nextParams) => {
        controller.setValueForLayer('params', nextParams);
    };

    const onParamValueChange = (key, value) => {
        updateParams({
            ...params,
            [key]: value
        });
    };

    const onDeleteParam = (keyToDelete) => {
        const nextParams = { ...params };
        delete nextParams[keyToDelete];
        updateParams(nextParams);
    };

    const onAddParam = (key, value) => {
        updateParams({
            ...params,
            [key]: value
        });
    };

    const paramKeys = Object.keys(params);
    const dataSource = paramKeys.map(key => ({ key, value: params[key] }));
    const middleCell = () => ({
        style: { verticalAlign: 'middle' }
    });

    const columns = [
        {
            title: <Message messageKey='fields.params.key'/>,
            dataIndex: 'key',
            width: '35%',
            sorter: getSorterFor('key'),
            defaultSortOrder: 'ascend',
            onCell: middleCell,
            render: (key) => <BaseCell>{key}</BaseCell>
        },
        {
            title: <Message messageKey='fields.params.value'/>,
            dataIndex: 'value',
            onCell: middleCell,
            render: (value, record) => (
                <BaseCell>
                    <TextInput
                        disabled={disabled}
                        value={value === undefined || value === null ? '' : String(value)}
                        onChange={(evt) => onParamValueChange(record.key, evt.target.value)}
                    />
                </BaseCell>
            )
        },
        {
            dataIndex: 'key',
            width: '2.5em',
            onCell: middleCell,
            render: (key) => (
                <ActionCell>
                    <ToolsContainer>
                        <IconButton
                            type='delete'
                            disabled={disabled}
                            onClick={() => onDeleteParam(key)} />
                    </ToolsContainer>
                </ActionCell>
            )
        }
    ];

    return (
        <ParamsTableContainer>
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
            />
            <ServiceUrlAddParam
                disabled={disabled}
                params={params}
                onAdd={onAddParam} />
        </ParamsTableContainer>
    );
};

ServiceUrlParams.propTypes = {
    params: PropTypes.object,
    disabled: PropTypes.bool,
    controller: PropTypes.instanceOf(Controller).isRequired
};
