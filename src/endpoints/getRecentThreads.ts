import { Thread } from '../models/Thread'
import { ThreadCategory } from '../enums/ThreadCategory'
import { fetchPage, toArray } from '../utils/mappers'
import { defaultConfig as config } from '../config'

export const getRecentThreads = (proxy: string) => async (): Promise<Thread[]> => {
  const $ = await fetchPage(`${config.hltvUrl}`, proxy)

  const threads = toArray($('.activity')).map((threadEl) => {
    const title = threadEl.find('.topic').text()
    const link = threadEl.attr('href')!
    const replies = Number(threadEl.contents().last().text())
    const category = threadEl
      .attr('class')!
      .split(' ')
      .find((c) => c.includes('Cat'))!
      .replace('Cat', '') as ThreadCategory

    return { title, link, replies, category }
  })

  return threads
}
