import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, CollapsePanel, Message } from 'oskari-ui';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { LocalizedLayerInfo } from './LocalizedLayerInfo';

export const OtherLanguagesPane = LocaleConsumer(({ layer, controller, lang }) => (
    <Collapse>
        <CollapsePanel header={<Message messageKey='otherLanguages'/>}>
            {
                Oskari.getSupportedLanguages()
                    .filter(supportedLang => supportedLang !== lang)
                    .map(lang => <LocalizedLayerInfo
                        key={layer.layer_id + lang}
                        layer={layer}
                        lang={lang}
                        controller={controller} />)
            }
        </CollapsePanel>
    </Collapse>
));

OtherLanguagesPane.propTypes = {
    lang: PropTypes.string.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    layer: PropTypes.object
};
