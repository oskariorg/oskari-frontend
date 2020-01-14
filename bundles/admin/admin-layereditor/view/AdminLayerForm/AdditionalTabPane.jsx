import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextInput, TextAreaInput, Message } from 'oskari-ui';
import { StyledTab, StyledComponent } from './StyledFormComponents';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { InlineFlex } from './InlineFlex';
import { InfoTooltip } from './InfoTooltip';
import { Realtime } from './AdditionalTabPane/Realtime';
import { SelectedTime } from './AdditionalTabPane/SelectedTime';

const LayerComposingModel = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

export const AdditionalTabPane = LocaleConsumer(({ layer, propertyFields, controller, getMessage }) => {
    const metainfoInput =
        <Fragment>
            <Message messageKey='metainfoId'/>
            <StyledComponent>
                <TextInput
                    value={layer.metadataid}
                    onChange={(evt) => controller.setMetadataIdentifier(evt.target.value)} />
            </StyledComponent>
        </Fragment>;

    const legendImageInput =
        <Fragment>
            <Message messageKey='legendImage'/>
            <InfoTooltip messageKeys='legendImageDesc'/>
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
        <InlineFlex>
            <div>
                <Message messageKey='gfiType'/>
                <InfoTooltip messageKeys='gfiTypeDesc'/>
            </div>
            <div>{ layer.gfiType }</div>
        </InlineFlex>
    );

    const gfiXsltInput =
        <Fragment>
            <Message messageKey='gfiStyle'/>
            <InfoTooltip messageKeys='gfiStyleDesc'/>
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

    const lyrAndController = { layer, controller };

    return (
        <StyledTab>
            { propertyFields.includes(LayerComposingModel.SELECTED_TIME) &&
                <SelectedTime {...lyrAndController} />
            }
            { propertyFields.includes(LayerComposingModel.METAINFO) && metainfoInput }
            { propertyFields.includes(LayerComposingModel.LEGEND_IMAGE) && legendImageInput }
            { propertyFields.includes(LayerComposingModel.GFI_CONTENT) && gfiContentInput }
            { propertyFields.includes(LayerComposingModel.GFI_TYPE) && gfiTypeSelect }
            { propertyFields.includes(LayerComposingModel.GFI_XSLT) && gfiXsltInput }
            { propertyFields.includes(LayerComposingModel.ATTRIBUTES) && attributesInput }
            { propertyFields.includes(LayerComposingModel.REALTIME) &&
                <Realtime {...lyrAndController} />
            }
        </StyledTab>
    );
});

AdditionalTabPane.propTypes = {
    layer: PropTypes.object,
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    additionalProps: PropTypes.any
};
