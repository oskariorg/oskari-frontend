import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Link, Button, List, ListItem, Alert } from 'oskari-ui';
import { SecondaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { InfoIcon } from 'oskari-ui/components/icons';

const Content = styled.div`
    display: flex;
    flex-flow: column;
    > * {
        margin-bottom: 1em;
    }
`;
const StyledButton = styled(Button)`
    justify-content: flex-start;
`;
const StyledListItem = styled(ListItem)`
    border-bottom: none !important;
`;
const Header = styled.div`
    font-weight: bold;
`;
const Footer = styled.div`
    font-style: italic;
`;

const TermsOfUse = ({ url, action }) => {
    if (url && url.indexOf('http') === 0) {
        // starts with http - use as a link
        return (
            <Link tooltip={null} url={url}>
                <Message messageKey='StartView.touLink' />
            </Link>
        );
    }
    return (
        <StyledButton type='link' onClick={action}>
            <Message messageKey='StartView.touLink' />
        </StyledButton>
    );
};
TermsOfUse.propTypes = {
    url: PropTypes.string,
    action: PropTypes.func.isRequired
};

const LayerList = ({ list, header, footer }) => {
    if (!list.length) {
        return null;
    }
    return (
        <List dataSource={list} bordered size='small'
            header={<Message messageKey={`StartView.${header}`} LabelComponent={Header}/>}
            renderItem={({ name, info }) => (
                <StyledListItem>
                    {name}
                    { info && <InfoIcon title={info}/> }
                </StyledListItem>
            )}
            footer={footer ? <Message messageKey={`StartView.${footer}`} LabelComponent={Footer}/> : null}/>
    );
};
LayerList.propTypes = {
    list: PropTypes.array.isRequired,
    header: PropTypes.string.isRequired,
    footer: PropTypes.string
};

export const FlyoutContent = ({
    hasAcceptedTou,
    urls,
    actions,
    layers,
    deniedLayers
}) => {
    if (!Oskari.user().isLoggedIn()) {
        const { login, register } = urls;
        return (
            <Content>
                <Message messageKey='NotLoggedView.text' />
                { login && (
                    <Link tooltip={null} external={false} url={login}>
                        <Message messageKey='NotLoggedView.signup' />
                    </Link>
                )}
                {register && (
                    <Link tooltip={null} external={false} url={register}>
                        <Message messageKey='NotLoggedView.register' />
                    </Link>
                )}
            </Content>
        );
    }
    const noPublishableLayers = !layers.length;
    const primaryBtn = hasAcceptedTou ? 'continue' : 'continueAndAccept';
    const primaryClick = hasAcceptedTou ? actions.continue : actions.acceptTou;
    const layerListFooter = layers.some(l => l.userDataLayer) ? 'hasUserDataDisclaimer' : '';

    return (
        <Content>
            <Message messageKey='StartView.text' />
            { noPublishableLayers && <Alert type='error' message={<Message messageKey='StartView.layerlist_empty' />}/>}
            <LayerList list={layers} header='layerlist_title' footer={layerListFooter} />
            <LayerList list={deniedLayers} header='layerlist_denied' />
            <TermsOfUse url={urls.tou} action={actions.showTou} />
            <ButtonContainer>
                <SecondaryButton type='cancel' onClick={actions.close} />
                <Button type='primary' onClick={primaryClick} disabled={noPublishableLayers}>
                    <Message messageKey={`StartView.buttons.${primaryBtn}`}/>
                </Button>
            </ButtonContainer>
        </Content>
    );
};

FlyoutContent.propTypes = {
    hasAcceptedTou: PropTypes.bool,
    urls: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    layers: PropTypes.array.isRequired,
    deniedLayers: PropTypes.array.isRequired
};
