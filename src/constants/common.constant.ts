import { EventTypeEnum } from '@/enums/common.enum';

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
