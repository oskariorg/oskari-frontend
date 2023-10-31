import React, { Fragment } from 'react';
import { showBanner } from 'oskari-ui/components/window';
import { Checkbox, Message, Pagination } from 'oskari-ui';
import { BUNDLE_KEY } from '../constants';
import styled from 'styled-components';
import { InfoCircleOutlined, SelectOutlined } from '@ant-design/icons';
import { ThemeConsumer } from 'oskari-ui/util';
import { getTextColor } from 'oskari-ui/theme';

const DEFAULT_GREY_TEXT = '#3c3c3c';
const DEFAULT_POPUP_LINK_COLOR = '#0091ff';
const LinkIcon = styled(SelectOutlined)`
    margin-left: 6px;
`;

const TextColorWrapper = styled('span')`
    color: ${props => props.textColor ? props.textColor : DEFAULT_POPUP_LINK_COLOR};
`;

const PopupLink = styled('div')`
    color: ${props => props.textColor ? props.textColor : DEFAULT_POPUP_LINK_COLOR};
    cursor: pointer;
    a {
        color: ${props => props.textColor ? props.textColor : DEFAULT_POPUP_LINK_COLOR};
    }

    div {
        text-decoration: underline
    }

    margin: 0.5em 0;
`;

const InfoIcon = styled(InfoCircleOutlined)`
    font-size: 24px;
    margin-right: 10px;
`;

const StyledCheckbox = styled(Checkbox)`
    margin-left: 10px;
    margin-bottom: 10px;

`;

const StyledTitle = styled.span`
    font-weight: bold;
    color: ${props => props.textColor ? props.textColor : DEFAULT_GREY_TEXT};
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
`;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: row;
    color: ${props => props.textColor ? props.textColor : DEFAULT_GREY_TEXT};
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
`;

const Margin = styled.div`
    margin-right: auto;
`;

const StyledPagination = styled(Pagination)`
    ul {
        color: ${props => props.textColor ? props.textColor : DEFAULT_GREY_TEXT};
    }
    .ant-pagination-simple-pager {
        color: ${props => props.textColor ? props.textColor : DEFAULT_GREY_TEXT};
    }
    .ant-pagination-simple-pager > input {
        color: #000000;
    }

    .ant-pagination-next :not(.ant-pagination-disabled) > .ant-pagination-item-link {
        color: ${props => props.textColor ? props.textColor : DEFAULT_GREY_TEXT};
    }

    .ant-pagination-prev :not(.ant-pagination-disabled) > .ant-pagination-item-link {
        color: ${props => props.textColor ? props.textColor : DEFAULT_GREY_TEXT};
    }
`;

const ThemedNotificationContent = ThemeConsumer(({ theme, state, link, content, renderDescriptionPopup, setShowAgain, onPageChange, isMobile }) => {
    const { bannerAnnouncements, currentBanner = 1 } = state;
    const announcement = bannerAnnouncements[currentBanner - 1];
    const count = bannerAnnouncements.length;
    const { title } = Oskari.getLocalized(announcement.locale);
    const textColor = getTextColor(theme?.color?.primary);

    const pagingSection = <>
        <StyledCheckbox checked={state.dontShowAgain.includes(announcement.id)} onChange={setShowAgain}>
            <TextColorWrapper textColor={textColor}>
                <Message messageKey='dontShow' bundleKey={BUNDLE_KEY} />
            </TextColorWrapper>
        </StyledCheckbox>
        <StyledPagination textColor={textColor} simple hideOnSinglePage current={currentBanner} total={count} defaultPageSize={1} onChange={onPageChange}/>
    </>;
    return <>
        <InfoContainer textColor={textColor}>
            <InfoIcon/>
            <Column>
                <StyledTitle textColor={textColor}>{title}</StyledTitle>
                <span>
                    {getDescription(link, content, announcement, renderDescriptionPopup, textColor)}
                    <Margin/>
                </span>
            </Column>
        </InfoContainer>
        <Margin/>
        { isMobile && <Row>{pagingSection}</Row> }
        { !isMobile && <Column style={{ whiteSpace: 'nowrap' }}>{pagingSection}</Column> }
    </>;
});

const getDescription = (link, content, announcement, renderDescriptionPopup, textColor) => {
    let description = <span/>;

    if (link) {
        description = (
            <PopupLink textColor={textColor}>
                <a href={link} target='_blank' rel='noreferrer noopener'>
                    <Message messageKey={'externalLink'} bundleKey={BUNDLE_KEY} />
                </a>
                <LinkIcon/>
            </PopupLink>
        );
    } else if (content) {
        description = (
            <PopupLink textColor={textColor} onClick={() => renderDescriptionPopup(announcement)}>
                <Message messageKey={'externalLink'} bundleKey={BUNDLE_KEY} />
                <LinkIcon/>
            </PopupLink>
        );
    }

    return description;
};

const getContent = (state, controller, renderDescriptionPopup) => {
    const { bannerAnnouncements, currentBanner = 1 } = state;
    const announcement = bannerAnnouncements[currentBanner - 1];

    if (!announcement) return null;

    const { link, content } = Oskari.getLocalized(announcement.locale);
    const setShowAgain = (e) => controller.setShowAgain(announcement.id, e.target.checked);
    const onPageChange = (page) => controller.onBannerChange(page);

    const isMobile = Oskari.util.isMobile();

    const notificationContent = <ThemedNotificationContent
        isMobile={isMobile}
        state={state}
        link={link}
        content={content}
        renderDescriptionPopup={renderDescriptionPopup}
        setShowAgain={setShowAgain}
        onPageChange={onPageChange}/>;

    return (
        <>
            { isMobile &&
                <Column>
                    { notificationContent }
                </Column>
            }
            { !isMobile &&
                <Row>
                    { notificationContent }
                </Row>
            }
        </>
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
