import { useApi } from '@/composables/useApi';
import {
  Login,
  LoginPost,
} from '@/types/auth';

const { postApi } = useApi();

export function useAuthApi() {
  const url = {
    login: '/login',
  };

  function getLoginToken<D = Login>(postData: LoginPost) {
    return postApi<D>(url.login, postData);
  }

  return {
    getLoginToken,
  };
}
