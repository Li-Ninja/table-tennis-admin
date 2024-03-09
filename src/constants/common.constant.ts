import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { EventTypeEnum } from '@/enums/common.enum';

dayjs.extend(utc);

export const eventTypeOptions = [
  {
    key: null,
    label: '',
  },
  ...Object.entries(EventTypeEnum)
    .filter(([key]) => !Number.isFinite(Number(key)))
    .map(([key, value]) => ({
      key: value as EventTypeEnum,
      // TODO label 要改成 i18n
      label: key,
    })),
];

export const getUtcDateTime = (dateTime: string | null) => (dateTime ? dayjs(dateTime).utc().format() : '');
