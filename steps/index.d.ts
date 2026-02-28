import { Step } from '../index.d.js';

export declare const round: Step;
export declare const approximate: Step;

export declare const minute: number;
export declare const hour: number;
export declare const day: number;
export declare const week: number;
export declare const month: number;
export declare const year: number;

export function getDate(input: number | Date): Date;