import React from 'react';
import { AdvancedSearchInputLabel, AdvancedSearchRowContainer } from './AdvancedSearchStyledComponents';

export const AdvancedSearchKeyword = (props) => {
    return <AdvancedSearchRowContainer>
        <AdvancedSearchInputLabel>Lorem Ipsum</AdvancedSearchInputLabel>
        <input type='text'/>
    </AdvancedSearchRowContainer>;
};
