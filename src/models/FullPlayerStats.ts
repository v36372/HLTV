import { Country } from './Country'
import { Team } from './Team'

export interface IndividualStats {
  readonly totalOpeningKills: number
  readonly totalOpeningDeaths: number
  readonly openingKillRatio: number
  readonly openingKillRating: number
  readonly p_teamWinAfterFirstKill: string
  readonly p_firstKillInWonRounds: string
  readonly r_0_kill: number
  readonly r_1_kill: number
  readonly r_2_kill: number
  readonly r_3_kill: number
  readonly r_4_kill: number
  readonly r_5_kill: number
  readonly rifle_kill: number
  readonly sniper_kill: number
  readonly smg_kill: number
  readonly pistol_kill: number
  readonly grenade_kill: number
  readonly other_kill: number
}

export interface ClutchesStats {
  readonly w_1on1: number
  readonly l_1on1: number
  readonly w_1on2: number
  readonly l_1on2: number
}

export interface FullPlayerStats {
  readonly name?: string
  readonly ign?: string
  readonly image?: string
  readonly age?: number
  readonly country: Country
  readonly team?: Team
  readonly statistics: {
    kills: string
    headshots: string
    deaths: string
    kdRatio: string
    damagePerRound: string
    grenadeDamagePerRound: string
    mapsPlayed: string
    roundsPlayed: string
    killsPerRound: string
    assistsPerRound: string
    deathsPerRound: string
    savedByTeammatePerRound: string
    savedTeammatesPerRound: string
    rating: string
  }
  individualStats: IndividualStats
  clutchesStats: ClutchesStats
}
