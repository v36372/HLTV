import { FullTeamStats } from '../models/FullTeamStats'
import { fetchPage, toArray, getMapSlug } from '../utils/mappers'
import { RankingFilter } from '../enums/RankingFilter'
import { stringify } from 'querystring'
import { defaultConfig as config } from '../config'

export const getTeamStats = (proxy: string) => async ({
  id,
  startDate,
  endDate,
  rankingFilter,
}: {
  id: number
  startDate?: string
  endDate?: string
  rankingFilter?: RankingFilter
}): Promise<FullTeamStats> => {
  const query = stringify({
    startDate,
    endDate,
    rankingFilter,
  })
  const $ = await fetchPage(`${config.hltvUrl}/stats/teams/${id}/-?${query}`, proxy)
  /*
  const m$ = await fetchPage(`${config.hltvUrl}/stats/teams/matches/${id}/-?${query}`, config.loadPage)
  const e$ = await fetchPage(
    `${config.hltvUrl}/stats/teams/events/${id}/-?${query}`,
    config.loadPage
  )
  */

  const mp$ = await fetchPage(`${config.hltvUrl}/stats/teams/maps/${id}/-?${query}`, proxy)

  const overviewStats = $('.standard-box .large-strong')
  const getOverviewStatByIndex = (i) => Number(overviewStats.eq(i).text())
  const [wins, draws, losses] = overviewStats.eq(1).text().split('/').map(Number)

  const overview = {
    mapsPlayed: getOverviewStatByIndex(0),
    totalKills: getOverviewStatByIndex(2),
    totalDeaths: getOverviewStatByIndex(3),
    roundsPlayed: getOverviewStatByIndex(4),
    kdRatio: getOverviewStatByIndex(5),
    wins,
    draws,
    losses,
  }

  const getContainerByText = (text) =>
    $('.standard-headline')
      .filter((_, el) => $(el).text() === text)
      .parent()
      .next()

  const getPlayersByContainer = (container) =>
    toArray(container.find('.image-and-label')).map((playerEl) => ({
      id: Number(playerEl.attr('href')!.split('/')[3]),
      name: playerEl.find('.text-ellipsis').text(),
    }))

  const currentLineup = getPlayersByContainer(getContainerByText('Current lineup'))
  const historicPlayers = getPlayersByContainer(getContainerByText('Historic players'))
  const standins = getPlayersByContainer(getContainerByText('Standins'))

  // const matches = toArray(m$('.stats-table tbody tr')).map(matchEl => ({
  // dateApproximate: getTimestamp(matchEl.find('.time a').text()),
  // event: {
  // id: Number(popSlashSource(matchEl.find('.image-and-label img'))!.split('.')[0]),
  // name: matchEl.find('.image-and-label img').attr('title')!
  // },
  // enemyTeam: {
  // id: Number(
  // matchEl
  // .find('img.flag')
  // .parent()
  // .attr('href')!
  // .split('/')[3]
  // ),
  // name: matchEl
  // .find('img.flag')
  // .parent()
  // .contents()
  // .last()
  // .text()
  // },
  // map: getMapSlug(matchEl.find('.statsMapPlayed span').text()),
  // mapStatsId: Number(
  // matchEl
  // .find('.time a')
  // .attr('href')!
  // .split('/')[4]
  // ),
  // result: matchEl.find('.statsDetail').text()
  // }))

  /*
  const events = toArray(e$('.stats-table tbody tr')).map((eventEl) => ({
    place: eventEl.find('.statsCenterText').text(),
    event: {
      id: Number(eventEl.find('.image-and-label').first().attr('href')!.split('=')[1]),
      name: eventEl.find('.image-and-label').first().attr('title')!,
    },
  }))
  */

  const getMapStat = (mapEl, i) => mapEl.find('.stats-row').eq(i).children().last().text()
  const getBiggest = (el, i) => {
    var a = el.find('.col').eq(i).find('a').attr('href')
    return a ? a.split('/')[4] : ''
  }

  const mapStats = toArray(mp$('.two-grid .col .stats-rows')).reduce((stats, mapEl) => {
    const mapName = getMapSlug(mapEl.prev().find('.map-pool-map-name').text())

    stats[mapName] = {
      wins: Number(getMapStat(mapEl, 0).split(' / ')[0]),
      draws: Number(getMapStat(mapEl, 0).split(' / ')[1]),
      losses: Number(getMapStat(mapEl, 0).split(' / ')[2]),
      winRate: Number(getMapStat(mapEl, 1).split('%')[0]),
      totalRounds: Number(getMapStat(mapEl, 2)),
      roundWinPAfterFirstKill: Number(getMapStat(mapEl, 3).split('%')[0]),
      roundWinPAfterFirstDeath: Number(getMapStat(mapEl, 4).split('%')[0]),
      biggest_win: getBiggest(mapEl.next(), 0),
      biggest_lost: getBiggest(mapEl.next(), 1),
    }

    return stats
  }, {})

  return { overview, currentLineup, historicPlayers, standins, mapStats }
}
