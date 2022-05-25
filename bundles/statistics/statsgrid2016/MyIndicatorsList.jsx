import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Button } from 'oskari-ui';
import { Table, ToolsContainer, getSorterFor } from 'oskari-ui/components/Table';
import { DeleteButton } from 'oskari-ui/components/buttons';
import { EditIcon } from 'oskari-ui/components/icons';
import styled from 'styled-components';

const BUNDLE_KEY = 'StatsGrid';

const ButtonContainer = styled.div`
    margin: 10px 0 10px 0;
    display: flex;
    justify-content: flex-end;
`;

export const MyIndicatorsList = ({ controller, data = [], loading }) => {
    const columnSettings = [
        {
            dataIndex: 'name',
            align: 'left',
            title: <Message messageKey='tab.grid.name' bundleKey={BUNDLE_KEY} />,
            sorter: getSorterFor('name'),
            defaultSortOrder: 'ascend'
        },
        {
            dataIndex: 'created',
            align: 'left',
            title: <Message messageKey='tab.grid.createDate' bundleKey={BUNDLE_KEY} />,
            sorter: getSorterFor('created'),
            render: title => Oskari.util.formatDate(title)
        },
        {
            dataIndex: 'id',
            align: 'left',
            title: <Message messageKey='tab.grid.actions' bundleKey={BUNDLE_KEY} />,
            width: 100,
            render: (title, item) => {
                return (
                    <ToolsContainer>
                        <EditIcon onClick={() => controller.editIndicator(item)} />
                        <DeleteButton icon
                            title={<Message messageKey='tab.popup.deletemsg' messageArgs={{ name: item.name }} bundleKey={BUNDLE_KEY} />}
                            onConfirm={() => controller.deleteIndicator(item)}/>
                    </ToolsContainer>
                );
            }
        }
    ];

    return (
        <Fragment>
            <ButtonContainer>
                <Button type='primary' onClick={() => controller.addNewIndicator()}>
                    <Message bundleKey={BUNDLE_KEY} messageKey='userIndicators.buttonTitle' />
                </Button>
            </ButtonContainer>
            <Table
                columns={columnSettings}
                dataSource={data.map(item => ({
                    key: item.id,
                    ...item
                }))}
                pagination={false}
                loading={loading}
            />
        </Fragment>
    );
};

MyIndicatorsList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    controller: PropTypes.object.isRequired,
    loading: PropTypes.bool
};
