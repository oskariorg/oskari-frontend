import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Spin } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import { BUNDLE_KEY } from '../constants';

const Content = styled.div`
    max-width: 700px;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
`;

export const FlyoutContent = ({ state, children }) => {
    const { indicators, activeIndicator, loading } = state;
    const current = indicators.find(ind => ind.hash === activeIndicator);

    const Component = (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
             <Content>
                {current ? children : <Message messageKey='statsgrid.noResults' />}
             </Content>
        </LocaleProvider>
    );
    
    if (loading) {
        return <Spin showTip={true}>{Component}</Spin>;
    }
    return Component;
};

FlyoutContent.propTypes = {
    state: PropTypes.object.isRequired
};
