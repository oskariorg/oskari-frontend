import React from 'react';
import { Spin } from 'oskari-ui';
import styled from 'styled-components';

const SpinnerHolder = styled('div')`
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const Spinner = () =>
    <SpinnerHolder>
        <Spin size="large"/>
    </SpinnerHolder>;
