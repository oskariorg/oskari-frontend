const hasObserver = typeof ResizeObserver !== 'undefined';
const elementMap = {};
/**
 * Detect new size for Observer entry
 * @param  entry 
 * @returns object with width and height keys
 */
const getNewSize = (entry) => {
    // width:  200  is  200px
    // height:  68  is  68px
    //console.log('width: ', entry.borderBoxSize[0].inlineSize, ' is ', cs.width);
    //console.log('height: ', entry.borderBoxSize[0].blockSize, ' is ', cs.height);
    const result = {
        width: entry.borderBoxSize[0].inlineSize,
        height: entry.borderBoxSize[0].blockSize
    };
    return result;
};
const SIZE_OBSERVER = hasObserver ? new ResizeObserver(entries => {
    for (let entry of entries) {
        const result = getNewSize(entry);
        const prev = getCurrentData(entry.target);
        if (prev) {
            //console.log('Size changed from', prev.size, 'to', result);
            const prevSize = prev.size;
            prev.size = result;
            if (prevSize.width !== result.width || prevSize.height !== result.height) {
                // ensure there is a change
                // TODO: throttle calls
                prev.listeners.forEach(fn => fn(result, prevSize, entry.target));
            }
        }
    }
}) : null;

/**
 * @param {HTMLElement} element
 * @returns {Object} with references to the element, previously recorded size and listeners
 */
const getCurrentData = (element) => {
    return elementMap[element];
};

/**
 * Starts monitoring element for size changes and notifies listeners
 * @param {HTMLElement} element to monitor
 * @param {Function} notifyFn function to be called with new and previous size
 */
export const monitorResize = (element, notifyFn) => {
    if (!element) {
        return;
    }
    const currentMonitor = getCurrentData(element);
    if (currentMonitor && typeof notifyFn === 'function') {
        currentMonitor.listeners.push(notifyFn);
    } else {
        SIZE_OBSERVER && SIZE_OBSERVER.observe(element);
        elementMap[element] = {
            element,
            listeners: [notifyFn].filter(fn => typeof fn === 'function'),
            size: {
                width: element.offsetWidth,
                height: element.offsetHeight
            }
        }
    }
};

/**
 * Removes function from monitoring listeners
 * @param {Function} notifyFn function used when monitorResize was called
 */
export const unmonitorResize = (notifyFn) => {
    const removableElements = [];
    Object.keys(elementMap).forEach(element => {
        const listeners = elementMap[element].listeners;
        const newListeners = listeners.filter(fn => fn !== notifyFn);
        if (!newListeners.length) {
            removableElements.push(element.element);
        } else {
            elementMap[element].listeners = newListeners;
        }
    });
    removableElements.forEach(el => unmonitorElement(el));
};
/**
 * Once all listeners have been removed can be used to stop listening to changes
 * @param {HTMLElement} element
 */
const unmonitorElement = (element) => {
    if (!element) {
        return;
    }
    try {
        SIZE_OBSERVER && SIZE_OBSERVER.unobserve(element);
    } catch(ignored) {}
    delete elementMap[element];
};
