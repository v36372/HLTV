import { defaultLoadPage } from './utils/mappers'
import { HttpsProxyAgent } from 'https-proxy-agent'

export interface HLTVConfig {
  hltvUrl?: string
  hltvStaticUrl?: string
  loadPage?: (string, Object) => Promise<string>
  httpAgent?: HttpsProxyAgent
}

const defaultAgent = undefined

export const defaultConfig: HLTVConfig = {
  hltvUrl: 'https://www.hltv.org',
  hltvStaticUrl: 'https://static.hltv.org',
  httpAgent: defaultAgent,
  loadPage: defaultLoadPage,
}
