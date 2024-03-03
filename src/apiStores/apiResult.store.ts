import { defineStore } from 'pinia';
import {
  readonly, ref, shallowReactive, toRefs,
} from 'vue';
import { useResultApi } from '@/apis/result.api';
import {
  Result, ResultGet, ResultPost, ResultRankingPost,
} from '@/types/result';

export const useApiResultStore = defineStore('apiResult', () => {
  // state
  const state = shallowReactive({
    resultList: [] as Result[],
  });

  const test = ref('');

  async function getResultList(data: ResultGet) {
    const res = await useResultApi().getResultList(data);

    if (res?.data) {
      state.resultList = res.data;
    }
  }

  function postResultList(postData: ResultPost[]) {
    return useResultApi().postResult(postData);
  }

  function postResultRankingList(postData: ResultRankingPost[]) {
    return useResultApi().postResultRanking(postData);
  }

  return {
    ...toRefs(readonly(state)),
    getResultList,
    postResultList,
    postResultRankingList,
    state,
    test,
  };
});
