import { useApi } from '@/composables/useApi';
import {
  Result, ResultPost,
} from '@/types/result';

const { getApi, postApi } = useApi();

export function useResultApi() {
  const url = {
    result: '/result',
    resultList: '/result',
  };

  function getResultList() {
    return getApi<Result[]>(url.resultList);
  }

  function postResult(postData: ResultPost[]) {
    return postApi(url.result, postData);
  }

  return {
    getResultList,
    postResult,
  };
}
