import { Event } from './event';
import { Player } from './player';
import { ResultItem } from './resultItem';

export interface Result {
  id: number;
  event_name: number;
  isSingleMatch: boolean;
  round: number;
  player_nameA1: Player['name'] | null;
  player_nameA2: Player['name'] | null;
  player_nameB1: Player['name'] | null;
  player_nameB2: Player['name'] | null;
  player_id_a_1: Player['id'] | null;
  player_id_a_2: Player['id'] | null;
  player_id_b_1: Player['id'] | null;
  player_id_b_2: Player['id'] | null;
  scoreA: number | null;
  scoreB: number | null;
  resultDateTime: string | null;
}

export interface ResultPost {
  event_id: Event['id'] | null;
  round: number | null;
}

export interface ResultRankingPost extends Pick<Result, 'player_id_a_1' | 'player_id_b_1' | 'resultDateTime'> {
  event_id: Event['id'] | null;
  resultItemList: Omit<ResultItem, 'result_Id'>[];
}

export type ResultPut = Pick<Result,
  'id' |
  'player_id_a_1' |
  'player_id_a_2' |
  'player_id_b_1' |
  'player_id_b_2'>;

export interface ResultGet {
  event_id: Event['id'] | null;
  event_type: Event['type'] | null;
  startDate: string | null;
}
