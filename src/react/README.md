## Oskari UI component library

Components in this folder can be accessed using "oskari-ui" alias.
Oskari UI components use Ant Design library.

### Ant Design global styles

As <https://ant.design/docs/react/customize-theme#How-to-avoid-modifying-global-styles> states:
> Currently ant-design is designed as a whole experience and modify global styles (eg body etc). If you need to integrate ant-design as a part of an existing website, it's likely you want to prevent ant-design to override global styles.

To prevent global styles we have configured webpack to load an alternate less file: [ant-globals.less](ant-globals.less).

### Customizing theming

Ant Design components can be customized by modifying [ant-theme.less](ant-theme.less).
