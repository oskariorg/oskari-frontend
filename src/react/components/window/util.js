
export const getAvailableWidth = () => {
    // width of <body>
    return document.body.clientWidth ||
        // width of <html>
        document.documentElement.clientWidth ||
        // window's width
        window.innerWidth;
};

export const getAvailableHeight = () => {
    // height of <body>
    return document.body.clientHeight ||
        // height of <html>
        document.documentElement.clientHeight ||
        // window's height
        window.innerHeight;
};

const DEFAULT_WIDTH = 50;
const DEFAULT_HEIGHT = 30;

export const createDraggable = (position, setPosition, elementRef) => {
    if (typeof position !== 'object') {
        throw new TypeError('Pass an object with x and y keys as first param');
    }
    if (typeof setPosition !== 'function') {
        throw new TypeError('Pass function to update position as second param');
    }
    if (!elementRef) {
        throw new TypeError('Pass React.useRef() for the element to move as third param');
    }
    const element = elementRef.current;
    let width = DEFAULT_WIDTH;
    let height = DEFAULT_HEIGHT;
    if (element) {
        const bounds = element.getBoundingClientRect();
        width = bounds.width;
        height = bounds.height;
    }
    const availableWidth = getAvailableWidth();
    const availableHeight = getAvailableHeight();
    const onMouseMove = (event) => {
        // prevents text selection from other elements while dragging
        event.preventDefault();
        position.x += event.movementX;
        position.y += event.movementY;
        const outOfScreen = (position.x < 0 || position.x + width > availableWidth) || (position.y < 0 || position.y + height > availableHeight);
        const element = elementRef.current;
        if (!outOfScreen && element) {
            // don't make the actual move if we would move off-screen or we don't get an element to move
            element.style.transform = `translate(${position.x}px, ${position.y}px)`;
        }
        // update state anyway so the flyout will start moving at/jump to where the mouse cursor re-enters the viewport
        setPosition(position);
    };
    const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
};

export const getPositionForCentering = (elementRef) => {
    if (!elementRef) {
        throw new TypeError('Pass React.useRef() for the element to center');
    }
    const element = elementRef.current;
    let width = DEFAULT_WIDTH;
    let height = DEFAULT_HEIGHT;
    const availableWidth = getAvailableWidth();
    const availableHeight = getAvailableHeight();
    if (element) {
        const bounds = element.getBoundingClientRect();
        width = bounds.width;
        height = bounds.height;
    }
    return {
        x: Math.max((availableWidth - width) / 2, 0),
        y: Math.max((availableHeight - height) / 2, 0)
    };
};