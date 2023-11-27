import { AxiosRequestConfig } from 'axios';

export interface Login {
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
