import { defineStore } from 'pinia';
import {
  computed, readonly, shallowReactive, toRefs,
} from 'vue';
import { useEventApi } from '@/apis/event.api';
import { Event } from '@/types/event';

export const useApiEventStore = defineStore('apiEvent', () => {
  // state
  const state = shallowReactive({
    eventList: [] as Event[],
  });

  async function getEventList() {
    const res = await useEventApi().getEventList();

    if (res?.data) {
      state.eventList = res.data;
    }
  }

  const eventOptions = computed(() => [
    {
      key: null,
      label: '',
    },
    ...state.eventList.map(item => ({
      key: item.id,
      label: item.name,
    })),
  ]);

  return {
    ...toRefs(readonly(state)),
    getEventList,
    state,
    eventOptions,
  };
});
