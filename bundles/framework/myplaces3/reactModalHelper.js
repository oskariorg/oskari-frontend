import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import React from 'react';
import { LocaleProvider } from 'oskari-ui/util';
import { MyPlacesLayerForm } from './MyPlacesLayerForm';
import { LOCALE_KEY } from './constants';

export const showModal = (name, style, saveLayer) => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const removeModal = () => {
        unmountComponentAtNode(element);
        document.body.removeChild(element);
    };

    ReactDOM.render(
        <LocaleProvider value={{ bundleKey: LOCALE_KEY }}>
            <MyPlacesLayerForm
                name={ name }
                style={ style }
                onSave={ (name, style) => {
                    saveLayer(name, style);
                    removeModal();
                } }
                onCancel={ removeModal }
            />
        </LocaleProvider>,
        element
    );
};
