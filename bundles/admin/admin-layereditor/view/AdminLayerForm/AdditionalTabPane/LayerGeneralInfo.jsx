import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Row, Col, Card } from 'antd';
import styled from 'styled-components';

const InfoRow = styled(Row)`
    margin-bottom: 20px;
`;

const TextLine = styled('div')`
    display: block;

    span:last-child {
        margin: 0 0 0 20px;
    }
`;

const InfoCard = styled(Card)`
    .ant-card-body {
        padding: 5px 12px;
    }
`;

const LeftColumn = styled(Col)`
    &:first-child {
        padding: 5px 0 0 0;
    }
`;

export const LayerGeneralInfo = ({ layer }) => {
    const createdDate = new Date(layer.created);
    const updatedDate = new Date(layer.updated);
    const dateLocale = 'fi-FI'; // we are not using here other locales than Finnish so we can hard core it into constant variable
    const localeDateOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };

    return (
        <InfoRow>
            <LeftColumn span={ 12 }>
                <TextLine>
                    <Message messageKey='fields.layerId' />
                </TextLine>
                <TextLine>
                    <Message messageKey='fields.created' />
                </TextLine>
                <TextLine>
                    <Message messageKey='fields.updated' />
                </TextLine>
            </LeftColumn>

            <Col span={ 12 }>
                <InfoCard>
                    <span> { layer.id } </span>
                    { layer.created &&
                        <TextLine>
                            <span> { createdDate.toLocaleTimeString(dateLocale) }</span> <span>{ createdDate.toLocaleDateString(dateLocale, localeDateOptions) }</span>
                        </TextLine>
                    }
                    { layer.updated &&
                        <TextLine>
                            <span> { updatedDate.toLocaleTimeString(dateLocale) }</span> <span>{ updatedDate.toLocaleDateString(dateLocale, localeDateOptions) }</span>
                        </TextLine>
                    }
                </InfoCard>
            </Col>
        </InfoRow>
    );
};

LayerGeneralInfo.propTypes = {
    layer: PropTypes.object.isRequired
};
