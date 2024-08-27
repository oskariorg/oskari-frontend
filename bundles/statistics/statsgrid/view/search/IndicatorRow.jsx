import React from 'react';
import { IconButton } from 'oskari-ui/components/buttons';
import { InfoCircleOutlined } from '@ant-design/icons';
import { IndicatorName } from '../IndicatorName';
import styled from 'styled-components';

const Row = styled('div')`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    word-break: break-all;
`;
const Actions = styled('div')`
    display: flex;
    flex-direction: row;
    margin-left: 10px;
`;
const RemoveButton = styled(IconButton)`
    margin-right: 10px;
`;

export const IndicatorRow = ({ indicator, removeIndicator, showMetadata }) => {
    return (
        <Row>
            <IndicatorName indicator={indicator} />
            <Actions>
                <RemoveButton
                    type='delete'
                    onClick={() => removeIndicator(indicator)}
                />
                <IconButton
                    icon={<InfoCircleOutlined />}
                    onClick={() => showMetadata(indicator)}
                />
            </Actions>
        </Row>
    );
};
