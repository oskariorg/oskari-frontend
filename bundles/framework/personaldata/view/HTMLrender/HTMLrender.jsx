
import React, { useState } from 'react';
import { Message, TextAreaInput, Tooltip, Button } from 'oskari-ui';
import styled from 'styled-components';
import { SecondaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { showPopup } from 'oskari-ui/components/window'

const Content = styled.div`
    margin: 12px 24px 24px;
`;

const StyledButton = styled(Button)`
    width: 165px;
`

const BUNDLE_NAME = 'PersonalData';

const HTMLRender = ({values, onClose}) => {

    const [copied, setCopied] = useState(false);
    
    const copyText = () => {
        navigator.clipboard.writeText(values.html);
        setCopied(true);
    }

    return (
        <Content>
            <Message messageKey="tabs.publishedmaps.published.desc" bundleKey={BUNDLE_NAME} />
            <TextAreaInput name='html' value={values.html} />
            <ButtonContainer>
                <SecondaryButton type='cancel' onClick={onClose}/>
                <Tooltip title={<Message messageKey={`tabs.publishedmaps.published.copy`} bundleKey={BUNDLE_NAME} />}>
                    <StyledButton onClick={copyText}>
                        <Message messageKey={copied ? "tabs.publishedmaps.published.copied" : "tabs.publishedmaps.published.copy"} bundleKey={BUNDLE_NAME} />
                    </StyledButton>
                </Tooltip>
            </ButtonContainer>
        </Content>
    );
};

export const showHTMLrender = (values, onClose) => {
    const title = <Message messageKey="tabs.publishedmaps.published.copy" bundleKey={BUNDLE_NAME} />;
    const content = (
        <HTMLRender values={values} onClose={onClose} />
    );
    return showPopup(title, content, onClose);
}
