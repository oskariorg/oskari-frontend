import React from 'react';
import { Alert, Steps } from 'oskari-ui';
import styled from 'styled-components';

export const Header = styled('h4')``;
export const Paragraph = styled('p')``;
export const StyledAlert = styled(Alert)`;
    margin-bottom: 5px;
`;

const StepsWrapper = styled('div')`
    margin-top: 10px;
    margin-bottom: 10px;
`;
export const StyledSteps = props => <StepsWrapper><Steps {...props}/></StepsWrapper>;
