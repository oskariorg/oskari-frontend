import React from 'react';
import PropTypes from 'prop-types';
import { Message, Collapse } from 'oskari-ui';
import { IconButton } from 'oskari-ui/components/buttons';
import { IndicatorRow } from './IndicatorRow';
import styled from 'styled-components';

const StyledCollapse = styled(Collapse)`
    margin-top: 20px;
`;
const RemoveAll = styled(IconButton)`
    height: 20px;
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
    if (indicators.length < 2) {
        return null;
    }
    return (
        <div onClick={e => e.stopPropagation()}>
            <RemoveAll
                type='delete'
                confirmTitle={<Message messageKey='indicatorList.removeAll' />}
                title={<Message messageKey='indicatorList.removeAll' />}
                onConfirm={() => removeAll()}/>
        </div>
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
