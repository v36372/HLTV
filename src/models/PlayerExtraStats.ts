export interface PlayerFlashStats {
  readonly id?: number
  readonly name?: string
  readonly mapsPlayed: number
  readonly thrown: number
  readonly blinded: string
  readonly oppBlinded: string
  readonly flashAssist: number
  readonly success: number
}

export interface PlayerOpenStats {
  readonly mapsPlayed: number
  readonly kpr: number
  readonly dpr: number
  readonly p_attempts: string
  readonly success: string
  readonly rating: number
}

export interface PlayerPistolStats {
  readonly mapsPlayed: number
  readonly diff: number
  readonly kd: number
  readonly rating: number
}

export interface PlayerExtraStats {
  readonly name?: string
  readonly id?: number
  flashStats: PlayerFlashStats
  openStats: PlayerOpenStats
  pistolStats: PlayerPistolStats
}
