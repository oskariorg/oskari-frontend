import React from 'react';
import { showPopup } from 'oskari-ui/components/window';
import { Message } from 'oskari-ui';
import { PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { InfoIcon } from 'oskari-ui/components/icons';
import styled from 'styled-components';

const BUNDLE_NAME = 'findbycoordinates';
const StyledContent = styled('div')`
    margin: 12px 24px 24px;
    min-width: 300px;
`;
const Row = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const Address = styled('div')`
    display: flex;
    flex-direction: column;
`;
const StyledInfoIcon = styled('span')`
    margin-left: 10px;
`;

const PopupContent = ({ results, onClose }) => {
    const channels = Oskari.getMsg(BUNDLE_NAME, 'channels');
    const channelDescriptions = Oskari.getMsg(BUNDLE_NAME, 'channelDescriptions');
    return (
        <StyledContent>
            {Object.keys(results).map(key => {
                const res = results[key];
                return (
                    <div key={`channel-${key}`}>
                        <h3>{channels[res.channelId] || res.channelId || '' + res.langText}{channelDescriptions[res.channelId] && (<StyledInfoIcon><InfoIcon title={channelDescriptions[res.channelId]} /></StyledInfoIcon>)}</h3>
                        {res.rows.map((row, index) => (
                            <Row key={index}>
                                <img src={row.img} />
                                <Address>
                                    <span>{row.name}</span>
                                    <span>{row.info}</span>
                                    <span>{row.lonlat}</span>
                                </Address>
                            </Row>
                        ))}
                    </div>
                )
            })}
            <ButtonContainer>
                <PrimaryButton
                    type='close'
                    onClick={onClose}
                />
            </ButtonContainer>
        </StyledContent>
    );
};

export const showFindByCoordinatesPopup = (channelResults, theme, onClose) => {
    const options = {
        id: BUNDLE_NAME,
        theme
    };

    const PopupComponent = <PopupContent 
        results={channelResults}
        onClose={onClose}
    />;

    return showPopup(<Message bundleKey={BUNDLE_NAME} messageKey='resultsTitle' />, PopupComponent, onClose, options);
};
