import React from 'react';
import { showPopup } from 'oskari-ui/components/window';
import { Message } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import { StyleForm } from './StyleForm';
import { UserStyles } from './UserStyles';
import { VectorStyle } from '../../mapmodule/domain/VectorStyle';

export const BUNDLE_KEY = 'userstyle';

export const showStylesPopup = (service, values, onClose) => {
    const { layerId, styleName, showStyle } = values;
    const styles = service.getUserStylesForLayer(layerId);
    const showStyleForm = styles.length === 0 || showStyle;
    const onRemove = service.removeUserStyle.bind(service);

    let content;
    if (showStyleForm) {
        const style = service.getUserStyle(layerId, styleName) || new VectorStyle('', '', 'user');
        const onAdd = ({ featureStyle, title }) => {
            style.setFeatureStyle(featureStyle);
            style.setTitle(title);
            service.saveUserStyle(layerId, style);
        };
        // Service triggers update on saveUserLayer. Trigger update also onClose to render style list
        content = <StyleForm vectorStyle={ style } onAdd={ onAdd } onClose={ service.update.bind(service) }/>;
    } else {
        content = <UserStyles layerId={layerId} styles={styles} removeUserStyleHandler={onRemove} />;
    }

    const title = <Message bundleKey={ BUNDLE_KEY } messageKey={showStyleForm ? 'popup.title' : 'title'} />;
    const controls = showPopup(title,
        (<LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            {content}
        </LocaleProvider>),
        onClose, { id: BUNDLE_KEY }
    );
    return {
        ...controls,
        update: () => {
            const styles = service.getUserStylesForLayer(layerId);
            const title = <Message bundleKey={ BUNDLE_KEY } messageKey='title' />;
            controls.update(title,
                (<LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
                    <UserStyles layerId={layerId} styles={styles} removeUserStyleHandler={onRemove} />
                </LocaleProvider>));
            controls.bringToTop();
        }
    };
};
