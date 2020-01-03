import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextInput, TextAreaInput, Message } from 'oskari-ui';
import { StyledTab, StyledComponent } from './StyledFormComponents';
import { LocaleConsumer, Controller } from 'oskari-ui/util';

const LayerComposingModel = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

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

    const gfiContentInput =
        <Fragment>
            <Message messageKey='gfiContent'/>
            <StyledComponent>
                <TextAreaInput
                    rows={6}
                    value={layer.gfiContent}
                    onChange={(evt) => controller.setGfiContent(evt.target.value)} />
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
            { propertyFields.includes(LayerComposingModel.GFI_CONTENT) && gfiContentInput }
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
