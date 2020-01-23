import React from 'react';
import { Steps } from 'oskari-ui';
import styled from 'styled-components';

export { StyledAlert } from '../styled';

export const Header = styled('h4')``;
export const Paragraph = styled('p')``;

const StepsWrapper = styled('div')`
    margin-top: 10px;
    margin-bottom: 10px;
`;
export const StyledSteps = props => <StepsWrapper><Steps {...props}/></StepsWrapper>;
