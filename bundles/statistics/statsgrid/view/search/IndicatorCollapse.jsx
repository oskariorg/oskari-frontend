import React from 'react';
import PropTypes from 'prop-types';
import { Message, Collapse, Badge } from 'oskari-ui';
import { IconButton } from 'oskari-ui/components/buttons';
import { IndicatorRow } from './IndicatorRow';
import styled from 'styled-components';

const StyledCollapse = styled(Collapse)`
    margin-top: 20px;
`;
const Extra = styled.div`
    height: 20px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    > * {
        margin-left: 5px;
    }
`;

const Content = ({ indicators = [], removeIndicator, showMetadata }) => {
    if (!indicators.length) {
        return <Message messageKey='indicatorList.emptyMsg' />;
    }
    return indicators.map(indicator =>
        <IndicatorRow
            key={indicator.hash}
            indicator={indicator}
            removeIndicator={removeIndicator}
            showMetadata={showMetadata}/>
    );
};
Content.propTypes = {
    indicators: PropTypes.array,
    removeIndicator: PropTypes.func.isRequired,
    showMetadata: PropTypes.func.isRequired
};

const PanelExtra = ({ indicators = [], removeAll }) => {
    const showDelete = indicators.length !== 0;
    return (
        <Extra onClick={e => e.stopPropagation()}>
            { showDelete && <IconButton
                type='delete'
                iconSize={18}
                confirm={{ title: <Message messageKey='indicatorList.removeAll' /> }}
                title={<Message messageKey='indicatorList.removeAll' />}
                onConfirm={() => removeAll()}/>
            }
            <Badge count={indicators.length}/>
        </Extra>
    );
};
PanelExtra.propTypes = {
    removeAll: PropTypes.func.isRequired,
    indicators: PropTypes.array
};

export const IndicatorCollapse = (props) => {
    const item = {
        key: 'indicators',
        label: <Message messageKey='indicatorList.title' />,
        extra: <PanelExtra { ...props } />,
        children: <Content { ...props } />
    };
    return <StyledCollapse items={[item]} />;
};
