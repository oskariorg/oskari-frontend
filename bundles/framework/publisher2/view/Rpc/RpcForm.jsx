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

export const RpcForm = ({ state, controller }) => {
    return (
        <Content>
            <StyledCheckbox
                checked={state.allowMetadata}
                onChange={(e) => controller.updateField('allowMetadata', e.target.checked)}
            >
                <Message messageKey='BasicView.maptools.MetadataSearchTool' />
            </StyledCheckbox>
            <StyledCheckbox
                checked={state.allowFeedback}
                onChange={(e) => controller.updateField('allowFeedback', e.target.checked)}
            >
                <Message messageKey='BasicView.maptools.FeedbackServiceTool' />
            </StyledCheckbox>
            {state.allowFeedback && (
                <FeedbackFrom>
                    <LabeledInput
                        key='t_url'
                        label={<Message bundleKey='feedbackService' messageKey='display.publisher.apiUrl' />}
                        placeholder={Oskari.getMsg('feedbackService', 'display.publisher.urlPlaceholder')}
                        type='text'
                        value={state.feedbackBaseUrl}
                        onChange={(e) => controller.updateField('feedbackBaseUrl', e.target.value)}
                    />
                    <LabeledInput
                        key='t_key'
                        label={<Message bundleKey='feedbackService' messageKey='display.publisher.apiKey' />}
                        placeholder={Oskari.getMsg('feedbackService', 'display.publisher.keyPlaceholder')}
                        type='text'
                        value={state.feedbackApiKey}
                        onChange={(e) => controller.updateField('feedbackApiKey', e.target.value)}
                    />
                    <LabeledInput
                        key='t_extensions'
                        label={<Message bundleKey='feedbackService' messageKey='display.publisher.apiExtensions' />}
                        placeholder={Oskari.getMsg('feedbackService', 'display.publisher.extensionsPlaceholder')}
                        type='text'
                        value={state.feedbackExtensions}
                        onChange={(e) => controller.updateField('feedbackExtensions', e.target.value)}
                    />
                </FeedbackFrom>
            )}
        </Content>
    );
};
