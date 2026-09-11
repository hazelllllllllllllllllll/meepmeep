export declare const createArray: (startPosition: number, count: number) => any[];
export declare const getFiniteNumberOrZero: (value: number) => number;
export declare const doesElementContainFocus: (element: Element) => boolean;
export declare const findFocusedElement: (container: Element | Document) => HTMLElement | null;
export declare const clickFocusedElement: (container: Element | Document) => boolean;
export declare const getOffsetBetweenElements: (targetEl: HTMLElement, startEl: HTMLElement) => {
    offsetTop: number;
    offsetLeft: number;
};
