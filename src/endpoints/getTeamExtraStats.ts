import { TeamExtraStats } from '../models/TeamExtraStats'
import { Team } from '../models/Team'
import { HLTVConfig } from '../config'
import { fetchPage, toArray } from '../utils/mappers'
import { RankingFilter } from '../enums/RankingFilter'

export const getTeamStats = (config: HLTVConfig) => async ({
	startDate,
	endDate,
	rankingFilter
}: {
	startDate?: string
	endDate?: string
	rankingFilter?: RankingFilter
}): Promise<TeamExtraStats[]> => {
	const query = stringify({
		startDate,
		endDate,
		rankingFilter
	})
	const f$ = await fetchPage(`${config.hltvUrl}/stats/teams/ftu?${query}`, config.loadPage)
	const p$ = await fetchPage(`${config.hltvUrl}/stats/teams/pistols?${query}`, config.loadPage)

	let teamsExtraStats: TeamExtraStats[] = []
	const ftu_array: TeamFTUStats[] = toArray(f$('.stats-table tbody tr')).map(rowEl => {
		const columns = toArray(rowEl.find('td'))
		const id = columns[0].attr('href')!.split('/')[3]
		const name = columns[0].text()
		const maps_played = columns[1].text()
		const p_round_wins = columns[2].text()
		const p_opk = columns[3].text()
		const p_multik = columns[4].text()
		const p_5vs4 = columns[5].text()
		const p_4vs5 = columns[6].text()
		const p_traded = columns[7].text()
		const utility_adr = columns[8].text()
		const utility_fa = columns[9].text()

		return { id, name, maps_played, p_round_wins, p_opk, p_multik, p_5vs4, p_4vs5, p_traded, utility_adr, utility_fa }
	})

	const pistols_array: TeamPistolStats[] = toArray(p$('.stats-table tbody tr')).map(rowEl => {
		const columns = toArray(rowEl.find('td'))
		const id = columns[0].attr('href')!.split('/')[3]
		const name = columns[0].text()
		const p_win = columns[3].text()
		const p_2_conv = columns[4].text()
		const p_2_break = columns[5].text()
		return { id, name, p_win, p_2_conv, p_2_break }
	})

	ftu_array.forEach(function(item, index){
		const team: Team = { id: Number(item.id), name: item.name }
		teamsExtraStats.push({team: team, ftu: item, pistol: pistols_array[index] })
	})
	return teamsExtraStats
}
