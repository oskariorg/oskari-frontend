import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Pagination, Checkbox, Divider } from 'oskari-ui';
import { SecondaryButton, PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { Controller } from 'oskari-ui/util';
import { AnnouncementsContent } from '../';

const StyledPagination = styled(Pagination)`
    li.ant-pagination-next {
        min-width: 0;
    }
`;

export const PaginatedContent = ({
    announcement,
    controller,
    count,
    current,
    dontShowAgain,
    onClose
}) => {
    const onCheckboxChange = (e) => controller.setShowAgain(announcement.id, e.target.checked);
    const onPageChange = (page) => controller.onPopupChange(page);
    const isLast = current === count;

    const itemRender = (current, type, originalElement) => {
        if (type === 'prev') {
            return <SecondaryButton type='previous'/>;
        }
        if (type === 'next') {
            return isLast ? null : <PrimaryButton type='next' style={{ color: '#ffffff' }}/>;
        }
        return originalElement;
    };

    return (
        <Fragment>
            <AnnouncementsContent announcement={announcement}/>
            <Divider/>
            <Checkbox checked={dontShowAgain} onChange={onCheckboxChange}>
                <Message messageKey='dontShow'/>
            </Checkbox>
            <ButtonContainer>
                <StyledPagination current={current} total={count} defaultPageSize={1} hideOnSinglePage onChange={onPageChange} itemRender={itemRender}/>
                {isLast && <PrimaryButton type='close' onClick={() => onClose()}/>}
            </ButtonContainer>
        </Fragment>
    );
};
PaginatedContent.propTypes = {
    announcement: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    count: PropTypes.number.isRequired,
    current: PropTypes.number.isRequired,
    dontShowAgain: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};
