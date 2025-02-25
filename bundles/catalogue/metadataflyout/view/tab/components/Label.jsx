import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message } from 'oskari-ui';

const Styled = styled.h2``;
const StyledSub = styled.h3``;

export const Label = ({ labelKey }) => <Styled><Message messageKey={`flyout.label.${labelKey}`} /></Styled>;

Label.propTypes = {
    labelKey: PropTypes.string.isRequired
};

export const SubLabel = ({ labelKey }) => <StyledSub><Message messageKey={`flyout.label.${labelKey}`} /></StyledSub>;

SubLabel.propTypes = {
    labelKey: PropTypes.string.isRequired
};
