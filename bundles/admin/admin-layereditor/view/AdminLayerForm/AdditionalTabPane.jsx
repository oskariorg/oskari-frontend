import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextInput, TextAreaInput, Tooltip, Icon, Message } from 'oskari-ui';
import { StyledTab, StyledComponent } from './StyledFormComponents';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import styled from 'styled-components';

const LayerComposingModel = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

const InlineValue = styled('div')`
    display: flex;
    > * {
        flex: 1;
    }
`;
const InfoIcon = styled(Icon)`
    margin-left: 10px;
`;

export const AdditionalTabPane = LocaleConsumer(({ layer, propertyFields, controller, getMessage }) => {
    const metainfoInput =
        <Fragment>
            <Message messageKey='metainfoId'/>
            <StyledComponent>
                <TextInput
                    placeholder={getMessage('metaInfoIdDesc')}
                    value={layer.metadataid}
                    onChange={(evt) => controller.setMetadataIdentifier(evt.target.value)} />
            </StyledComponent>
        </Fragment>;

    const legendImageInput =
        <Fragment>
            <Message messageKey='legendImage'/>
            <Tooltip title={<Message messageKey='legendImageDesc'/>}>
                <InfoIcon type="question-circle" />
            </Tooltip>
            <StyledComponent>
                <TextInput
                    placeholder={getMessage('legendImagePlaceholder')}
                    value={layer.legendImage}
                    onChange={(evt) => controller.setLegendImage(evt.target.value)} />
            </StyledComponent>
        </Fragment>;

    const gfiContentInput =
        <Fragment>
            <Message messageKey='gfiContent'/>
            <StyledComponent>
                <TextAreaInput
                    rows={4}
                    value={layer.gfiContent}
                    onChange={(evt) => controller.setGfiContent(evt.target.value)} />
            </StyledComponent>
        </Fragment>;

    const gfiTypeSelect = !layer.gfiType ? null : (
        <InlineValue>
            <div>
                <Message messageKey='gfiType'/>
                <Tooltip title={<Message messageKey='gfiTypeDesc'/>}>
                    <InfoIcon type="question-circle" />
                </Tooltip>
            </div>
            <div>{ layer.gfiType }</div>
        </InlineValue>
    );

    const gfiXsltInput =
        <Fragment>
            <Message messageKey='gfiStyle'/>
            <Tooltip title={<Message messageKey='gfiStyleDesc'/>}>
                <InfoIcon type="question-circle" />
            </Tooltip>
            <StyledComponent>
                <TextAreaInput
                    rows={4}
                    value={layer.gfiXslt}
                    onChange={(evt) => controller.setGfiXslt(evt.target.value)} />
            </StyledComponent>
        </Fragment>;

    const attributesInput =
        <Fragment>
            <Message messageKey='attributes'/>
            <StyledComponent>
                <TextAreaInput
                    rows={6}
                    value={JSON.stringify(layer.attributes || {}, null, 2)}
                    onChange={(evt) => controller.setAttributes(evt.target.value)} />
            </StyledComponent>
        </Fragment>;

    return (
        <StyledTab>
            { propertyFields.includes(LayerComposingModel.METAINFO) && metainfoInput }
            { propertyFields.includes(LayerComposingModel.LEGEND_IMAGE) && legendImageInput }
            { propertyFields.includes(LayerComposingModel.GFI_CONTENT) && gfiContentInput }
            { propertyFields.includes(LayerComposingModel.GFI_TYPE) && gfiTypeSelect }
            { propertyFields.includes(LayerComposingModel.GFI_XSLT) && gfiXsltInput }
            { propertyFields.includes(LayerComposingModel.ATTRIBUTES) && attributesInput }
        </StyledTab>
    );
});

AdditionalTabPane.propTypes = {
    layer: PropTypes.object,
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    additionalProps: PropTypes.any
};
