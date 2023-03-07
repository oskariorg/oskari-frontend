import React, { useState } from 'react';
import styled from 'styled-components';
import { Checkbox, LabeledInput, Message } from 'oskari-ui';

const Content = styled('div')`
    display: flex;
    flex-direction: column;
`;

const FeedbackFrom = styled('div')`
    display: flex;
    flex-direction: column;
`;

const StyledCheckbox = styled(Checkbox)`
    + .ant-checkbox-wrapper {
        margin-left: 0;
    }
`;

export const FeedbackServiceForm = ({ state, controller }) => {
    /**
     * controller.updateField() will re-render the form which makes the field that is being edited loose focus after each keypress
     * -> using useState()to workaround this while waiting for the whole publisher to be written in React.
     */
    const [componentState, setComponentState] = useState({
        feedbackBaseUrl: state.feedbackBaseUrl,
        feedbackApiKey: state.feedbackApiKey,
        feedbackExtensions: state.feedbackExtensions
    });
    return (
        <Content>
            <StyledCheckbox
                checked={state.allowFeedback}
                onChange={(e) => controller.updateField('allowFeedback', e.target.checked)}
            >
                <Message bundleKey='feedbackService' messageKey='display.publisher.label' />
            </StyledCheckbox>
            {state.allowFeedback && (
                <FeedbackFrom>
                    <LabeledInput
                        key='t_url'
                        label={<Message bundleKey='feedbackService' messageKey='display.publisher.apiUrl' />}
                        placeholder={Oskari.getMsg('feedbackService', 'display.publisher.urlPlaceholder')}
                        type='text'
                        value={componentState.feedbackBaseUrl}
                        onBlur={(e) => controller.updateField('feedbackBaseUrl', e.target.value)}
                        onChange={(e) => setComponentState({
                            ...componentState,
                            feedbackBaseUrl: e.target.value
                        })}
                    />
                    <LabeledInput
                        key='t_key'
                        label={<Message bundleKey='feedbackService' messageKey='display.publisher.apiKey' />}
                        placeholder={Oskari.getMsg('feedbackService', 'display.publisher.keyPlaceholder')}
                        type='text'
                        value={componentState.feedbackApiKey}
                        onBlur={(e) => controller.updateField('feedbackApiKey', e.target.value)}
                        onChange={(e) => setComponentState({
                            ...componentState,
                            feedbackApiKey: e.target.value
                        })}
                    />
                    <LabeledInput
                        key='t_extensions'
                        label={<Message bundleKey='feedbackService' messageKey='display.publisher.apiExtensions' />}
                        placeholder={Oskari.getMsg('feedbackService', 'display.publisher.extensionsPlaceholder')}
                        type='text'
                        value={componentState.feedbackExtensions}
                        onBlur={(e) => controller.updateField('feedbackExtensions', e.target.value)}
                        onChange={(e) => setComponentState({
                            ...componentState,
                            feedbackExtensions: e.target.value
                        })}
                    />
                </FeedbackFrom>
            )}
        </Content>
    );
};
