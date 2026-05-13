import React from 'react';
import PropTypes from 'prop-types';
import { styled } from 'styled-components';
import { Badge, Button, Message, TextInput } from 'oskari-ui';
import { Table, ToolsContainer, getSorterFor } from 'oskari-ui/components/Table';
import { Controller } from 'oskari-ui/util';
import { IconButton } from 'oskari-ui/components/buttons';
import { ServiceUrlAddParam } from './ServiceUrlAddParam';

const ParamsToggleContainer = styled('div')`
    margin-bottom: 0.5em;
`;

export const ParamsToggle = ({ count, open, disabled, onClick }) => (
    <ParamsToggleContainer>
        <Badge count={count}>
            <Button onClick={onClick} disabled={disabled}>
                <Message messageKey={open ? 'fields.params.hide' : 'fields.params.show'}/>
            </Button>
        </Badge>
    </ParamsToggleContainer>
);

ParamsToggle.propTypes = {
    count: PropTypes.number,
    open: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func
};

const ParamsTableContainer = styled('div')`
    margin-top: 0.5em;
`;

export const ServiceUrlParams = ({ params = {}, open, disabled, controller }) => {
    if (!open) {
        return null;
    }

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

    const columns = [
        {
            title: <Message messageKey='fields.params.key'/>,
            dataIndex: 'key',
            width: '35%',
            sorter: getSorterFor('key'),
            defaultSortOrder: 'ascend'
        },
        {
            title: <Message messageKey='fields.params.value'/>,
            dataIndex: 'value',
            render: (value, record) => (
                <TextInput
                    disabled={disabled}
                    value={value === undefined || value === null ? '' : String(value)}
                    onChange={(evt) => onParamValueChange(record.key, evt.target.value)}
                />
            )
        },
        {
            dataIndex: 'key',
            width: '2.5em',
            render: (key) => (
                <ToolsContainer>
                    <IconButton
                        type='delete'
                        disabled={disabled}
                        onClick={() => onDeleteParam(key)} />
                </ToolsContainer>
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
    open: PropTypes.bool,
    disabled: PropTypes.bool,
    controller: PropTypes.instanceOf(Controller).isRequired
};
