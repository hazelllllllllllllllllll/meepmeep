export const createArray = (startPosition, count) => {
    const array = [];
    for (let i = 0; i < count; i += 1) {
        array.push(startPosition + i);
    }
    return array;
};
export const getFiniteNumberOrZero = (value) => Number.isFinite(value) ? value : 0;
export const doesElementContainFocus = (element) => element.matches(':focus-within');
export const findFocusedElement = (container) => {
    // If element contains focus it must be instanceof HTMLElement,
    // otherwise it's always null
    const element = container.querySelector(':focus');
    return element;
};
export const clickFocusedElement = (container) => {
    const element = findFocusedElement(container);
    if (element) {
        element.click();
        return true;
    }
    return false;
};
// Get element offset relative to the target element excluding css transforms.
export const getOffsetBetweenElements = (targetEl, startEl) => {
    let element = startEl;
    let top = 0;
    let left = 0;
    while (element && targetEl !== element) {
        const { offsetTop, offsetLeft, offsetParent } = element;
        // Check if nearest containing root is or is inside target element.
        if (targetEl.contains(offsetParent)) {
            top += offsetTop;
            left += offsetLeft;
        }
        else {
            top += offsetTop - targetEl.offsetTop;
            left += offsetLeft - targetEl.offsetLeft;
            break;
        }
        element = offsetParent;
    }
    return {
        offsetTop: top,
        offsetLeft: left,
    };
};
