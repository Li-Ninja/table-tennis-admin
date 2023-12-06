import { defineStore } from 'pinia';
import {
  readonly, ref, shallowReactive, toRefs,
} from 'vue';
import { useResultItemApi } from '@/apis/resultItem.api';
import {
  ResultItem, ResultItemPost,
} from '@/types/resultItem';

export const useApiResultItemStore = defineStore('apiResultItem', () => {
  // state
  const state = shallowReactive({
    resultItemList: [] as ResultItem[],
  });

  const test = ref('');

  async function getResultItemList(id: ResultItem['result_Id']) {
    const res = await useResultItemApi().getResultItemList({ result_Id: id });

    if (res?.data) {
      state.resultItemList = res.data;
    }
  }

  function postResultItemList(postData: ResultItemPost[]) {
    return useResultItemApi().postResultItem(postData);
  }

  return {
    ...toRefs(readonly(state)),
    getResultItemList,
    postResultItemList,
    state,
    test,
  };
});
