import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from 'styled-components';
import { Badge, Button, Message, TextInput } from 'oskari-ui';
import { Table, ToolsContainer } from 'oskari-ui/components/Table';
import { Controller } from 'oskari-ui/util';
import { IconButton } from 'oskari-ui/components/buttons';

const ParamsToggleContainer = styled('div')`
    margin-bottom: 0.5em;
`;

const ParamsTableContainer = styled('div')`
    margin-top: 0.5em;
`;

export const ServiceUrlParams = ({ params = {}, disabled, controller }) => {
    const [showParams, setShowParams] = useState(false);

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

    const paramKeys = Object.keys(params);
    const dataSource = paramKeys.map(key => ({ key, value: params[key] }));

    const columns = [
        {
            title: 'Key',
            dataIndex: 'key',
            width: '35%'
        },
        {
            title: 'Value',
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
        <>
            <ParamsToggleContainer>
                <Badge count={paramKeys.length}>
                    <Button
                        onClick={() => setShowParams(!showParams)}
                        disabled={disabled}>
                        <Message messageKey='jsonTab.fields.params'/>
                    </Button>
                </Badge>
            </ParamsToggleContainer>
            {showParams && (
                <ParamsTableContainer>
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                    />
                </ParamsTableContainer>
            )}
        </>
    );
};

ServiceUrlParams.propTypes = {
    params: PropTypes.object,
    disabled: PropTypes.bool,
    controller: PropTypes.instanceOf(Controller).isRequired
};
