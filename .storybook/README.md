This config is for `"@storybook/react": "6.3.7"` but after other dependency updates, running storybook no longer works properly. Newer version of storybook uses webpack 5 while we are still using webpack 4.

When we have time we should make it work and generate a gallery to show available UI components on oskari.org.

As for now, since it doesn't work currently, it's easier to just remove the dependency as it flags vulnerable dependencies even when its not used.
