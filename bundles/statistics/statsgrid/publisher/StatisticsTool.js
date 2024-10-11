import React from 'react';
import PropTypes from 'prop-types';
import { Button, Message } from 'oskari-ui';
import { BUNDLE_KEY } from '../constants';
import { AbstractStatsPluginTool } from './AbstractStatsPluginTool';

const Component = ({ controller }) => (
    <Button onClick={() => controller.show('search')}>
        <Message bundleKey={BUNDLE_KEY} messageKey='publisher.statistics' />
    </Button>
);
Component.propTypes = {
    controller: PropTypes.object.isRequired
};

class StatisticsTool extends AbstractStatsPluginTool {
    constructor (...args) {
        super(...args);
        this.index = 7;
        this.id = 'statistics';
    }

    getComponent () {
        return {
            component: Component,
            handler: this.getViewHandler()
        };
    }

    isEnabled () {
        return true;
    }

    getTool () {
        return {
            ...super.getTool(),
            hideCheckbox: true
        };
    }

    getValues () {
        if (!this._isStatsActive()) {
            return null;
        }
        const { location } = this.getPlugin()?.getConfig() || {};
        return {
            configuration: {
                statsgrid: {
                    conf: {
                        location: location || {
                            classes: 'bottom right'
                        }
                    },
                    state: this.getSandbox().getStatefulComponents().statsgrid.getState()
                }
            }
        };
    }
};

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.mapframework.publisher.tool.StatisticsTool',
    StatisticsTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);
