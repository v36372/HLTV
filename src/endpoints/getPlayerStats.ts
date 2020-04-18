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
  const c_2$ = await fetchPage(
    `${config.hltvUrl}/stats/players/individual/${id}/1on2/-?${query}`,
    config.loadPage
  )

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

  var col_1 = i$('.col.stats-rows').eq(0)
  var col_2 = i$('.col.stats-rows').eq(1)

  const individualStats: IndividualStats = {
    totalOpeningKills: Number(col_1.find('.stats-row').eq(6).find('span').text()),
    totalOpeningDeaths: Number(col_1.find('.stats-row').eq(7).find('span').text()),
    openingKillRatio: Number(col_1.find('.stats-row').eq(8).find('span').text()),
    openingKillRating: Number(col_1.find('.stats-row').eq(9).find('span').text()),
    p_teamWinAfterFirstKill: col_1.find('.stats-row').eq(10).find('span').text(),
    p_firstKillInWonRounds: col_1.find('.stats-row').eq(11).find('span').text(),
    r_0_kill: Number(col_2.find('.stats-row').eq(0).find('span').text()),
    r_1_kill: Number(col_2.find('.stats-row').eq(1).find('span').text()),
    r_2_kill: Number(col_2.find('.stats-row').eq(2).find('span').text()),
    r_3_kill: Number(col_2.find('.stats-row').eq(3).find('span').text()),
    r_4_kill: Number(col_2.find('.stats-row').eq(4).find('span').text()),
    r_5_kill: Number(col_2.find('.stats-row').eq(5).find('span').text()),
    rifle_kill: Number(col_2.find('.stats-row').eq(6).find('span').text()),
    sniper_kill: Number(col_2.find('.stats-row').eq(7).find('span').text()),
    smg_kill: Number(col_2.find('.stats-row').eq(8).find('span').text()),
    pistol_kill: Number(col_2.find('.stats-row').eq(9).find('span').text()),
    grenade_kill: Number(col_2.find('.stats-row').eq(10).find('span').text()),
    other_kill: Number(col_2.find('.stats-row').eq(11).find('span').text()),
  }

  const clutchesStats: ClutchesStats = {
    w_1on1: Number(c_1$('.summary-box.standard-box .value').eq(0).text()),
    l_1on1: Number(c_1$('.summary-box.standard-box .value').eq(1).text()),
    w_1on2: Number(c_2$('.summary-box.standard-box .value').eq(0).text()),
    l_1on2: Number(c_2$('.summary-box.standard-box .value').eq(1).text()),
  }

  return { name, ign, image, age, country, team, statistics, individualStats, clutchesStats }
}
