import { Measurements } from './create-measurements-observer';
export declare const getIntegerOrZero: (value: number) => number;
interface AxisValues {
    totalItemCount: number;
    focusPosition: number;
}
export declare const createMainAxisPositions: (measurements: Measurements, axis: AxisValues, getOverscan: () => number | undefined) => import("solid-js").Accessor<number[]>;
export {};
