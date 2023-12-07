import { AxiosRequestConfig } from 'axios';

export interface Login {
  res: any;
  [x: string]: any;
  token: string;
}

export interface LoginPost {
  account: string;
  password: string;
}

export interface LocalAxiosRequestConfig extends AxiosRequestConfig {
  headers?: {
    Authorization: string;
  };
}
