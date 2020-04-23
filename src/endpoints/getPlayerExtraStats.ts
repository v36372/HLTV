import {
  PlayerExtraStats,
  PlayerPistolStats,
  PlayerOpenStats,
  PlayerFlashStats,
} from '../models/PlayerExtraStats'
import { fetchPage, toArray } from '../utils/mappers'
import { RankingFilter } from '../enums/RankingFilter'
import { defaultConfig as config } from '../config'
import { stringify } from 'querystring'

export const getPlayerExtraStats = (proxy: string) => async ({
  startDate,
  endDate,
  rankingFilter,
  minMapCount,
  maps,
}: {
  startDate?: string
  endDate?: string
  rankingFilter?: RankingFilter
  minMapCount?: string
  maps?: string
}): Promise<{}> => {
  const query = stringify({
    startDate,
    endDate,
    rankingFilter,
    minMapCount,
    maps,
  })
  const f$ = await fetchPage(`${config.hltvUrl}/stats/players/flashbangs?${query}`, proxy)
  const p$ = await fetchPage(`${config.hltvUrl}/stats/players/pistols?${query}`, proxy)
  const o$ = await fetchPage(`${config.hltvUrl}/stats/players/openingkills?${query}`, proxy)

  let playerExtraStats = {}
  var create_flash_hash = function (f) {
    var f_hash = {}
    toArray(f('.stats-table.player-ratings-table tbody tr')).forEach((rowEl) => {
      const id = Number(rowEl.find('td').eq(0).find('a').attr('href')!.split('/')[3])
      const name = rowEl.find('td').eq(0).find('a').text()
      const mapsPlayed = Number(rowEl.find('td').eq(1).text())
      const thrown = Number(rowEl.find('td').eq(2).text())
      const blinded = rowEl.find('td').eq(3).text()
      const oppBlinded = rowEl.find('td').eq(4).text()
      const flashAssist = Number(rowEl.find('td').eq(6).text())
      const success = Number(rowEl.find('td').eq(7).text())

      const newFlashStat: PlayerFlashStats = {
        id,
        name,
        mapsPlayed,
        thrown,
        blinded,
        oppBlinded,
        flashAssist,
        success,
      }
      f_hash[id] = newFlashStat
    })
    return f_hash
  }

  var create_pistol_hash = function (p) {
    var pistols_hash = {}
    toArray(p('.stats-table.player-ratings-table tbody tr')).forEach((rowpistolEl) => {
      const id = Number(rowpistolEl.find('td').eq(0).find('a').attr('href')!.split('/')[3])
      const mapsPlayed = Number(rowpistolEl.find('td').eq(2).text())
      const diff = Number(rowpistolEl.find('td').eq(3).text())
      const kd = Number(rowpistolEl.find('td').eq(4).text())
      const rating = Number(rowpistolEl.find('td').eq(5).text())

      const newPistol: PlayerPistolStats = { mapsPlayed, diff, kd, rating }
      pistols_hash[id] = newPistol
    })

    return pistols_hash
  }

  var create_open_hash = function (o) {
    var open_hash = {}
    toArray(o('.stats-table.player-ratings-table tbody tr')).forEach((rowopenEl) => {
      const id = Number(rowopenEl.find('td').eq(0).find('a').attr('href')!.split('/')[3])
      const mapsPlayed = Number(rowopenEl.find('td').eq(1).text())
      const kpr = Number(rowopenEl.find('td').eq(2).text())
      const dpr = Number(rowopenEl.find('td').eq(3).text())
      const p_attempts = rowopenEl.find('td').eq(4).text()
      const success = rowopenEl.find('td').eq(5).text()
      const rating = Number(rowopenEl.find('td').eq(6).text())

      const newOpen: PlayerOpenStats = { mapsPlayed, kpr, dpr, p_attempts, success, rating }
      open_hash[id] = newOpen
    })

    return open_hash
  }

  var flash_hash = create_flash_hash(f$)
  var pistol_hash = create_pistol_hash(p$)
  var opening_hash = create_open_hash(o$)

  for (var id in flash_hash) {
    if (pistol_hash[id] !== null && opening_hash[id] !== null) {
      var newPlayer: PlayerExtraStats = {
        id: Number(id),
        name: flash_hash[id].name,
        flashStats: flash_hash[id],
        openStats: opening_hash[id],
        pistolStats: pistol_hash[id],
      }
      playerExtraStats[Number(id)] = newPlayer
    }
  }
  return playerExtraStats
}
