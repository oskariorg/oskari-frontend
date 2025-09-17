/*
The base html is:
------
div.oskari-root-el
    (nav)
    (div.functionality-sidebar)
    div.oskari-map-container-el
        div.oskari-map-impl-el
------
nav - optional (geoportal has it, embedded does not)
- expected to be present on the HTML if needed
- holds the main menu with "tiles", toolbar etc and it can also be after map-container for right-handed navigation

div.functionality-sidebar - optional
- created at runtime by functionalities
- functionality specific sidebar for things like the publisher, printout, analysis etc
- nav is usually hidden and this is prepended to .oskari-root-el when active

div.oskari-map-container-el
- created at runtime by core functionality OR mapped to an existing element with id #contentMap
- tries to stretch as much as there is space available as container where the map component is located in
- limits the maximum size of map

div.oskari-map-impl-el
- created at runtime by core functionality OR mapped to an existing element with id #mapdiv
- root for the actual map engine impl == 'target' for OpenLayers Map
- sets the size of the map: usually as large as oskari-map-container-el, but in publisher the preview size is set by limiting the size of this element

*/

// constants for constructing/referencing the base HTML
const DEFAULT_ROOT_EL_ID = 'oskari';
const MAP_CONTAINER_ID = 'contentMap';
const MAP_IMPL_ID = 'mapdiv';
const ROOT_EL_CLASS_FOR_STYLING = 'oskari-root-el';
const MAP_CONTAINER_EL_CLASS_FOR_STYLING = 'oskari-map-container-el';
const MAP_IMPL_EL_CLASS_FOR_STYLING = 'oskari-map-impl-el';

const APP_EMBEDDED_CLASS = 'published';
const getBodyTag = () => document.getElementsByTagName('body')[0];

let rootEl;
let mapContainerEl;
let mapImplEl;
const setRootEl = (id) => {
    if (id) {
        rootEl = document.getElementById(id);
    }
    if (!rootEl) {
        rootEl = getBodyTag();
        if (!rootEl.style.height) {
            // rendering directly to body and no height set
            // -> set CSS to follow expected styling/assume full screen app
            // svh = small viewport, to prevent scroll behavior
            rootEl.style.height = '100svh';
        }
    }
    // use styles from .oskari-root-el for body like display: flex
    rootEl.classList.add(ROOT_EL_CLASS_FOR_STYLING);
    // generate other DOM elements
    mapContainerEl = document.getElementById(MAP_CONTAINER_ID);
    if (!mapContainerEl) {
        mapContainerEl = document.createElement('div');
        // do we need the id here?
        mapContainerEl.setAttribute('id', MAP_CONTAINER_ID);
        // add "published" for published maps
        mapContainerEl.classList.add(Oskari.app.getType());
        rootEl.append(mapContainerEl);
    }
    mapContainerEl.classList.add(MAP_CONTAINER_EL_CLASS_FOR_STYLING);
    mapImplEl = document.getElementById(MAP_IMPL_ID);
    if (!mapImplEl) {
        mapImplEl = document.createElement('div');
        // do we need the id here?
        mapImplEl.setAttribute('id', MAP_IMPL_ID);
        mapContainerEl.append(mapImplEl);
    }
    mapImplEl.classList.add(MAP_IMPL_EL_CLASS_FOR_STYLING);
    // TODO: navigation?
    return rootEl;
};

const getRootEl = () => {
    if (!rootEl) {
        return setRootEl(DEFAULT_ROOT_EL_ID);
    }
    return rootEl;
};

const getMapContainerEl = () => {
    if (!rootEl) {
        setRootEl(DEFAULT_ROOT_EL_ID);
    }
    return mapContainerEl;
};

const getMapImplEl = () => {
    if (!rootEl) {
        setRootEl(DEFAULT_ROOT_EL_ID);
    }
    return mapImplEl;
};

const getWidth = (el = getRootEl()) => {
    return el.clientWidth || parseInt(getComputedStyle(el).getPropertyValue('width'));
};

const getHeight = (el = getRootEl()) => {
    return el.clientHeight || parseInt(getComputedStyle(el).getPropertyValue('height'));
};

const isEmbedded = () => {
    // 'published' is assumed to be in map container as class when the app is in "embedded mode"
    // publisher functionality sets this to fake it
    // published.jsp on server has it by default
    // TODO: Maybe we should just `return Oskari.app.getType() === APP_EMBEDDED_CLASS`
    return getMapContainerEl().classList.contains(APP_EMBEDDED_CLASS);
};

const showNavigation = (show) => {
    const nav = getNavigationEl();
    if (nav) {
        if (show) {
            nav.style.display = 'block';
            setMenuScrollIndicator();
        } else {
            nav.style.display = 'none';
        }
    }
};

const isNavigationVisible = () => {
    const nav = getNavigationEl();
    if (!nav) return false;
    const style = window.getComputedStyle(nav);
    return style.getPropertyValue('display') !== 'none';
};

const getNavigationEl = () => {
    return [...Oskari.dom.getRootEl().children].find(c => c.localName === 'nav');
};

const setMenuScrollIndicator = () => {
    const indicatorNotNeeded = () => {
        const navEl = Oskari.dom.getNavigationEl();
        if (!navEl) return true;
        const scrollTop = navEl.scrollTop;
        const scrollHeight = navEl.scrollHeight;
        const offsetHeight = navEl.offsetHeight;
        const contentHeight = scrollHeight - offsetHeight;
        return contentHeight <= scrollTop;
    };
    const setIndicator = (event) => {
        window.requestAnimationFrame(() => {
            if (indicatorNotNeeded()) {
                getNavigationEl().classList.remove('show-scroll-icon');
            } else {
                getNavigationEl().classList.add('show-scroll-icon');
            }
        });
    };
    const navElement = getNavigationEl();
    if (navElement) {
        setIndicator();
        if (!navElement.querySelector('.scroll-indicator')) {
            const scrollIndicator = document.createElement('div');
            scrollIndicator.className = 'scroll-indicator';
            const scrollIcon = document.createElement('div');
            scrollIcon.className = 'scroll-icon';
            scrollIndicator.appendChild(scrollIcon);
            navElement.appendChild(scrollIndicator);
            navElement.addEventListener('scroll', setIndicator);
            if (indicatorNotNeeded()) {
                getNavigationEl().classList.remove('show-scroll-icon');
            }
        }
    }
};

export const DOMHelper = {
    setRootEl,
    getRootEl,
    getMapContainerEl,
    getMapImplEl,
    isEmbedded,
    getWidth,
    getHeight,
    showNavigation,
    isNavigationVisible,
    getNavigationEl,
    setMenuScrollIndicator,
    APP_EMBEDDED_CLASS
};
