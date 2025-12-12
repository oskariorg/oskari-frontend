import React from 'react';
import PropTypes from 'prop-types';
import { Message, Button, Space } from 'oskari-ui';
import { Card } from 'oskari-ui/components/Card';
import styled from 'styled-components';

const Paragraph = styled('p')``;
const StyledCard = styled(Card)`
.ant-card-head-title {
    white-space: normal;
}
`;


export const InfoPanel = ({ layer = {}, startNewFeature, onClose}) => {
    return (
        <React.Fragment>
            <Message messageKey="FeatureEditorView.info.layerLabel" />:
            <Space direction="vertical">
                <StyledCard title={layer.name}>
                    <Message messageKey="FeatureEditorView.info.featureModifyInfo" LabelComponent={Paragraph}/>
                </StyledCard>

                <Space>
                    <Button onClick={onClose}>
                        <Message messageKey="FeatureEditorView.buttons.close" />
                    </Button>
                    <Button onClick={startNewFeature}  type="primary">
                        <Message messageKey="FeatureEditorView.buttons.addFeature" />
                    </Button>
                </Space>
            </Space>
        </React.Fragment>);
};

InfoPanel.propTypes = {
    layer: PropTypes.object,
    startNewFeature: PropTypes.func,
    onClose: PropTypes.func
};
