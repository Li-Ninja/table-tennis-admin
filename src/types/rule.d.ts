export type Arr = readonly any[];

export type Msg<T, A extends Arr = Arr> = string | ((val: T, ...args: A[]) => string);
