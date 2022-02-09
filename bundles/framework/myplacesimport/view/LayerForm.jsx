import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import { showPopup } from 'oskari-ui/components/window';
import { LayerFormContent } from './LayerForm/';
import { BUNDLE_NAME } from '../constants';

export const showLayerForm = (values, config, onOk, onClose) => {
    const content = (
        <LocaleProvider value={{ bundleKey: BUNDLE_NAME }}>
            <LayerFormContent values={values} config={config} onOk={onOk} onCancel={onClose}/>
        </LocaleProvider>
    );
    const title = <Message messageKey="flyout.title" bundleKey={BUNDLE_NAME} />;
    const controls = showPopup(title, content, onClose);
    return {
        ...controls,
        update: error => {
            controls.update(title,
                (<LocaleProvider value={{ bundleKey: BUNDLE_NAME }}>
                    <LayerFormContent values={values} config={config} onOk={onOk} onCancel={onClose} error={error}/>
                </LocaleProvider>));
        }
    };
};

showLayerForm.propTypes = {
    values: PropTypes.object,
    config: PropTypes.object.isRequired,
    onOk: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};
