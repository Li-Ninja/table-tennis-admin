import { useApi } from '@/composables/useApi';
import {
  ResultItem, ResultItemGet, ResultItemPost, ResultItemPut,
} from '@/types/resultItem';

const { getApi, postApi, putApi, deleteApi } = useApi();

export function useResultItemApi() {
  const url = {
    resultItem: '/resultItem',
    resultItemList: '/resultItem',
  };

  function getResultItemList(postData: ResultItemGet) {
    // TODO 調整寫法
    return getApi<ResultItem[]>(`${url.resultItemList}/${postData.result_Id}`);
  }

  function postResultItem(postData: ResultItemPost[]) {
    return postApi(url.resultItem, postData);
  }

  function putResultItem(postData: ResultItemPut[]) {
    return putApi(url.resultItem, postData);
  }

  function deleteResultItem(id: number) {
    // TODO
    return deleteApi(`${url.resultItem}/${id}`);
  }

  return {
    getResultItemList,
    postResultItem,
    putResultItem,
    deleteResultItem,
  };
}
