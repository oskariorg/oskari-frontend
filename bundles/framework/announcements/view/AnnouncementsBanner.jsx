import React, { Fragment } from 'react';
import { showBanner } from 'oskari-ui/components/window';
import { Checkbox, Message, Pagination, Link } from 'oskari-ui';
import { BUNDLE_KEY } from '../constants';
import styled from 'styled-components';
import { InfoCircleOutlined, SelectOutlined } from '@ant-design/icons';

const LinkIcon = styled(SelectOutlined)`
    margin-left: 6px;
`;

const PopupLink = styled('span')`
    color: #0091ff;
    cursor: pointer;
`;

const InfoIcon = styled(InfoCircleOutlined)`
    color: #3c3c3c;
    font-size: 24px;
    margin-right: 10px;
`;

const StyledCheckbox = styled(Checkbox)`
    margin-left: 10px;
    white-space: nowrap;
`;
const StyledTitle = styled.span`
    font-weight: bold;
    color: #3c3c3c;
`;
const Column = styled.div`
    display: flex;
    flex-direction: column;
`;
const Margin = styled.div`
    margin-right: auto;
`;

const getContent = (state, controller, renderDescriptionPopup) => {
    const { bannerAnnouncements, currentBanner = 1 } = state;
    const announcement = bannerAnnouncements[currentBanner - 1];

    if (!announcement) return null;

    const { title, link, content } = Oskari.getLocalized(announcement.locale);
    const count = bannerAnnouncements.length;
    const setShowAgain = (e) => controller.setShowAgain(announcement.id, e.target.checked);
    const onPageChange = (page) => controller.onBannerChange(page);

    let description = <span/>;

    if (link) {
        description = (
            <Link url={link}>
                <Message messageKey={'externalLink'} bundleKey={BUNDLE_KEY} />
            </Link>
        );
    } else if (content) {
        description = (
            <PopupLink onClick={() => renderDescriptionPopup(announcement)}>
                <Message messageKey={'externalLink'} bundleKey={BUNDLE_KEY} />
                <LinkIcon/>
            </PopupLink>
        );
    }
    return (
        <Fragment>
            <InfoIcon/>
            <Column>
                <StyledTitle>{title}</StyledTitle>
                <span>
                    {description}
                    <Margin/>
                </span>
            </Column>
            <Margin/>
            <Column>
                <StyledCheckbox checked={state.dontShowAgain.includes(announcement.id)} onChange={setShowAgain}>
                    <Message messageKey='dontShow' bundleKey={BUNDLE_KEY} />
                </StyledCheckbox>
                <Pagination simple hideOnSinglePage current={currentBanner} total={count} defaultPageSize={1} onChange={onPageChange}/>
            </Column>
        </Fragment>
    );
};

export const showAnnouncementsBanner = (state, controller, onClose, renderDescriptionPopup) => {
    const content = getContent(state, controller, renderDescriptionPopup);
    const controls = showBanner(content, onClose, { id: BUNDLE_KEY });
    return {
        ...controls,
        update: (state) => {
            const content = getContent(state, controller, renderDescriptionPopup);
            controls.update(content);
        }
    };
};
