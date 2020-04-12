import { Team } from './Team'

export interface TeamFTUStats {
  id: number,
  name: string,
  maps_played: number,
  p_round_wins: string,
  p_opk: string,
  p_multik: string
  p_5vs4: string,
  p_4vs5: string,
  p_traded: string,
  utility_adr: string,
  utility_fa: string
}

export interface TeamPistolStats {
  id: number,
  name: string,
  p_win: string,
  p_2_conv: string,
  p_2_break: string
}

export interface TeamExtraStats {
  team: Team,
  ftu: TeamFTUStats,
  pistol: TeamPistolStats,
}
