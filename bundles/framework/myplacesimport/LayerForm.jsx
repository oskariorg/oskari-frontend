import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import { showPopup } from 'oskari-ui/components/window';
import { LOCALE_KEY } from './constants';
import { LayerFormContent } from './LayerFormContent';

export const showLayerForm = (values, conf, onOk, onClose) => {
    const { maxSize, isImport } = conf;
    const content = (
        <LocaleProvider value={{ bundleKey: LOCALE_KEY }}>
            <LayerFormContent values={values} isImport={isImport} onOk={onOk} maxSize={maxSize}/>
        </LocaleProvider>
    );
    const title = <Message messageKey="flyout.title" bundleKey={LOCALE_KEY} />;
    return showPopup(title, content, onClose);
};

showLayerForm.propTypes = {
    values: PropTypes.object,
    conf: PropTypes.object.isRequired,
    onOk: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};
