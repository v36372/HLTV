import { TeamExtraStats, TeamFTUStats, TeamPistolStats } from '../models/TeamExtraStats'
import { Team } from '../models/Team'
import { HLTVConfig } from '../config'
import { fetchPage, toArray } from '../utils/mappers'
import { RankingFilter } from '../enums/RankingFilter'
import { stringify } from 'querystring'

export const getTeamExtraStats = (config: HLTVConfig) => async ({
  startDate,
  endDate,
  rankingFilter,
}: {
  startDate?: string
  endDate?: string
  rankingFilter?: RankingFilter
}): Promise<{}> => {
  const query = stringify({
    startDate,
    endDate,
    rankingFilter,
  })
  const f_ct$ = await fetchPage(
    `${config.hltvUrl}/stats/teams/ftu?${query}&side=COUNTER_TERRORIST`,
    config.loadPage
  )
  const p_ct$ = await fetchPage(
    `${config.hltvUrl}/stats/teams/pistols?${query}&side=COUNTER_TERRORIST`,
    config.loadPage
  )
  const f_t$ = await fetchPage(
    `${config.hltvUrl}/stats/teams/ftu?${query}&side=TERRORIST`,
    config.loadPage
  )
  const p_t$ = await fetchPage(
    `${config.hltvUrl}/stats/teams/pistols?${query}&side=TERRORIST`,
    config.loadPage
  )

  let teamsExtraStats = {}
  var create_ftu_hash = function (f) {
    var ftu_hash = {}
    toArray(f('.stats-table tbody tr')).forEach((rowEl) => {
      var shit = toArray(rowEl.find('td')).map((colEl) => {
        return colEl.text()
      })
      if (shit.length < 10) return
      const id = Number(rowEl.find('td').eq(0).find('a').attr('href')!.split('/')[3])
      const name = rowEl.find('td').eq(0).find('a').text()
      const maps_played = Number(rowEl.find('td').eq(1).text())
      const p_round_wins = rowEl.find('td:nth-child(3)').text()
      const p_opk = rowEl.find('td:nth-child(4)').text()
      const p_multik = rowEl.find('td:nth-child(5)').text()
      const p_5vs4 = rowEl.find('td:nth-child(6)').text()
      const p_4vs5 = rowEl.find('td:nth-child(7)').text()
      const p_traded = rowEl.find('td:nth-child(8)').text()
      const utility_adr = rowEl.find('td:nth-child(9)').text()
      const utility_fa = rowEl.find('td:nth-child(10)').text()

      const newFtu: TeamFTUStats = {
        id,
        name,
        maps_played,
        p_round_wins,
        p_opk,
        p_multik,
        p_5vs4,
        p_4vs5,
        p_traded,
        utility_adr,
        utility_fa,
      }
      ftu_hash[id] = newFtu
    })
    return ftu_hash
  }

  var create_pistol_hash = function (p) {
    var pistols_hash = {}
    toArray(p('.stats-table tbody tr')).forEach((rowpistolEl) => {
      const id = Number(rowpistolEl.find('td').eq(0).find('a').attr('href')!.split('/')[3])
      const name = rowpistolEl.find('td').eq(0).text()
      const p_win = rowpistolEl.find('td').eq(3).text()
      const p_2_conv = rowpistolEl.find('td').eq(4).text()
      const p_2_break = rowpistolEl.find('td').eq(5).text()

      const newPistol: TeamPistolStats = { id, name, p_win, p_2_conv, p_2_break }
      pistols_hash[id] = newPistol
    })

    return pistols_hash
  }

  var ftu_hash_ct = create_ftu_hash(f_ct$)
  var ftu_hash_t = create_ftu_hash(f_t$)
  var pistol_hash_ct = create_pistol_hash(p_ct$)
  var pistol_hash_t = create_pistol_hash(p_t$)

  for (var id in ftu_hash_ct) {
    if (pistol_hash_ct[id] !== null) {
      const team: Team = { id: Number(id), name: ftu_hash_ct[id].name }
      var newTeam: TeamExtraStats = {
        team: team,
        ftu_ct: ftu_hash_ct[id],
        ftu_t: ftu_hash_t[id],
        pistol_ct: pistol_hash_ct[id],
        pistol_t: pistol_hash_t[id],
      }
      teamsExtraStats[Number(team.id)] = newTeam
    }
  }
  return teamsExtraStats
}
