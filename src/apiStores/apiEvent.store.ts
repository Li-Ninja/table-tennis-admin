import { defineStore } from 'pinia';
import {
  readonly, ref, shallowReactive, toRefs,
} from 'vue';
import { useEventApi } from '@/apis/event.api';
import { Event } from '@/types/event';

export const useApiEventStore = defineStore('apiEvent', () => {
  // state
  const state = shallowReactive({
    eventList: [] as Event[],
  });

  const test = ref('');

  async function getEventList() {
    const res = await useEventApi().getEventList();

    if (res?.data) {
      state.eventList = res.data;
    }
  }

  return {
    ...toRefs(readonly(state)),
    getEventList,
    state,
    test,
  };
});
