import { FullPlayerStats, IndividualStats, ClutchesStats } from '../models/FullPlayerStats'
import { Team } from '../models/Team'
import { stringify } from 'querystring'
import { HLTVConfig } from '../config'
import { MatchType } from '../enums/MatchType'
import { RankingFilter } from '../enums/RankingFilter'
import { fetchPage } from '../utils/mappers'
import { popSlashSource } from '../utils/parsing'

export const getPlayerStats = (config: HLTVConfig) => async ({
  id,
  startDate,
  endDate,
  matchType,
  rankingFilter,
}: {
  id: number
  startDate?: string
  endDate?: string
  matchType?: MatchType
  rankingFilter?: RankingFilter
}): Promise<FullPlayerStats> => {
  const query = stringify({
    startDate,
    endDate,
    matchType,
    rankingFilter,
  })

  const $ = await fetchPage(`${config.hltvUrl}/stats/players/${id}/-?${query}`, config.loadPage)
  const i$ = await fetchPage(
    `${config.hltvUrl}/stats/players/individual/${id}/-?${query}`,
    config.loadPage
  )
  const c_1$ = await fetchPage(
    `${config.hltvUrl}/stats/players/clutches/${id}/1on1/-?${query}`,
    config.loadPage
  )
  /*
  const c_2$ = await fetchPage(
    `${config.hltvUrl}/stats/players/individual/${id}/1on2/-?${query}`,
    config.loadPage
  )
  */

  const name = $('.summaryRealname div').text() || undefined
  const ign = $('.context-item-name').text()

  const imageUrl = $('.context-item-image').attr('src')!
  const image = imageUrl.includes('blankplayer') ? undefined : imageUrl

  const age = parseInt($('.summaryPlayerAge').text(), 10) || undefined

  const flagEl = $('.summaryRealname .flag')
  const country = {
    name: flagEl.attr('title')!,
    code: popSlashSource(flagEl)!.split('.')[0],
  }

  const teamNameEl = $('.SummaryTeamname')
  const team: Team | undefined =
    teamNameEl.text() !== 'No team'
      ? {
          name: teamNameEl.text(),
          id: Number(teamNameEl.find('a').attr('href')!.split('/')[3]),
        }
      : undefined

  const getStats = (i: number) => $($($('.stats-row').get(i)).find('span').get(1)).text()

  const statistics = {
    kills: getStats(0),
    headshots: getStats(1),
    deaths: getStats(2),
    kdRatio: getStats(3),
    damagePerRound: getStats(4),
    grenadeDamagePerRound: getStats(5),
    mapsPlayed: getStats(6),
    roundsPlayed: getStats(7),
    killsPerRound: getStats(8),
    assistsPerRound: getStats(9),
    deathsPerRound: getStats(10),
    savedByTeammatePerRound: getStats(11),
    savedTeammatesPerRound: getStats(12),
    rating: getStats(13),
  }

  const getIStats = (i: number, j: number) =>
    i$('.col.stats-rows').eq(i).find('.stats-row').eq(j).find('span').eq(1).text()

  const individualStats: IndividualStats = {
    totalOpeningKills: Number(getIStats(0, 6)),
    totalOpeningDeaths: Number(getIStats(0, 7)),
    openingKillRatio: Number(getIStats(0, 8)),
    openingKillRating: Number(getIStats(0, 9)),
    p_teamWinAfterFirstKill: getIStats(0, 10),
    p_firstKillInWonRounds: getIStats(0, 11),
    r_0_kill: Number(getIStats(1, 0)),
    r_1_kill: Number(getIStats(1, 1)),
    r_2_kill: Number(getIStats(1, 2)),
    r_3_kill: Number(getIStats(1, 3)),
    r_4_kill: Number(getIStats(1, 4)),
    r_5_kill: Number(getIStats(1, 5)),
    rifle_kill: Number(getIStats(1, 6)),
    sniper_kill: Number(getIStats(1, 7)),
    smg_kill: Number(getIStats(1, 8)),
    pistol_kill: Number(getIStats(1, 9)),
    grenade_kill: Number(getIStats(1, 10)),
    other_kill: Number(getIStats(1, 11)),
  }

  const clutchesStats: ClutchesStats = {
    w_1on1: Number(c_1$('.summary-box.standard-box .value').eq(0).text()),
    l_1on1: Number(c_1$('.summary-box.standard-box .value').eq(1).text()),
    // w_1on2: Number(c_2$('.summary-box.standard-box .value').eq(0).text()),
    // l_1on2: Number(c_2$('.summary-box.standard-box .value').eq(1).text()),
  }

  return { name, ign, image, age, country, team, statistics, individualStats, clutchesStats }
}
