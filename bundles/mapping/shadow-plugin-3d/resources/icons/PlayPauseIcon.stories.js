import React from 'react';
import { storiesOf } from '@storybook/react';

import { PlayPauseIcon } from './PlayPauseIcon';

storiesOf('PlayPauseIcon', module)
    .add('initial true', () => (
        <div style={{ width: '80px' }}>
            <PlayPauseIcon initial={true}/>
        </div>
    ))
    .add('initial false', () => (
        <div style={{ width: '80px' }}>
            <PlayPauseIcon initial={false}/>
        </div>
    ));
