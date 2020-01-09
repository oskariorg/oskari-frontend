import React from 'react';
import { storiesOf } from '@storybook/react';

import { ShadowControl } from './ShadowControl';

storiesOf('ShadowControl', module)
    .add('initial', () => (
        <div style={{ width: '80px' }}>
            <ShadowControl mapInMobileMode={false}/>
        </div>
    ));
