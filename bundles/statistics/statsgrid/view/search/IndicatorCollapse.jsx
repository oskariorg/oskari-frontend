import React from 'react';
import PropTypes from 'prop-types';
import { Message, Collapse, CollapsePanel } from 'oskari-ui';
import { DeleteButton } from 'oskari-ui/components/buttons';
import { IndicatorRow } from './IndicatorRow';
import styled from 'styled-components';

const StyledCollapse = styled(Collapse)`
    margin-top: 20px;
`;
const RemoveAll = styled(DeleteButton)`
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
`;

export const IndicatorCollapse = ({ indicators = [], removeIndicator, removeAll, showMetadata }) => {
    return (
        <StyledCollapse>
            <CollapsePanel
                header={<Message messageKey='indicatorList.title' />}
            >
                { !indicators.length && (<Message messageKey='indicatorList.emptyMsg' />) }
                {
                    indicators.map((indicator) => (
                        <IndicatorRow key={indicator.hash} indicator={indicator} removeIndicator={removeIndicator} showMetadata={showMetadata}/>
                    ))
                }
                { indicators.length > 1 &&
                    <RemoveAll type='button'
                        tooltip={<Message messageKey='indicatorList.removeAll' />}
                        title={<Message messageKey='indicatorList.removeAll' />}
                        onConfirm={() => removeAll()}/>
                }
            </CollapsePanel>
        </StyledCollapse>
    );
};

IndicatorCollapse.propTypes = {
    indicators: PropTypes.array,
    removeIndicator: PropTypes.func.isRequired,
    removeAll: PropTypes.func.isRequired,
    showMetadata: PropTypes.func.isRequired
};
