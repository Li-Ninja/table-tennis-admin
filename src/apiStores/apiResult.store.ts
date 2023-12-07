import { defineStore } from 'pinia';
import {
  readonly, ref, shallowReactive, toRefs,
} from 'vue';
import { useResultApi } from '@/apis/result.api';
import {
  Result, ResultPost,
} from '@/types/result';

export const useApiResultStore = defineStore('apiResult', () => {
  // state
  const state = shallowReactive({
    resultList: [] as Result[],
  });

  const test = ref('');

  async function getResultList() {
    const res = await useResultApi().getResultList();

    if (res?.data) {
      state.resultList = res.data;
    }
  }

  function postResultList(postData: ResultPost[]) {
    return useResultApi().postResult(postData);
  }

  return {
    ...toRefs(readonly(state)),
    getResultList,
    postResultList,
    state,
    test,
  };
});
