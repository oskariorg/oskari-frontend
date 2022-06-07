import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Checkbox, Message, Pagination, Link } from 'oskari-ui';

import { SecondaryButton, PrimaryButton } from 'oskari-ui/components/buttons';

const StyledPagination = styled(Pagination)`
    li.ant-pagination-next {
        min-width: 0;
    }
`;

const ActionContainer = styled('div')`
    display: flex;
    flex-direction: inherit;
    align-items: end;
`;



const itemRender = (current, type, originalElement) => {
    if (type === 'prev') {
        return <SecondaryButton type='previous'/>;
    }
    if (type === 'next') {
        return isLast ? null : <PrimaryButton type='next' style={{ color: '#ffffff' }}/>;
    }
    return originalElement;
};
export const PaginatedControls = ({controller, current, count}) => {
    const isLast = current === count;

    const onPageChange = (page) => onPageChange(page);
    return (
        <ActionContainer>
            <StyledPagination current={currentBanner} total={count} defaultPageSize={1} hideOnSinglePage onChange={onPageChange} itemRender={itemRender}/>
                {isLast && <PrimaryButton type='close' onClick={() => onClose()}/>}
        </ActionContainer>
)
};
