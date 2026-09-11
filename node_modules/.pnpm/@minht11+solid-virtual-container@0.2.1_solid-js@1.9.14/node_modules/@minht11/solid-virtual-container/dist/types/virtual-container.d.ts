import { JSX } from 'solid-js';
import { VirtualContainerProps } from './types';
export interface VirtualState {
    focusPosition: number;
    mainAxis: {
        totalItemCount: number;
        focusPosition: number;
        scrollValue: number;
    };
    crossAxis: {
        totalItemCount: number;
    };
}
export declare function VirtualContainer<T>(props: VirtualContainerProps<T>): JSX.Element;
