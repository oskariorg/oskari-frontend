import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, CollapsePanel } from 'oskari-ui';
import { LocalizedLayerInfo } from './LocalizedLayerInfo';

export const OtherLanguagesPane = (props) => {
    const { layer, service, getMessage, lang } = props;
    return (
        <Collapse>
            <CollapsePanel header={getMessage('otherLanguages')}>
                {
                    Oskari.getSupportedLanguages()
                        .filter(supportedLang => supportedLang !== lang)
                        .map(lang => <LocalizedLayerInfo
                            key={layer.layer_id + lang}
                            layer={layer}
                            lang={lang}
                            service={service}
                            getMessage={getMessage} />)
                }
            </CollapsePanel>
        </Collapse>
    );
};

OtherLanguagesPane.propTypes = {
    lang: PropTypes.string.isRequired,
    service: PropTypes.any,
    layer: PropTypes.object,
    getMessage: PropTypes.func
};
