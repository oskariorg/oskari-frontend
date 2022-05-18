
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { showPopup } from 'oskari-ui/components/window';
import { Message, Pagination, Checkbox, Divider } from 'oskari-ui';
import { Controller, LocaleProvider } from 'oskari-ui/util';
import { SecondaryButton, PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { AnnouncementsContent } from './';
import { BUNDLE_KEY } from './Constants';

// Pop-up functionality for announcements

const Content = styled.div`
    margin: 12px 24px 24px;
    min-width: 300px;
`;

const StyledPagination = styled(Pagination)`
    li.ant-pagination-next {
        min-width: 0;
    }
`;

const Announcement = ({
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
            <ButtonContainer left>
                <StyledPagination current={current} total={count} defaultPageSize={1} hideOnSinglePage onChange={onPageChange} itemRender={itemRender}/>
                {isLast && <PrimaryButton type='close' onClick={() => onClose()}/>}
            </ButtonContainer>
        </Fragment>
    );
};

Announcement.propTypes = {
    announcement: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    count: PropTypes.number.isRequired,
    current: PropTypes.number.isRequired,
    dontShowAgain: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

const getContent = (state, controller, onClose) => {
    const { showAsPopup, currentPopup = 1 } = state;
    const announcement = showAsPopup[currentPopup - 1];
    if (!announcement) {
        return null;
    }
    const dontShowAgain = state.dontShowAgain.includes(announcement.id);
    const { title } = Oskari.getLocalized(announcement.locale);
    const content = (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <Content>
                <Announcement
                    controller={controller}
                    announcement={announcement}
                    count={showAsPopup.length}
                    current={currentPopup}
                    dontShowAgain={dontShowAgain}
                    onClose={onClose} />
            </Content>
        </LocaleProvider>
    );
    return { title, content };
};

export const showAnnouncementsPopup = (state, controller, onClose) => {
    const { title, content } = getContent(state, controller, onClose);
    const controls = showPopup(title, content, onClose, { id: BUNDLE_KEY });
    return {
        ...controls,
        update: (state) => {
            const { title, content } = getContent(state, controller, onClose);
            controls.update(title, content);
        }
    };
};

showAnnouncementsPopup.propTypes = {
    controller: PropTypes.instanceOf(Controller).isRequired,
    state: PropTypes.object,
    onClose: PropTypes.func.isRequired
};
