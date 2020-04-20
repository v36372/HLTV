import { FullStream } from '../models/FullStream'
import { Country } from '../models/Country'
import { StreamCategory } from '../enums/StreamCategory'
import { popSlashSource } from '../utils/parsing'
import { fetchPage, toArray } from '../utils/mappers'
import { defaultConfig as config } from '../config'

export const getStreams = (proxy: string) => async ({
  loadLinks,
}: { loadLinks?: boolean } = {}): Promise<FullStream[]> => {
  const $ = await fetchPage(`${config.hltvUrl}`, proxy)

  const streams = Promise.all(
    toArray($('a.col-box.streamer')).map(async (streamEl) => {
      const name = streamEl.find('.name').text()
      const category = streamEl.children().first().attr('title') as StreamCategory

      const country: Country = {
        name: streamEl.find('.flag').attr('title')!,
        code: (popSlashSource(streamEl.find('.flag')) as string).split('.')[0],
      }

      const viewers = Number(streamEl.contents().last().text())
      const hltvLink = streamEl.attr('href')!

      const stream = { name, category, country, viewers, hltvLink }

      if (loadLinks) {
        const $streamPage = await fetchPage(`${config.hltvUrl}${hltvLink}`, proxy)
        const realLink = $streamPage('iframe').attr('src')!

        return { ...stream, realLink }
      }

      return stream
    })
  )

  return await streams
}
