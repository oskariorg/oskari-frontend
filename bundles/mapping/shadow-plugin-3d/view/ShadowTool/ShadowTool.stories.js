import React from 'react';
import { storiesOf } from '@storybook/react';

import { LocaleProvider } from 'oskari-ui/util';
import { ShadowTool } from './ShadowTool';
import { ShadowToolHandler } from './ShadowToolHandler';
import '../../resources/locale/en';

import '../../../../../src/global';
Oskari.setLang('en');
const stateHandler = new ShadowToolHandler((date, time) => stateHandler.update(date, time));

storiesOf('ShadowTool', module)
    .add('initial', () => (
        <LocaleProvider value={{ bundleKey: 'ShadowingPlugin3d' }}>
            <ShadowTool {...stateHandler.getState()}
                controller={stateHandler.getController()}
            />
        </LocaleProvider>
    ));
