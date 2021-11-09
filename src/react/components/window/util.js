
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
    const halfWidth = width/2;
    const halfHeight = height/2;
    const screenTopLimit = -5;
    const onMouseMove = (event) => {
        // prevents text selection from other elements while dragging
        event.preventDefault();
        const element = elementRef.current;
        if (!element) {
            return;
        }
        position.x += event.movementX;
        position.y += event.movementY;
        const outFromLeft = position.x < -halfWidth;
        const outFromRight = position.x + halfWidth > availableWidth;
        const outFromUp = position.y < screenTopLimit; // the header should remain visible to make it possible to drag back on screen
        const outFromBottom = position.y + halfHeight > availableHeight;
        const outOfScreen = outFromLeft || outFromRight || outFromUp || outFromBottom;
        if (!outOfScreen) {
            element.classList.remove('outofviewport');
            // don't make the actual move if we would move off-screen or we don't get an element to move
            element.style.transform = `translate(${position.x}px, ${position.y}px)`;
            setPosition(position);
        } else {
            element.classList.add('outofviewport');
            if (outFromLeft) {
                setPosition({
                    ...position,
                    x: -halfWidth
                });
            } else if (outFromRight) {
                setPosition({
                    ...position,
                    x: Math.max(availableWidth-halfWidth, 0)
                });
            } else if (outFromUp) {
                setPosition({
                    ...position,
                    y: screenTopLimit
                });
            } else if (outFromBottom) {
                setPosition({
                    ...position,
                    y: Math.max(availableHeight-halfHeight, 0)
                });
            }
        }
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