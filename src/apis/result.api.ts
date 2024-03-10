import { useApi } from '@/composables/useApi';
import { getUtcDateTime } from '@/constants/common.constant';
import {
  Result, ResultGet, ResultPost, ResultPut, ResultRankingPost,
} from '@/types/result';

const { getApi, postApi, putApi, deleteApi } = useApi();

export function useResultApi() {
  const url = {
    result: '/result',
    resultRanking: '/result/resultRanking',
    resultList: '/result',
  };

  function getResultList(data: ResultGet) {
    return getApi<Result[]>(url.resultList, {
      ...data,
      startDate: getUtcDateTime(data.startDate),
    });
  }

  function postResult(postData: ResultPost[]) {
    return postApi(url.result, postData);
  }

  function postResultRanking(postData: ResultRankingPost[]) {
    return postApi(
      url.resultRanking,
      postData.map(item => ({
        ...item,
        resultDateTime: getUtcDateTime(item.resultDateTime),
      })),
    );
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
    postResultRanking,
    putResult,
    deleteResult,
  };
}
