import { Event } from './event';
import { Player } from './player';

export interface Result {
  id: number;
  event_name: number;
  round: number;
  player_name_a_1: Player['id'];
  player_name_a_2: Player['id'] | null;
  player_name_b_1: Player['id'];
  player_name_b_2: Player['id'] | null;
  scoreA: number | null;
  scoreB: number | null;
}

export interface ResultPost {
  event_id: Event['id'] | null;
  round: number | null;
}
