import { useApi } from '@/composables/useApi';
import { Event } from '@/types/event';

const { getApi, postApi } = useApi();

export function useEventApi() {
  const url = {
    eventList: '/event',
  };

  function getEventList() {
    return getApi<Event[]>(url.eventList);
  }

  return {
    getEventList,
  };
}
