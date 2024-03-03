import { useApi } from '@/composables/useApi';
import {
  Result, ResultGet, ResultPost, ResultPut,
} from '@/types/result';

const { getApi, postApi, putApi, deleteApi } = useApi();

export function useResultApi() {
  const url = {
    result: '/result',
    resultList: '/result',
  };

  function getResultList(data: ResultGet) {
    return getApi<Result[]>(url.resultList, data);
  }

  function postResult(postData: ResultPost[]) {
    return postApi(url.result, postData);
  }

  function putResult(postData: ResultPut) {
    return putApi(url.result, postData);
  }

  function deleteResult(id: number) {
    // TODO
    return deleteApi(`${url.result}/${id}`);
  }

  return {
    getResultList,
    postResult,
    putResult,
    deleteResult,
  };
}
