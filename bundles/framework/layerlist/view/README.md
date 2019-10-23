## Layerlist component structure

Each component folder contains `index.js`. It exports only those components which are to be used outside the folder.
Using this structure, it's possible to import desired components just by referring to the containing folder. (ie. `import { LayerList } from  './LayerList/'`).
