import { ScrollDirection, VirtualItemSize } from '../types';
export interface Axis {
    main: number;
    cross: number;
}
export interface Measurements {
    isMeasured: boolean;
    mainAxisScrollValue: number;
    itemSize: Axis;
    target: Axis;
    container: {
        offsetMain: number;
        offsetCross: number;
        main: number;
        cross: number;
    };
}
export interface MeasurementsObserverProps {
    scrollTarget?: HTMLElement;
    direction?: ScrollDirection;
    itemSize: VirtualItemSize;
}
export declare const createMeasurementsObserver: (props: MeasurementsObserverProps) => {
    containerEl: import("solid-js").Accessor<HTMLDivElement>;
    setContainerRefEl: (v: HTMLDivElement | ((prev: HTMLDivElement) => HTMLDivElement)) => HTMLDivElement;
    isDirectionHorizontal: import("solid-js").Accessor<boolean>;
    measurements: import("solid-js/store").Store<Measurements>;
};
