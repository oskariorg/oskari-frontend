import { configure } from '@storybook/react';

function loadStories() {
    // loads everything under bundles with filename ending .stories.js
    // Note! doesn't work with .stories.js (needs prefix)
    const req = require.context("../bundles", true, /\.stories\.js$/);
    req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);