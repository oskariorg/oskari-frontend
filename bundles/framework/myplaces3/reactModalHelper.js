import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import React from 'react';
import { LocaleProvider } from 'oskari-ui/util';
import { MyPlacesLayerForm } from './MyPlacesLayerForm';
import { LOCALE_KEY } from './constants';

/**
 * Opens a modal window for editing my places layer name and style.
 *
 * @param {String} name layer name for editing
 * @param {Object} style Oskari style object for editing
 * @param {Function} saveLayer callback to call when user hits "Save"
 */
export const showModal = (locale, style, saveLayer) => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const removeModal = () => {
        unmountComponentAtNode(element);
        document.body.removeChild(element);
    };

    ReactDOM.render(
        <LocaleProvider value={{ bundleKey: LOCALE_KEY }}>
            <MyPlacesLayerForm
                locale={ locale }
                style={ style }
                onSave={ (locale, style) => {
                    saveLayer(locale, style);
                    removeModal();
                } }
                onCancel={ removeModal }
            />
        </LocaleProvider>,
        element
    );
};
