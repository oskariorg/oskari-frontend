import React from 'react';
import { Steps } from 'oskari-ui';
import styled from 'styled-components';
import { StyledAlert, StyledButton } from '../styled';

export { StyledAlert, StyledButton };

export const Header = styled('h4')``;
export const Paragraph = styled('p')``;

export const DangerButton = styled(StyledButton)`
    border-color: #da5151;
    background-color: #fff1f1;
`;

const StepsWrapper = styled('div')`
    margin-top: 10px;
    margin-bottom: 10px;
`;
export const StyledSteps = props => <StepsWrapper><Steps {...props}/></StepsWrapper>;
