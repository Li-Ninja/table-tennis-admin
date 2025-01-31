export enum MenuEnum {
  Login = 'Login',
  Home = 'Home',

  // Player
  Player = 'Player',
  PlayerTable = 'PlayerTable',
  PlayerAdd = 'PlayerAdd',

  // Result
  Result = 'Result',
  ResultTable = 'ResultTable',
  ResultAdd = 'ResultAdd',
  ResultRankingAdd = 'ResultRankingAdd',

  // ChangeLog
  ChangeLog = 'ChangeLog',
  ChangeLogTable = 'ChangeLogTable',
}

export enum EventTypeEnum {
  // 年終賽單打
  AnnualSingle = 1,
  // 年終賽雙打
  AnnualDouble = 2,
  // 積分賽
  Score = 3,
}

export enum SubEventTypeEnum {
  Single = 1,
  Double = 2,
}

export enum DoublePlayerStatusEnum {
  Disabled = 0,
  Enable = 1
}
