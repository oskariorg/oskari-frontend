
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Message, TextAreaInput, Tooltip, Button } from 'oskari-ui';
import styled from 'styled-components';
import { SecondaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { showPopup } from 'oskari-ui/components/window';
import { LocaleProvider } from 'oskari-ui/util';

export const BUNDLE_NAME = 'PersonalData';

const Content = styled.div`
    margin: 12px 24px 24px;
`;

const StyledButton = styled(Button)`
    width: 165px;
`;

const SnippetPopup = ({html, onClose}) => {

    const [copied, setCopied] = useState(false);
    
    const copyText = () => {
        navigator.clipboard.writeText(html);
        setCopied(true);
    }

    return (
        <Content>
            <Message messageKey="tabs.publishedmaps.published.desc" />
            <TextAreaInput name='html' value={html} />
            <ButtonContainer>
                <SecondaryButton type='cancel' onClick={onClose}/>
                <Tooltip title={<Message messageKey={`tabs.publishedmaps.published.copy`} />}>
                    <StyledButton onClick={copyText}>
                        <Message messageKey={copied ? "tabs.publishedmaps.published.copied" : "tabs.publishedmaps.published.copy"} />
                    </StyledButton>
                </Tooltip>
            </ButtonContainer>
        </Content>
    );
};

export const showSnippetPopup = (view, onClose) => {
    const title = <Message messageKey="tabs.publishedmaps.published.copy" bundleKey={BUNDLE_NAME} />;

    const url = Oskari.getSandbox().createURL(view.url);
    const size = view.metadata && view.metadata.size ? view.metadata.size : undefined;
    const width = size ? size.width + 'px' : '100%';
    const height = size ? size.height + 'px' : '100%';
    let iframeCode = '<iframe src="' + url + '" allow="geolocation" style="border: none;';
    if (width !== null && width !== undefined) {
        iframeCode += ' width: ' + width + ';';
    }
    if (height !== null && height !== undefined) {
        iframeCode += ' height: ' + height + ';';
    }
    iframeCode += '"></iframe>';

    const content = (
        <LocaleProvider value={{ bundleKey: BUNDLE_NAME }}>
            <SnippetPopup html={iframeCode} onClose={onClose} />
        </LocaleProvider>
    );
    return showPopup(title, content, onClose);
}

showSnippetPopup.propTypes = {
    view: PropTypes.object,
    onClose: PropTypes.func.isRequired
};
