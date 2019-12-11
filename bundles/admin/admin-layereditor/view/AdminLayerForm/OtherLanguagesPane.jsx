import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, CollapsePanel, Message } from 'oskari-ui';
import { withLocale } from 'oskari-ui/util';
import { LocalizedLayerInfo } from './LocalizedLayerInfo';

export const OtherLanguagesPane = withLocale(({ layer, service, lang }) => (
    <Collapse>
        <CollapsePanel header={<Message messageKey='otherLanguages'/>}>
            {
                Oskari.getSupportedLanguages()
                    .filter(supportedLang => supportedLang !== lang)
                    .map(lang => <LocalizedLayerInfo
                        key={layer.layer_id + lang}
                        layer={layer}
                        lang={lang}
                        service={service} />)
            }
        </CollapsePanel>
    </Collapse>
));

OtherLanguagesPane.propTypes = {
    lang: PropTypes.string.isRequired,
    service: PropTypes.any,
    layer: PropTypes.object
};
