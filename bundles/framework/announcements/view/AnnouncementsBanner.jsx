import React from 'react';
import { showBanner } from 'oskari-ui/components/window';
import { Checkbox, Message, Pagination, Link } from 'oskari-ui';
import { BUNDLE_KEY } from '../constants';
import styled from 'styled-components';
import { SecondaryButton, PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { InfoCircleOutlined, SelectOutlined } from '@ant-design/icons';

const StyledPagination = styled(Pagination)`
    li.ant-pagination-next {
        min-width: 0;
    }
`;

const ActionContainer = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: end;
`;

const LinkIcon = styled(SelectOutlined)`
    margin-left: 6px;
`;

const PopupLink = styled('span')`
    color: #0091ff;
    cursor: pointer;
`;

const getContent = (state, controller, onClose, renderDescriptionPopup) => {
    const { bannerAnnouncements, currentBanner = 1 } = state;
    const announcement = bannerAnnouncements[currentBanner - 1];

    if (!announcement) return null;

    const { title, link, content } = Oskari.getLocalized(announcement.locale);
    const setShowAgain = (e) => controller.setShowAgain(announcement.id, e.target.checked);

    const onPageChange = (page) => controller.onBannerChange(page);
    const isLast = currentBanner === bannerAnnouncements.length;

    const itemRender = (current, type, originalElement) => {
        if (type === 'prev') {
            return <SecondaryButton type='previous'/>;
        }
        if (type === 'next') {
            return isLast ? null : <PrimaryButton type='next' style={{ color: '#ffffff' }}/>;
        }
        return originalElement;
    };

    let description;

    if (link) {
        description = <Link url={link}>
            <Message messageKey={'externalLink'} bundleKey={BUNDLE_KEY} />
        </Link>;
    } else if (content) {
        const contentHtml = <div dangerouslySetInnerHTML={{ __html: content }}/>;
        description = <PopupLink onClick={() => renderDescriptionPopup(title, contentHtml)}>
                <Message messageKey={'externalLink'} bundleKey={BUNDLE_KEY} />
                <LinkIcon/>
        </PopupLink>;
    }

    const action = <ActionContainer>
        <Checkbox checked={state.dontShowAgain.includes(announcement.id)} onChange={setShowAgain}>
            <Message messageKey='dontShow' bundleKey={BUNDLE_KEY} />
        </Checkbox>
        {bannerAnnouncements.length > 1 && (
            <ButtonContainer>
                <StyledPagination current={currentBanner} total={bannerAnnouncements.length} defaultPageSize={1} hideOnSinglePage onChange={onPageChange} itemRender={itemRender}/>
                {isLast && <PrimaryButton type='close' onClick={() => onClose()}/>}
            </ButtonContainer>
        )}
    </ActionContainer>;

    return {
        title,
        action,
        closable: bannerAnnouncements.length > 1 ? false : true,
        content: description,
        icon: <InfoCircleOutlined style={{color: '#5e2c00'}} />
    }
};

export const showAnnouncementsBanner = (state, controller, onClose, renderDescriptionPopup) => {
    const content = getContent(state, controller, onClose, renderDescriptionPopup);
    if (content === null) return null;
    const controls = showBanner(content.icon, content.title, content.content, onClose, content.closable, content.action);
    return {
        ...controls,
        update: (state) => {
            const content = getContent(state, controller, onClose, renderDescriptionPopup);
            if (content === null) return null;
            controls.update({
                icon: content.icon,
                title: content.title,
                content: content.content,
                onClose,
                closable: content.closable,
                action: content.action
            });
        }
    };
};
