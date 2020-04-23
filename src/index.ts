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
import { getEvent } from './endpoints/getEvent'
import { getPlayerStats } from './endpoints/getPlayerStats'
import { getPlayerExtraStats } from './endpoints/getPlayerExtraStats'
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

export class HLTVFactory {
  constructor(private readonly proxy: string) {}

  connectToScorebot = connectToScorebot(this.proxy)
  getMatch = getMatch(this.proxy)
  getMatches = getMatches(this.proxy)
  getMatchesStats = getMatchesStats(this.proxy)
  getMatchStats = getMatchStats(this.proxy)
  getMatchMapStats = getMatchMapStats(this.proxy)
  getRecentThreads = getRecentThreads(this.proxy)
  getResults = getResults(this.proxy)
  getStreams = getStreams(this.proxy)
  getTeamRanking = getTeamRanking(this.proxy)
  getTeam = getTeam(this.proxy)
  getTeamStats = getTeamStats(this.proxy)
  getTeamExtraStats = getTeamExtraStats(this.proxy)
  getPlayer = getPlayer(this.proxy)
  getEvent = getEvent(this.proxy)
  getEvents = getEvents(this.proxy)
  getPlayerStats = getPlayerStats(this.proxy)
  getPlayerExtraStats = getPlayerExtraStats(this.proxy)
  getPlayerRanking = getPlayerRanking(this.proxy)

  public createInstance(proxy) {
    return new HLTVFactory(proxy)
  }
}

const hltvInstance = new HLTVFactory('')

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
