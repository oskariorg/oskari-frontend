import React from 'react';
import { TextInput, Message, Button } from 'oskari-ui';
import { Table } from 'oskari-ui/components/Table';
import { ButtonContainer } from 'oskari-ui/components/buttons';
import styled from 'styled-components';
import { StatisticalInfo } from './StatisticalInfo';
import { getRegionsets } from '../../helper/ConfigHelper';

const Content = styled('div')`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
`;
const StyledTable = styled(Table)`
    max-height: 475px;
    overflow-y: scroll;
`;

export const StatisticalData = ({ state, controller }) => {
    const { selection, regionset, dataByRegions } = state;
    const { name = '' } = getRegionsets().find(rs => rs.id === regionset) || {};
    const columnSettings = [
        {
            dataIndex: 'name',
            align: 'left',
            width: 250,
            title: <span><Message messageKey='parameters.regionset' />: {name}</span>
        },
        {
            dataIndex: 'value',
            align: 'left',
            width: 125,
            title: <span><Message messageKey='parameters.year' />: {selection}</span>,
            render: (title, item) => {
                return (
                    <TextInput
                        value={item.value}
                        onChange={(e) => controller.updateRegionValue(item.id, e.target.value)}
                    />
                );
            }
        }
    ];

    return (
        <Content>
            <StatisticalInfo state={state} controller={controller}/>
            { regionset && <StyledTable
                columns={columnSettings}
                dataSource={dataByRegions}
                pagination={false} />
            }
            <ButtonContainer>
                <Button onClick={() => controller.showClipboardPopup()} >
                    <Message messageKey='userIndicators.import.title' />
                </Button>
            </ButtonContainer>
        </Content>
    );
};
