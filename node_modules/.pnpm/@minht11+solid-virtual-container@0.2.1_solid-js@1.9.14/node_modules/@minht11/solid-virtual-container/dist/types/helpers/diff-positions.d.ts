export declare const ELEMENT_USED_FOR_FOCUS = 1;
interface DiffPositionsOptions {
    total: number;
    focusPosition: number;
    positionCount: number;
    startPosition: number;
    prevStartPosition: number;
    prevPositions: number[];
}
export declare const diffPositions: (options: DiffPositionsOptions) => any[];
export {};
