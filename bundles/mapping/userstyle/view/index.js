import React from 'react';
import { showPopup } from 'oskari-ui/components/window';
import { Message } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import { StyleForm } from './StyleForm';
import { UserStyles } from './UserStyles';
import { VectorStyle } from '../../mapmodule/domain/VectorStyle';

export const BUNDLE_KEY = 'userstyle';

const getContent = (service, styles, values, showStyleForm, onClose) => {
    const { layerId, styleName } = values;
    let content;
    if (showStyleForm) {
        // service sets id and title if not defined
        const style = service.getUserStyle(layerId, styleName) || new VectorStyle({ name: '', type: 'user' });
        const onAdd = ({ featureStyle, title }) => {
            style.setStyleDef({ featureStyle });
            style.setTitle(title);
            service.saveUserStyle(layerId, style);
        };
        const onCancel = () => {
            if (styles.length > 0) {
                service.notify(layerId);
            } else {
                onClose();
            }
        };
        content = <StyleForm vectorStyle={ style } onAdd={ onAdd } onCancel={ onCancel }/>;
    } else {
        content = <UserStyles layerId={ layerId } styles={ styles } removeUserStyleHandler={ service.removeUserStyle.bind(service) } />;
    }
    return (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            { content }
        </LocaleProvider>
    );
};

const getTitle = (showStyleForm) => <Message bundleKey={ BUNDLE_KEY } messageKey={showStyleForm ? 'popup.title' : 'title'} />;

export const showStylesPopup = (service, values = {}, onClose) => {
    const styles = service.getUserStylesForLayer(values.layerId);
    const showStyleForm = styles.length === 0 || values.showStyle;
    const controls = showPopup(
        getTitle(showStyleForm),
        getContent(service, styles, values, showStyleForm, onClose),
        onClose,
        { id: BUNDLE_KEY }
    );
    return {
        ...controls,
        update: (values = {}) => {
            const styles = service.getUserStylesForLayer(values.layerId);
            const showStyleForm = styles.length === 0 || values.showStyle;
            controls.update(getTitle(showStyleForm), getContent(service, styles, values, showStyleForm, onClose));
        }
    };
};
