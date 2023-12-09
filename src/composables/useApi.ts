import axios, {
  AxiosError, AxiosRequestConfig, AxiosResponse, HttpStatusCode,
} from 'axios';
import { Dialog } from 'quasar';
import { Router } from 'vue-router';
import { MenuEnum } from '@/enums/common.enum';
import { LocalAxiosRequestConfig } from '@/types/auth';
import { useLocalStorage } from '@/utils/localStorage.util';

const { getToken, clearToken } = useLocalStorage();

type ApiResponse<D> = AxiosResponse<D, any> | undefined;
type AsyncApiResponse<D> = Promise<ApiResponse<D>>;

function requestHandler(request: AxiosRequestConfig) {
  const token = getToken();

  if (token) {
    (request.headers as LocalAxiosRequestConfig['headers']) = {
      Authorization: `Bearer ${token}`,
    };
  }

  return request;
}

function reLoginService<D>(router: Router | undefined, err: AxiosError<D>) {
  clearToken();

  Dialog.create({
    title: '登出',
    message: '重新登入',
    persistent: true,
  }).onOk(() => {
    if (!router || router.currentRoute.value.name === MenuEnum.Login) {
      return err.response as ApiResponse<D>;
    }

    return void router.push({ name: MenuEnum.Login });
  });
}

function prepareApi(router?: Router) {
  const api = axios.create({
    // can last connecting 1 min
    timeout: 60000,
    baseURL: `${process.env.API_DOMAIN}/api`,
  });

  function getApi<D, P = any>(url: string, paramsData?: P)
    : AsyncApiResponse<D> {
    return api.get<D>(url, { params: paramsData })
      .then(res => res)
      .catch((err: AxiosError<D>) => {
        if (err.response?.status === HttpStatusCode.Forbidden) {
          reLoginService(router, err);
        }

        if (err.code === 'ERR_NETWORK') {
          reLoginService(router, err);
        }

        return err.response as ApiResponse<D>;
      });
  }

  function postApi<D, P = any>(url: string, postData: P)
    : AsyncApiResponse<D> {
    return api.post<D>(url, postData)
      .then(res => res)
      .catch((err: AxiosError<D>) => {
        if (err.response?.status === HttpStatusCode.Forbidden) {
          reLoginService(router, err);
        }

        if (err.code === 'ERR_NETWORK') {
          reLoginService(router, err);
        }

        return err.response as ApiResponse<D>;
      });
  }

  function putApi<D, P = any>(url: string, postData: P)
    : AsyncApiResponse<D> {
    return api.put<D>(url, postData)
      .then(res => res)
      .catch((err: AxiosError<D>) => {
        if (err.response?.status === HttpStatusCode.Forbidden) {
          reLoginService(router, err);
        }

        if (err.code === 'ERR_NETWORK') {
          reLoginService(router, err);
        }

        return err.response as ApiResponse<D>;
      });
  }

  function deleteApi<D>(url: string)
    : AsyncApiResponse<D> {
    return api.delete<D>(url)
      .then(res => res)
      .catch((err: AxiosError<D>) => {
        if (err.response?.status === HttpStatusCode.Forbidden) {
          reLoginService(router, err);
        }

        if (err.code === 'ERR_NETWORK') {
          reLoginService(router, err);
        }

        return err.response as ApiResponse<D>;
      });
  }

  api.interceptors.request.use(requestHandler);

  return {
    getApi,
    postApi,
    putApi,
    deleteApi,

  };
}

let instance: ReturnType<typeof prepareApi>;

export function bootApi(router: Router) {
  if (!instance) {
    instance ??= prepareApi(router);
  }

  return instance;
}

export function useApi() {
  return instance;
}
