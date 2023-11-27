import { boot } from 'quasar/wrappers';
import { bootApi } from '@/composables/useApi';

export default boot(({ router }) => {
  bootApi(router);
});
