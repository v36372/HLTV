import { defaultConfig, HLTVConfig } from './config'
import { connectToScorebot } from './endpoints/connectToScorebot'
import { getMatch } from './endpoints/getMatch'
import { getMatches } from './endpoints/getMatches'
import { getMatchesStats } from './endpoints/getMatchesStats'
import { getMatchMapStats } from './endpoints/getMatchMapStats'
import { getMatchStats } from './endpoints/getMatchStats'
import { getRecentThreads } from './endpoints/getRecentThreads'
import { getResults } from './endpoints/getResults'
import { getStreams } from './endpoints/getStreams'
import { getTeamRanking } from './endpoints/getTeamRanking'
import { getTeam } from './endpoints/getTeam'
import { getTeamStats } from './endpoints/getTeamStats'
import { getTeamExtraStats } from './endpoints/getTeamExtraStats'
import { getPlayer } from './endpoints/getPlayer'
import { getPlayerByName } from './endpoints/getPlayerByName'
import { getEvent } from './endpoints/getEvent'
import { getPlayerStats } from './endpoints/getPlayerStats'
import { getPlayerRanking } from './endpoints/getPlayerRanking'
import { MapSlug } from './enums/MapSlug'
import { Map } from './enums/Map'
import { MatchType } from './enums/MatchType'
import { RankingFilter } from './enums/RankingFilter'
import { StreamCategory } from './enums/StreamCategory'
import { ThreadCategory } from './enums/ThreadCategory'
import { ContentFilter } from './enums/ContentFilter'
import { EventSize } from './enums/EventSize'
import { WinType } from './enums/WinType'
import { getEvents } from './endpoints/getEvents'
import { defaultLoadPage } from './utils/mappers'
import { HttpsProxyAgent } from 'https-proxy-agent'

export class HLTVFactory {
  constructor(private readonly config: HLTVConfig) {
    if (!config.hltvStaticUrl) {
      config.hltvStaticUrl = defaultConfig.hltvStaticUrl
    }
    if (!config.hltvUrl) {
      config.hltvUrl = defaultConfig.hltvUrl
    }
    if (config.httpAgent && !config.loadPage) {
      config.loadPage = defaultLoadPage(config.httpAgent)
    }
    if (!config.httpAgent) {
      config.httpAgent = defaultConfig.httpAgent
    }
    if (!config.loadPage) {
      config.loadPage = defaultConfig.loadPage
    }
  }

  connectToScorebot = connectToScorebot(this.config)
  getMatch = getMatch(this.config)
  getMatches = getMatches(this.config)
  getMatchesStats = getMatchesStats(this.config)
  getMatchStats = getMatchStats(this.config)
  getMatchMapStats = getMatchMapStats(this.config)
  getRecentThreads = getRecentThreads(this.config)
  getResults = getResults(this.config)
  getStreams = getStreams(this.config)
  getTeamRanking = getTeamRanking(this.config)
  getTeam = getTeam(this.config)
  getTeamStats = getTeamStats(this.config)
  getTeamExtraStats = getTeamExtraStats(this.config)
  getPlayer = getPlayer(this.config)
  getPlayerByName = getPlayerByName(this.config)
  getEvent = getEvent(this.config)
  getEvents = getEvents(this.config)
  getPlayerStats = getPlayerStats(this.config)
  getPlayerRanking = getPlayerRanking(this.config)

  public createInstance(config: HLTVConfig) {
    return new HLTVFactory(config)
  }

  public changeAgent(newAgent: HttpsProxyAgent) {
    this.config.httpAgent = newAgent
    this.config.loadPage = defaultLoadPage(this.config.httpAgent)
  }
}

const hltvInstance = new HLTVFactory(defaultConfig)

export default hltvInstance
export {
  hltvInstance as HLTV,
  MapSlug,
  Map,
  MatchType,
  RankingFilter,
  StreamCategory,
  ThreadCategory,
  WinType,
  EventSize,
  ContentFilter,
}
