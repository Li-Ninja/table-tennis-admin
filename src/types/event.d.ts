import { EventTypeEnum } from '@/enums/common.enum';

export interface Event {
  id: number;
  name: number;
  date: string;
  isSingleMatch: boolean;
  type: EventTypeEnum;
}
