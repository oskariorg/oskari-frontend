import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import { showPopup } from 'oskari-ui/components/window';
import { LayerFormContent } from './LayerForm/';
import { BUNDLE_NAME } from '../constants';

const getTitle = config => {
    const key = config.isImport ? 'flyout.title' : 'tab.editLayer';
    return <Message messageKey={key} bundleKey={BUNDLE_NAME} />;
};

export const showLayerForm = (values, config, onOk, onClose) => {
    const { id } = values;
    const content = (
        <LocaleProvider value={{ bundleKey: BUNDLE_NAME }}>
            <LayerFormContent values={values} config={config} onOk={onOk} onCancel={onClose}/>
        </LocaleProvider>
    );
    const controls = showPopup(getTitle(config), content, onClose);
    return {
        id,
        ...controls,
        update: error => {
            controls.update(getTitle(config),
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
