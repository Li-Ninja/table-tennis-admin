import {
  Arr,
  Msg,
} from '@/types/rule';

function returnMessage<T, A extends Arr = Arr>(val: T, message: Msg<T>, ...args: [...A]) {
  return typeof message === 'function' ? message(val, ...args) : message;
}

export const required = <T = any>(message: Msg<T> = '必填') => (val: T): true | string => !(val === undefined || val === ('' as any) || val === null) || returnMessage<T>(val, message);
